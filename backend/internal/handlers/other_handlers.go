package handlers

import (
	"net/http"
	"strconv"

	"github.com/google/uuid"
	"github.com/lamsa/backend/internal/middleware"
	"github.com/lamsa/backend/internal/models"
	"github.com/lamsa/backend/internal/repositories"
	"github.com/lamsa/backend/internal/utils"
	"github.com/lamsa/backend/internal/validators"
)

// ============================================
// CATEGORY HANDLER
// ============================================

type CategoryHandler struct {
	repo *repositories.CategoryRepository
}

func NewCategoryHandler(repo *repositories.CategoryRepository) *CategoryHandler {
	return &CategoryHandler{repo: repo}
}

func (h *CategoryHandler) List(w http.ResponseWriter, r *http.Request) {
	activeOnly := !isAdminRoute(r)
	cats, err := h.repo.List(r.Context(), activeOnly)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "failed to fetch categories")
		return
	}
	if cats == nil { cats = []models.Category{} }
	utils.WriteSuccess(w, cats)
}

func (h *CategoryHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, "invalid ID")
		return
	}
	cat, err := h.repo.GetByID(r.Context(), id)
	if err != nil {
		utils.WriteError(w, http.StatusNotFound, "category not found")
		return
	}
	utils.WriteSuccess(w, cat)
}

func (h *CategoryHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req validators.CreateCategoryRequest
	if err := utils.ParseJSON(r, &req); err != nil {
		utils.WriteError(w, http.StatusBadRequest, "invalid request")
		return
	}
	if errs := validators.ValidateCreateCategory(req); errs.HasErrors() {
		utils.WriteJSON(w, http.StatusBadRequest, map[string]interface{}{"success": false, "errors": errs})
		return
	}
	cat := &models.Category{
		Name: req.Name, Slug: utils.Slugify(req.Name), Description: req.Description,
		ImageURL: req.ImageURL, ParentID: req.ParentID, SortOrder: req.SortOrder, IsActive: true,
	}
	if err := h.repo.Create(r.Context(), cat); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "failed to create category")
		return
	}
	utils.WriteCreated(w, cat)
}

func (h *CategoryHandler) Update(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, "invalid ID")
		return
	}
	cat, err := h.repo.GetByID(r.Context(), id)
	if err != nil {
		utils.WriteError(w, http.StatusNotFound, "category not found")
		return
	}
	var req validators.CreateCategoryRequest
	if err := utils.ParseJSON(r, &req); err != nil {
		utils.WriteError(w, http.StatusBadRequest, "invalid request")
		return
	}
	cat.Name = req.Name
	cat.Slug = utils.Slugify(req.Name)
	cat.Description = req.Description
	cat.ImageURL = req.ImageURL
	cat.ParentID = req.ParentID
	cat.SortOrder = req.SortOrder
	if err := h.repo.Update(r.Context(), cat); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "failed to update")
		return
	}
	utils.WriteSuccess(w, cat)
}

func (h *CategoryHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, "invalid ID")
		return
	}
	if err := h.repo.Delete(r.Context(), id); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "failed to delete")
		return
	}
	utils.WriteMessage(w, "category deleted")
}

// ============================================
// ORDER HANDLER
// ============================================

type OrderHandler struct {
	orderRepo    *repositories.OrderRepository
	productRepo  *repositories.ProductRepository
	customerRepo *repositories.CustomerRepository
}

func NewOrderHandler(orderRepo *repositories.OrderRepository, productRepo *repositories.ProductRepository, customerRepo *repositories.CustomerRepository) *OrderHandler {
	return &OrderHandler{orderRepo: orderRepo, productRepo: productRepo, customerRepo: customerRepo}
}

func (h *OrderHandler) List(w http.ResponseWriter, r *http.Request) {
	filter := repositories.OrderFilter{
		Status:  utils.GetQueryString(r, "status", ""),
		Search:  utils.GetQueryString(r, "search", ""),
		Source:  utils.GetQueryString(r, "source", ""),
		Page:    utils.GetQueryInt(r, "page", 1),
		PerPage: utils.GetQueryInt(r, "per_page", 20),
	}
	orders, total, err := h.orderRepo.List(r.Context(), filter)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "failed to fetch orders")
		return
	}
	if orders == nil { orders = []models.Order{} }
	utils.WritePaginated(w, orders, total, filter.Page, filter.PerPage)
}

func (h *OrderHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, "invalid order ID")
		return
	}
	order, err := h.orderRepo.GetByID(r.Context(), id)
	if err != nil {
		utils.WriteError(w, http.StatusNotFound, "order not found")
		return
	}
	utils.WriteSuccess(w, order)
}

