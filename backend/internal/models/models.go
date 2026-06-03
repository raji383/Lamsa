package models

import (
	"time"

	"github.com/google/uuid"
)

// ============================================
// USER / ADMIN
// ============================================

type Role struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description,omitempty"`
}

type User struct {
	ID           uuid.UUID  `json:"id"`
	Email        string     `json:"email"`
	PasswordHash string     `json:"-"`
	FirstName    string     `json:"first_name"`
	LastName     string     `json:"last_name"`
	RoleID       int        `json:"role_id"`
	RoleName     string     `json:"role_name,omitempty"`
	IsActive     bool       `json:"is_active"`
	LastLogin    *time.Time `json:"last_login,omitempty"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
}

// ============================================
// CUSTOMER
// ============================================

type Customer struct {
	ID          uuid.UUID `json:"id"`
	FirstName   string    `json:"first_name"`
	LastName    string    `json:"last_name"`
	Email       string    `json:"email,omitempty"`
	Phone       string    `json:"phone"`
	City        string    `json:"city,omitempty"`
	Address     string    `json:"address,omitempty"`
	TotalOrders int       `json:"total_orders"`
	TotalSpent  float64   `json:"total_spent"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// ============================================
// CATEGORY
// ============================================

type Category struct {
	ID          int        `json:"id"`
	Name        string     `json:"name"`
	Slug        string     `json:"slug"`
	Description string     `json:"description,omitempty"`
	ImageURL    string     `json:"image_url,omitempty"`
	ParentID    *int       `json:"parent_id,omitempty"`
	SortOrder   int        `json:"sort_order"`
	IsActive    bool       `json:"is_active"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}

// ============================================
// PRODUCT
// ============================================

type Product struct {
	ID              uuid.UUID       `json:"id"`
	Name            string          `json:"name"`
	Slug            string          `json:"slug"`
	Description     string          `json:"description,omitempty"`
	Details         string          `json:"details,omitempty"`
	CategoryID      *int            `json:"category_id,omitempty"`
	CategoryName    string          `json:"category_name,omitempty"`
	BasePrice       float64         `json:"base_price"`
	SalePrice       *float64        `json:"sale_price,omitempty"`
	Currency        string          `json:"currency"`
	SKU             string          `json:"sku,omitempty"`
	IsFeatured      bool            `json:"is_featured"`
	IsBestSeller    bool            `json:"is_best_seller"`
	IsNewArrival    bool            `json:"is_new_arrival"`
	IsPublished     bool            `json:"is_published"`
	TotalSold       int             `json:"total_sold"`
	AvgRating       float64         `json:"avg_rating"`
	ReviewCount     int             `json:"review_count"`
	MetaTitle       string          `json:"meta_title,omitempty"`
	MetaDescription string          `json:"meta_description,omitempty"`
	SortOrder       int             `json:"sort_order"`
	Images          []ProductImage  `json:"images,omitempty"`
	Variants        []ProductVariant `json:"variants,omitempty"`
	CreatedAt       time.Time       `json:"created_at"`
	UpdatedAt       time.Time       `json:"updated_at"`
}

type ProductImage struct {
	ID        int    `json:"id"`
	ProductID uuid.UUID `json:"product_id"`
	URL       string `json:"url"`
	PublicID  string `json:"public_id,omitempty"`
	AltText   string `json:"alt_text,omitempty"`
	SortOrder int    `json:"sort_order"`
	IsPrimary bool   `json:"is_primary"`
}

type ProductVariant struct {
	ID            int       `json:"id"`
	ProductID     uuid.UUID `json:"product_id"`
	Size          string    `json:"size"`
	Color         string    `json:"color"`
	ColorHex      string    `json:"color_hex,omitempty"`
	Stock         int       `json:"stock"`
	PriceOverride *float64  `json:"price_override,omitempty"`
	SKU           string    `json:"sku,omitempty"`
	IsActive      bool      `json:"is_active"`
}

// ============================================
// ORDER
// ============================================

type OrderStatus string

const (
	OrderPending    OrderStatus = "pending"
	OrderConfirmed  OrderStatus = "confirmed"
	OrderProcessing OrderStatus = "processing"
	OrderShipped    OrderStatus = "shipped"
	OrderDelivered  OrderStatus = "delivered"
	OrderCancelled  OrderStatus = "cancelled"
)

type OrderSource string

const (
	OrderSourceWebsite  OrderSource = "website"
	OrderSourceWhatsApp OrderSource = "whatsapp"
)

type Order struct {
	ID              uuid.UUID    `json:"id"`
	OrderNumber     string       `json:"order_number"`
	CustomerID      *uuid.UUID   `json:"customer_id,omitempty"`
	Status          OrderStatus  `json:"status"`
	Source          OrderSource  `json:"source"`
	Subtotal        float64      `json:"subtotal"`
	ShippingCost    float64      `json:"shipping_cost"`
	Discount        float64      `json:"discount"`
	Total           float64      `json:"total"`
	Currency        string       `json:"currency"`
	CustomerName    string       `json:"customer_name"`
	CustomerPhone   string       `json:"customer_phone"`
	CustomerCity    string       `json:"customer_city"`
	CustomerAddress string       `json:"customer_address"`
	Notes           string       `json:"notes,omitempty"`
	Items           []OrderItem  `json:"items,omitempty"`
	StatusHistory   []OrderStatusHistory `json:"status_history,omitempty"`
	ConfirmedAt     *time.Time   `json:"confirmed_at,omitempty"`
	ShippedAt       *time.Time   `json:"shipped_at,omitempty"`
	DeliveredAt     *time.Time   `json:"delivered_at,omitempty"`
	CancelledAt     *time.Time   `json:"cancelled_at,omitempty"`
	CreatedAt       time.Time    `json:"created_at"`
	UpdatedAt       time.Time    `json:"updated_at"`
}

type OrderItem struct {
	ID           int       `json:"id"`
	OrderID      uuid.UUID `json:"order_id"`
	ProductID    *uuid.UUID `json:"product_id,omitempty"`
	VariantID    *int      `json:"variant_id,omitempty"`
	ProductName  string    `json:"product_name"`
	ProductImage string    `json:"product_image,omitempty"`
	Size         string    `json:"size,omitempty"`
	Color        string    `json:"color,omitempty"`
	Quantity     int       `json:"quantity"`
	UnitPrice    float64   `json:"unit_price"`
	TotalPrice   float64   `json:"total_price"`
}

type OrderStatusHistory struct {
	ID        int         `json:"id"`
	OrderID   uuid.UUID   `json:"order_id"`
	Status    OrderStatus `json:"status"`
	ChangedBy *uuid.UUID  `json:"changed_by,omitempty"`
	Note      string      `json:"note,omitempty"`
	CreatedAt time.Time   `json:"created_at"`
}

// ============================================
// REVIEW
// ============================================

type ReviewStatus string

const (
	ReviewPending  ReviewStatus = "pending"
	ReviewApproved ReviewStatus = "approved"
	ReviewRejected ReviewStatus = "rejected"
)

type Review struct {
	ID            int          `json:"id"`
	ProductID     uuid.UUID    `json:"product_id"`
	ProductName   string       `json:"product_name,omitempty"`
	CustomerName  string       `json:"customer_name"`
	CustomerEmail string       `json:"customer_email,omitempty"`
	Rating        int          `json:"rating"`
	Title         string       `json:"title,omitempty"`
	Comment       string       `json:"comment,omitempty"`
	Status        ReviewStatus `json:"status"`
	CreatedAt     time.Time    `json:"created_at"`
	UpdatedAt     time.Time    `json:"updated_at"`
}

// ============================================
// NEWSLETTER
// ============================================

type NewsletterSubscriber struct {
	ID             int        `json:"id"`
	Email          string     `json:"email"`
	IsActive       bool       `json:"is_active"`
	SubscribedAt   time.Time  `json:"subscribed_at"`
	UnsubscribedAt *time.Time `json:"unsubscribed_at,omitempty"`
}

// ============================================
// SETTINGS
// ============================================

type Setting struct {
	ID          int    `json:"id"`
	Key         string `json:"key"`
	Value       string `json:"value"`
	Type        string `json:"type"`
	GroupName   string `json:"group_name"`
	Description string `json:"description,omitempty"`
}

// ============================================
// AUDIT LOG
// ============================================

type AuditLog struct {
	ID         int64      `json:"id"`
	UserID     *uuid.UUID `json:"user_id,omitempty"`
	Action     string     `json:"action"`
	EntityType string     `json:"entity_type"`
	EntityID   string     `json:"entity_id,omitempty"`
	Details    string     `json:"details,omitempty"`
	IPAddress  string     `json:"ip_address,omitempty"`
	CreatedAt  time.Time  `json:"created_at"`
}

// ============================================
// DASHBOARD
// ============================================

type DashboardStats struct {
	TotalProducts   int     `json:"total_products"`
	TotalOrders     int     `json:"total_orders"`
	TotalRevenue    float64 `json:"total_revenue"`
	MonthlyRevenue  float64 `json:"monthly_revenue"`
	PendingOrders   int     `json:"pending_orders"`
	DeliveredOrders int     `json:"delivered_orders"`
	TotalCustomers  int     `json:"total_customers"`
}

type RecentOrder struct {
	OrderNumber  string      `json:"order_number"`
	CustomerName string      `json:"customer_name"`
	Total        float64     `json:"total"`
	Status       OrderStatus `json:"status"`
	CreatedAt    time.Time   `json:"created_at"`
}

type BestSellerProduct struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	Slug      string    `json:"slug"`
	ImageURL  string    `json:"image_url"`
	TotalSold int       `json:"total_sold"`
	Revenue   float64   `json:"revenue"`
}

type MonthlyRevenueData struct {
	Month   string  `json:"month"`
	Revenue float64 `json:"revenue"`
	Orders  int     `json:"orders"`
}

// ============================================
// API RESPONSE TYPES
// ============================================

type PaginatedResponse struct {
	Data       interface{} `json:"data"`
	Total      int         `json:"total"`
	Page       int         `json:"page"`
	PerPage    int         `json:"per_page"`
	TotalPages int         `json:"total_pages"`
}

type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}
