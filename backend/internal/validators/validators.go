package validators

import (
	"fmt"
	"net/mail"
	"regexp"
	"strings"
)

type ValidationError struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

type ValidationErrors []ValidationError

func (ve ValidationErrors) Error() string {
	var msgs []string
	for _, e := range ve {
		msgs = append(msgs, fmt.Sprintf("%s: %s", e.Field, e.Message))
	}
	return strings.Join(msgs, "; ")
}

func (ve ValidationErrors) HasErrors() bool {
	return len(ve) > 0
}

// Login validation
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func ValidateLogin(req LoginRequest) ValidationErrors {
	var errs ValidationErrors

	if strings.TrimSpace(req.Email) == "" {
		errs = append(errs, ValidationError{Field: "email", Message: "email is required"})
	} else if !isValidEmail(req.Email) {
		errs = append(errs, ValidationError{Field: "email", Message: "invalid email format"})
	}

	if strings.TrimSpace(req.Password) == "" {
		errs = append(errs, ValidationError{Field: "password", Message: "password is required"})
	}

	return errs
}

// Product validation
type CreateProductRequest struct {
	Name            string   `json:"name"`
	Description     string   `json:"description"`
	Details         string   `json:"details"`
	CategoryID      *int     `json:"category_id"`
	BasePrice       float64  `json:"base_price"`
	SalePrice       *float64 `json:"sale_price"`
	SKU             string   `json:"sku"`
	IsFeatured      bool     `json:"is_featured"`
	IsBestSeller    bool     `json:"is_best_seller"`
	IsNewArrival    bool     `json:"is_new_arrival"`
	IsPublished     bool     `json:"is_published"`
	MetaTitle       string   `json:"meta_title"`
	MetaDescription string   `json:"meta_description"`
}

func ValidateCreateProduct(req CreateProductRequest) ValidationErrors {
	var errs ValidationErrors

	if strings.TrimSpace(req.Name) == "" {
		errs = append(errs, ValidationError{Field: "name", Message: "product name is required"})
	} else if len(req.Name) > 255 {
		errs = append(errs, ValidationError{Field: "name", Message: "product name must be less than 255 characters"})
	}

	if req.BasePrice <= 0 {
		errs = append(errs, ValidationError{Field: "base_price", Message: "base price must be greater than 0"})
	}

	if req.SalePrice != nil && *req.SalePrice >= req.BasePrice {
		errs = append(errs, ValidationError{Field: "sale_price", Message: "sale price must be less than base price"})
	}

	return errs
}

// Category validation
type CreateCategoryRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	ParentID    *int   `json:"parent_id"`
	ImageURL    string `json:"image_url"`
	SortOrder   int    `json:"sort_order"`
}

func ValidateCreateCategory(req CreateCategoryRequest) ValidationErrors {
	var errs ValidationErrors

	if strings.TrimSpace(req.Name) == "" {
		errs = append(errs, ValidationError{Field: "name", Message: "category name is required"})
	} else if len(req.Name) > 100 {
		errs = append(errs, ValidationError{Field: "name", Message: "category name must be less than 100 characters"})
	}

	return errs
}

// Order validation
type CreateOrderRequest struct {
	CustomerName    string             `json:"customer_name"`
	CustomerPhone   string             `json:"customer_phone"`
	CustomerCity    string             `json:"customer_city"`
	CustomerAddress string             `json:"customer_address"`
	Notes           string             `json:"notes"`
	Items           []OrderItemRequest `json:"items"`
}

type OrderItemRequest struct {
	ProductID string `json:"product_id"`
	VariantID *int   `json:"variant_id"`
	Quantity  int    `json:"quantity"`
}

func ValidateCreateOrder(req CreateOrderRequest) ValidationErrors {
	var errs ValidationErrors

	if strings.TrimSpace(req.CustomerName) == "" {
		errs = append(errs, ValidationError{Field: "customer_name", Message: "full name is required"})
	}

	if strings.TrimSpace(req.CustomerPhone) == "" {
		errs = append(errs, ValidationError{Field: "customer_phone", Message: "phone number is required"})
	} else if !isValidPhone(req.CustomerPhone) {
		errs = append(errs, ValidationError{Field: "customer_phone", Message: "invalid phone number"})
	}

	if strings.TrimSpace(req.CustomerCity) == "" {
		errs = append(errs, ValidationError{Field: "customer_city", Message: "city is required"})
	}

	if strings.TrimSpace(req.CustomerAddress) == "" {
		errs = append(errs, ValidationError{Field: "customer_address", Message: "address is required"})
	}

	if len(req.Items) == 0 {
		errs = append(errs, ValidationError{Field: "items", Message: "at least one item is required"})
	}

	for i, item := range req.Items {
		if strings.TrimSpace(item.ProductID) == "" {
			errs = append(errs, ValidationError{
				Field:   fmt.Sprintf("items[%d].product_id", i),
				Message: "product ID is required",
			})
		}
		if item.Quantity <= 0 {
			errs = append(errs, ValidationError{
				Field:   fmt.Sprintf("items[%d].quantity", i),
				Message: "quantity must be greater than 0",
			})
		}
	}

	return errs
}

// Review validation
type CreateReviewRequest struct {
	ProductID     string `json:"product_id"`
	CustomerName  string `json:"customer_name"`
	CustomerEmail string `json:"customer_email"`
	Rating        int    `json:"rating"`
	Title         string `json:"title"`
	Comment       string `json:"comment"`
}

func ValidateCreateReview(req CreateReviewRequest) ValidationErrors {
	var errs ValidationErrors

	if strings.TrimSpace(req.CustomerName) == "" {
		errs = append(errs, ValidationError{Field: "customer_name", Message: "name is required"})
	}

	if req.Rating < 1 || req.Rating > 5 {
		errs = append(errs, ValidationError{Field: "rating", Message: "rating must be between 1 and 5"})
	}

	return errs
}

// Newsletter validation
type NewsletterRequest struct {
	Email string `json:"email"`
}

func ValidateNewsletter(req NewsletterRequest) ValidationErrors {
	var errs ValidationErrors

	if strings.TrimSpace(req.Email) == "" {
		errs = append(errs, ValidationError{Field: "email", Message: "email is required"})
	} else if !isValidEmail(req.Email) {
		errs = append(errs, ValidationError{Field: "email", Message: "invalid email format"})
	}

	return errs
}

// Contact form validation
type ContactRequest struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Subject string `json:"subject"`
	Message string `json:"message"`
}

func ValidateContact(req ContactRequest) ValidationErrors {
	var errs ValidationErrors

	if strings.TrimSpace(req.Name) == "" {
		errs = append(errs, ValidationError{Field: "name", Message: "name is required"})
	}

	if strings.TrimSpace(req.Email) == "" {
		errs = append(errs, ValidationError{Field: "email", Message: "email is required"})
	} else if !isValidEmail(req.Email) {
		errs = append(errs, ValidationError{Field: "email", Message: "invalid email format"})
	}

	if strings.TrimSpace(req.Message) == "" {
		errs = append(errs, ValidationError{Field: "message", Message: "message is required"})
	}

	return errs
}

// Helpers
func isValidEmail(email string) bool {
	_, err := mail.ParseAddress(email)
	return err == nil
}

var phoneRegex = regexp.MustCompile(`^[\+]?[0-9\s\-\(\)]{8,20}$`)

func isValidPhone(phone string) bool {
	return phoneRegex.MatchString(phone)
}