func (h *OrderHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req validators.CreateOrderRequest
	if err := utils.ParseJSON(r, &req); err != nil {
		utils.WriteError(w, http.StatusBadRequest, "invalid request")
		return
	}
	if errs := validators.ValidateCreateOrder(req); errs.HasErrors() {
		utils.WriteJSON(w, http.StatusBadRequest, map[string]interface{}{"success": false, "errors": errs})
		return
	}
	customer, err := h.customerRepo.FindOrCreate(r.Context(), req.CustomerName, req.CustomerPhone, req.CustomerCity, req.CustomerAddress)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "failed to process customer")
		return
	}
	var subtotal float64
	var orderItems []models.OrderItem
	for _, item := range req.Items {
		prodID, _ := uuid.Parse(item.ProductID)
		product, err := h.productRepo.GetByID(r.Context(), prodID)
		if err != nil { continue }
		price := product.BasePrice
		if product.SalePrice != nil { price = *product.SalePrice }
		itemTotal := price * float64(item.Quantity)
		subtotal += itemTotal
		oi := models.OrderItem{
			ProductID: &prodID, ProductName: product.Name,
			Quantity: item.Quantity, UnitPrice: price, TotalPrice: itemTotal,
			VariantID: item.VariantID,
		}
		if len(product.Images) > 0 { oi.ProductImage = product.Images[0].URL }
		if item.VariantID != nil {
			for _, v := range product.Variants {
				if v.ID == *item.VariantID {
					oi.Size = v.Size
					oi.Color = v.Color
					if v.PriceOverride != nil {
						oi.UnitPrice = *v.PriceOverride
						oi.TotalPrice = *v.PriceOverride * float64(item.Quantity)
						subtotal = subtotal - itemTotal + oi.TotalPrice
					}
				}
			}
		}
		orderItems = append(orderItems, oi)
	}
	order := &models.Order{
		CustomerID: &customer.ID, Status: models.OrderPending, Source: models.OrderSourceWebsite,
		Subtotal: subtotal, Total: subtotal, Currency: "MAD",
		CustomerName: req.CustomerName, CustomerPhone: req.CustomerPhone,
		CustomerCity: req.CustomerCity, CustomerAddress: req.CustomerAddress, Notes: req.Notes,
	}
	if err := h.orderRepo.Create(r.Context(), order); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "failed to create order")
		return
	}
	for i := range orderItems {
		orderItems[i].OrderID = order.ID
		h.orderRepo.AddItem(r.Context(), &orderItems[i])
	}
	order.Items = orderItems
	utils.WriteCreated(w, order)
}

func (h *OrderHandler) UpdateStatus(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, "invalid order ID")
		return
	}
	var req struct {
		Status string `json:"status"`
		Note   string `json:"note"`
	}
	if err := utils.ParseJSON(r, &req); err != nil {
		utils.WriteError(w, http.StatusBadRequest, "invalid request")
		return
	}
	claims := middleware.GetUserClaims(r)
	var changedBy *uuid.UUID
	if claims != nil { changedBy = &claims.UserID }
	if err := h.orderRepo.UpdateStatus(r.Context(), id, models.OrderStatus(req.Status), changedBy, req.Note); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "failed to update status")
		return
	}
	utils.WriteMessage(w, "order status updated")
}

// ============================================
// REVIEW HANDLER
// ============================================

type ReviewHandler struct {
	repo *repositories.ReviewRepository
}

func NewReviewHandler(repo *repositories.ReviewRepository) *ReviewHandler {
	return &ReviewHandler{repo: repo}
}

func (h *ReviewHandler) ListByProduct(w http.ResponseWriter, r *http.Request) {
	prodID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, "invalid product ID")
		return
	}
	reviews, err := h.repo.ListByProduct(r.Context(), prodID, true)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "failed to fetch reviews")
		return
	}
	if reviews == nil { reviews = []models.Review{} }
	utils.WriteSuccess(w, reviews)
}

func (h *ReviewHandler) ListAll(w http.ResponseWriter, r *http.Request) {
	status := utils.GetQueryString(r, "status", "")
	page := utils.GetQueryInt(r, "page", 1)
	perPage := utils.GetQueryInt(r, "per_page", 20)
	reviews, total, err := h.repo.ListAll(r.Context(), status, page, perPage)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "failed to fetch reviews")
		return
	}
	if reviews == nil { reviews = []models.Review{} }
	utils.WritePaginated(w, reviews, total, page, perPage)
}

func (h *ReviewHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req validators.CreateReviewRequest
	if err := utils.ParseJSON(r, &req); err != nil {
		utils.WriteError(w, http.StatusBadRequest, "invalid request")
		return
	}
	if errs := validators.ValidateCreateReview(req); errs.HasErrors() {
		utils.WriteJSON(w, http.StatusBadRequest, map[string]interface{}{"success": false, "errors": errs})
		return
	}
	prodID, _ := uuid.Parse(req.ProductID)
	rv := &models.Review{
		ProductID: prodID, CustomerName: req.CustomerName, CustomerEmail: req.CustomerEmail,
		Rating: req.Rating, Title: req.Title, Comment: req.Comment,
	}
	if err := h.repo.Create(r.Context(), rv); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "failed to create review")
		return
	}
	utils.WriteCreated(w, rv)
}

