package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/lamsa/backend/internal/auth"
	"github.com/lamsa/backend/internal/config"
	"github.com/lamsa/backend/internal/database"
	"github.com/lamsa/backend/internal/handlers"
	"github.com/lamsa/backend/internal/middleware"
	"github.com/lamsa/backend/internal/repositories"
)

func main() {
	cfg := config.Load()

	// Database
	pool, err := database.Connect(cfg.Database)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer pool.Close()

	// JWT Manager
	jwtManager := auth.NewJWTManager(cfg.JWT.AccessSecret, cfg.JWT.RefreshSecret, cfg.JWT.AccessExpiry, cfg.JWT.RefreshExpiry)

	// Repositories
	userRepo := repositories.NewUserRepository(pool)
	productRepo := repositories.NewProductRepository(pool)
	categoryRepo := repositories.NewCategoryRepository(pool)
	orderRepo := repositories.NewOrderRepository(pool)
	reviewRepo := repositories.NewReviewRepository(pool)
	settingsRepo := repositories.NewSettingsRepository(pool)
	dashboardRepo := repositories.NewDashboardRepository(pool)
	newsletterRepo := repositories.NewNewsletterRepository(pool)
	customerRepo := repositories.NewCustomerRepository(pool)

	// Handlers
	authHandler := handlers.NewAuthHandler(userRepo, jwtManager)
	productHandler := handlers.NewProductHandler(productRepo)
	categoryHandler := handlers.NewCategoryHandler(categoryRepo)
	orderHandler := handlers.NewOrderHandler(orderRepo, productRepo, customerRepo)
	reviewHandler := handlers.NewReviewHandler(reviewRepo)
	settingsHandler := handlers.NewSettingsHandler(settingsRepo)
	dashboardHandler := handlers.NewDashboardHandler(dashboardRepo)
	newsletterHandler := handlers.NewNewsletterHandler(newsletterRepo)
	customerHandler := handlers.NewCustomerHandler(customerRepo)

	// Router
	mux := http.NewServeMux()

	// ======== PUBLIC API ========
	mux.HandleFunc("GET /api/products", productHandler.List)
	mux.HandleFunc("GET /api/products/{id}", productHandler.GetByID)
	mux.HandleFunc("GET /api/categories", categoryHandler.List)
	mux.HandleFunc("GET /api/categories/{id}", categoryHandler.GetByID)
	mux.HandleFunc("GET /api/products/{id}/reviews", reviewHandler.ListByProduct)
	mux.HandleFunc("POST /api/reviews", reviewHandler.Create)
	mux.HandleFunc("POST /api/orders", orderHandler.Create)
	mux.HandleFunc("POST /api/newsletter/subscribe", newsletterHandler.Subscribe)
	mux.HandleFunc("GET /api/settings/public", settingsHandler.GetPublic)

	// ======== AUTH API ========
	mux.HandleFunc("POST /api/admin/login", authHandler.Login)
	mux.HandleFunc("POST /api/admin/logout", authHandler.Logout)
	mux.HandleFunc("POST /api/admin/refresh-token", authHandler.RefreshToken)

	// ======== ADMIN API (protected) ========
	adminAuth := middleware.Auth(jwtManager)
	adminRole := middleware.RequireRole("super_admin", "admin")
	staffRole := middleware.RequireRole("super_admin", "admin", "staff")

	// Admin - Me
	mux.Handle("GET /api/admin/me", adminAuth(http.HandlerFunc(authHandler.Me)))

	// Admin - Dashboard
	mux.Handle("GET /api/admin/dashboard/stats", adminAuth(staffRole(http.HandlerFunc(dashboardHandler.GetStats))))

	// Admin - Products
	mux.Handle("GET /api/admin/products", adminAuth(staffRole(http.HandlerFunc(productHandler.List))))
	mux.Handle("GET /api/admin/products/{id}", adminAuth(staffRole(http.HandlerFunc(productHandler.GetByID))))
	mux.Handle("POST /api/admin/products", adminAuth(adminRole(http.HandlerFunc(productHandler.Create))))
	mux.Handle("PUT /api/admin/products/{id}", adminAuth(adminRole(http.HandlerFunc(productHandler.Update))))
	mux.Handle("DELETE /api/admin/products/{id}", adminAuth(adminRole(http.HandlerFunc(productHandler.Delete))))
	mux.Handle("POST /api/admin/products/{id}/variants", adminAuth(adminRole(http.HandlerFunc(productHandler.AddVariant))))
	mux.Handle("DELETE /api/admin/products/{id}/variants/{variantId}", adminAuth(adminRole(http.HandlerFunc(productHandler.DeleteVariant))))
	mux.Handle("POST /api/admin/products/{id}/images", adminAuth(adminRole(http.HandlerFunc(productHandler.AddImage))))
	mux.Handle("DELETE /api/admin/products/{id}/images/{imageId}", adminAuth(adminRole(http.HandlerFunc(productHandler.DeleteImage))))

	// Admin - Categories
	mux.Handle("GET /api/admin/categories", adminAuth(staffRole(http.HandlerFunc(categoryHandler.List))))
	mux.Handle("POST /api/admin/categories", adminAuth(adminRole(http.HandlerFunc(categoryHandler.Create))))
	mux.Handle("PUT /api/admin/categories/{id}", adminAuth(adminRole(http.HandlerFunc(categoryHandler.Update))))
	mux.Handle("DELETE /api/admin/categories/{id}", adminAuth(adminRole(http.HandlerFunc(categoryHandler.Delete))))

	// Admin - Orders
	mux.Handle("GET /api/admin/orders", adminAuth(staffRole(http.HandlerFunc(orderHandler.List))))
	mux.Handle("GET /api/admin/orders/{id}", adminAuth(staffRole(http.HandlerFunc(orderHandler.GetByID))))
	mux.Handle("PATCH /api/admin/orders/{id}/status", adminAuth(adminRole(http.HandlerFunc(orderHandler.UpdateStatus))))

	// Admin - Reviews
	mux.Handle("GET /api/admin/reviews", adminAuth(staffRole(http.HandlerFunc(reviewHandler.ListAll))))
	mux.Handle("PATCH /api/admin/reviews/{id}/status", adminAuth(adminRole(http.HandlerFunc(reviewHandler.UpdateStatus))))
	mux.Handle("DELETE /api/admin/reviews/{id}", adminAuth(adminRole(http.HandlerFunc(reviewHandler.Delete))))

	// Admin - Customers
	mux.Handle("GET /api/admin/customers", adminAuth(staffRole(http.HandlerFunc(customerHandler.List))))

	// Admin - Settings
	mux.Handle("GET /api/admin/settings", adminAuth(adminRole(http.HandlerFunc(settingsHandler.GetAll))))
	mux.Handle("PUT /api/admin/settings", adminAuth(adminRole(http.HandlerFunc(settingsHandler.Update))))

	// Middleware stack
	handler := middleware.Recover(
		middleware.Logger(
			middleware.CORS(cfg.CORS.AllowedOrigins)(
				middleware.SecurityHeaders(mux),
			),
		),
	)

	// Server
	server := &http.Server{
		Addr:         ":" + cfg.Server.Port,
		Handler:      handler,
		ReadTimeout:  cfg.Server.ReadTimeout,
		WriteTimeout: cfg.Server.WriteTimeout,
		IdleTimeout:  cfg.Server.IdleTimeout,
	}

	// Graceful shutdown
	go func() {
		log.Printf("🚀 Lamsa API server starting on port %s", cfg.Server.Port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal("Server failed:", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	if err := server.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}
	log.Println("Server exited")
}