func (h *ReviewHandler) UpdateStatus(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, "invalid ID")
		return
	}
	var req struct{ Status string `json:"status"` }
	if err := utils.ParseJSON(r, &req); err != nil {
		utils.WriteError(w, http.StatusBadRequest, "invalid request")
		return
	}
	if err := h.repo.UpdateStatus(r.Context(), id, models.ReviewStatus(req.Status)); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "failed to update")
		return
	}
	utils.WriteMessage(w, "review status updated")
}

func (h *ReviewHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, "invalid ID")
		return
	}
	if err := h.repo.Delete(r.Context(), id); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "failed to delete")
		return
	}
	utils.WriteMessage(w, "review deleted")
}

// ============================================
// SETTINGS HANDLER
// ============================================

type SettingsHandler struct {
	repo *repositories.SettingsRepository
}

func NewSettingsHandler(repo *repositories.SettingsRepository) *SettingsHandler {
	return &SettingsHandler{repo: repo}
}

func (h *SettingsHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	settings, err := h.repo.GetAll(r.Context())
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "failed to fetch settings")
		return
	}
	utils.WriteSuccess(w, settings)
}

func (h *SettingsHandler) GetPublic(w http.ResponseWriter, r *http.Request) {
	publicKeys := []string{"site_name", "site_slogan", "whatsapp_number", "instagram_url", "facebook_url", "tiktok_url", "contact_email", "contact_phone", "contact_address", "hero_title", "hero_subtitle", "hero_image_1", "hero_image_2", "hero_image_3", "about_story", "about_mission", "about_vision", "footer_text", "shipping_cost", "free_shipping_threshold"}
	result := make(map[string]string)
	for _, key := range publicKeys {
		s, err := h.repo.GetByKey(r.Context(), key)
		if err == nil { result[key] = s.Value }
	}
	utils.WriteSuccess(w, result)
}

func (h *SettingsHandler) Update(w http.ResponseWriter, r *http.Request) {
	var req map[string]string
	if err := utils.ParseJSON(r, &req); err != nil {
		utils.WriteError(w, http.StatusBadRequest, "invalid request")
		return
	}
	if err := h.repo.BulkUpdate(r.Context(), req); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "failed to update settings")
		return
	}
	utils.WriteMessage(w, "settings updated")
}

// ============================================
// DASHBOARD HANDLER
// ============================================

type DashboardHandler struct {
	repo *repositories.DashboardRepository
}

func NewDashboardHandler(repo *repositories.DashboardRepository) *DashboardHandler {
	return &DashboardHandler{repo: repo}
}

func (h *DashboardHandler) GetStats(w http.ResponseWriter, r *http.Request) {
	stats, err := h.repo.GetStats(r.Context())
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "failed to fetch stats")
		return
	}
	recent, _ := h.repo.GetRecentOrders(r.Context(), 10)
	if recent == nil { recent = []models.RecentOrder{} }
	utils.WriteSuccess(w, map[string]interface{}{"stats": stats, "recent_orders": recent})
}

// ============================================
// NEWSLETTER HANDLER
// ============================================

type NewsletterHandler struct {
	repo *repositories.NewsletterRepository
}

func NewNewsletterHandler(repo *repositories.NewsletterRepository) *NewsletterHandler {
	return &NewsletterHandler{repo: repo}
}

func (h *NewsletterHandler) Subscribe(w http.ResponseWriter, r *http.Request) {
	var req validators.NewsletterRequest
	if err := utils.ParseJSON(r, &req); err != nil {
		utils.WriteError(w, http.StatusBadRequest, "invalid request")
		return
	}
	if errs := validators.ValidateNewsletter(req); errs.HasErrors() {
		utils.WriteJSON(w, http.StatusBadRequest, map[string]interface{}{"success": false, "errors": errs})
		return
	}
	if err := h.repo.Subscribe(r.Context(), req.Email); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "failed to subscribe")
		return
	}
	utils.WriteMessage(w, "subscribed successfully")
}

// ============================================
// CUSTOMER HANDLER
// ============================================

type CustomerHandler struct {
	repo *repositories.CustomerRepository
}

func NewCustomerHandler(repo *repositories.CustomerRepository) *CustomerHandler {
	return &CustomerHandler{repo: repo}
}

func (h *CustomerHandler) List(w http.ResponseWriter, r *http.Request) {
	search := utils.GetQueryString(r, "search", "")
	page := utils.GetQueryInt(r, "page", 1)
	perPage := utils.GetQueryInt(r, "per_page", 20)
	customers, total, err := h.repo.List(r.Context(), search, page, perPage)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "failed to fetch customers")
		return
	}
	if customers == nil { customers = []models.Customer{} }
	utils.WritePaginated(w, customers, total, page, perPage)
}

// Helpers
func isAdminRoute(r *http.Request) bool {
	return len(r.URL.Path) > 10 && r.URL.Path[:10] == "/api/admin"
}
