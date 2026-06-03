package handlers

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/google/uuid"
	"github.com/lamsa/backend/internal/models"
	"github.com/lamsa/backend/internal/repositories"
	"github.com/lamsa/backend/internal/utils"
	"github.com/lamsa/backend/internal/validators"
)

type ProductHandler struct {
	repo *repositories.ProductRepository
}

func NewProductHandler(repo *repositories.ProductRepository) *ProductHandler {
	return &ProductHandler{repo: repo}
}

func (h *ProductHandler) List(w http.ResponseWriter, r *http.Request) {
	filter := repositories.ProductFilter{
		Search:  utils.GetQueryString(r, "search", ""),
		SortBy:  utils.GetQueryString(r, "sort", "newest"),
		Page:    utils.GetQueryInt(r, "page", 1),
		PerPage: utils.GetQueryInt(r, "per_page", 12),
	}
	if catID := utils.GetQueryString(r, "category_id", ""); catID != "" {
		if id, err := strconv.Atoi(catID); err == nil {
			filter.CategoryID = &id
		}
	}
	if v := utils.GetQueryString(r, "min_price", ""); v != "" {
		if f, err := strconv.ParseFloat(v, 64); err == nil {
			filter.MinPrice = &f
		}
	}
	if v := utils.GetQueryString(r, "max_price", ""); v != "" {
		if f, err := strconv.ParseFloat(v, 64); err == nil {
			filter.MaxPrice = &f
		}
	}
	if v := utils.GetQueryString(r, "featured", ""); v == "true" {
		t := true
		filter.IsFeatured = &t
	}
	if v := utils.GetQueryString(r, "best_seller", ""); v == "true" {
		t := true
		filter.IsBestSeller = &t
	}
	if v := utils.GetQueryString(r, "new_arrival", ""); v == "true" {
		t := true
		filter.IsNewArrival = &t
	}
	// For public API, only show published products
	if !strings.HasPrefix(r.URL.Path, "/api/admin") {
		t := true
		filter.IsPublished = &t
	}
	products, total, err := h.repo.List(r.Context(), filter)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "failed to fetch products")
		return
	}
	if products == nil {
		products = []models.Product{}
	}
	utils.WritePaginated(w, products, total, filter.Page, filter.PerPage)
}

func (h *ProductHandler) GetByID(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		// Try slug
		product, err := h.repo.GetBySlug(r.Context(), idStr)
		if err != nil {
			utils.WriteError(w, http.StatusNotFound, "product not found")
			return
		}
		utils.WriteSuccess(w, product)
		return
	}
	product, err := h.repo.GetByID(r.Context(), id)
	if err != nil {
		utils.WriteError(w, http.StatusNotFound, "product not found")
		return
	}
	utils.WriteSuccess(w, product)
}

func (h *ProductHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req validators.CreateProductRequest
	if err := utils.ParseJSON(r, &req); err != nil {
		utils.WriteError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if errs := validators.ValidateCreateProduct(req); errs.HasErrors() {
		utils.WriteJSON(w, http.StatusBadRequest, map[string]interface{}{"success": false, "errors": errs})
		return
	}
	product := &models.Product{
		Name: req.Name, Slug: utils.Slugify(req.Name),
		Description: req.Description, Details: req.Details,
		CategoryID: req.CategoryID, BasePrice: req.BasePrice,
		SalePrice: req.SalePrice, SKU: req.SKU, Currency: "MAD",
		IsFeatured: req.IsFeatured, IsBestSeller: req.IsBestSeller,
		IsNewArrival: req.IsNewArrival, IsPublished: req.IsPublished,
		MetaTitle: req.MetaTitle, MetaDescription: req.MetaDescription,
	}
	if err := h.repo.Create(r.Context(), product); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "failed to create product")
		return
	}
	utils.WriteCreated(w, product)
}

func (h *ProductHandler) Update(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, "invalid product ID")
		return
	}
	existing, err := h.repo.GetByID(r.Context(), id)
	if err != nil {
		utils.WriteError(w, http.StatusNotFound, "product not found")
		return
	}
	var req validators.CreateProductRequest
	if err := utils.ParseJSON(r, &req); err != nil {
		utils.WriteError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	existing.Name = req.Name
	existing.Slug = utils.Slugify(req.Name)
	existing.Description = req.Description
	existing.Details = req.Details
	existing.CategoryID = req.CategoryID
	existing.BasePrice = req.BasePrice
	existing.SalePrice = req.SalePrice
	existing.SKU = req.SKU
	existing.IsFeatured = req.IsFeatured
	existing.IsBestSeller = req.IsBestSeller
	existing.IsNewArrival = req.IsNewArrival
	existing.IsPublished = req.IsPublished
	existing.MetaTitle = req.MetaTitle
	existing.MetaDescription = req.MetaDescription
	if err := h.repo.Update(r.Context(), existing); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "failed to update product")
		return
	}
	utils.WriteSuccess(w, existing)
}

func (h *ProductHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, "invalid product ID")
		return
	}
	if err := h.repo.Delete(r.Context(), id); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "failed to delete product")
		return
	}
	utils.WriteMessage(w, "product deleted successfully")
}

// Variant endpoints
func (h *ProductHandler) AddVariant(w http.ResponseWriter, r *http.Request) {
	prodID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, "invalid product ID")
		return
	}
	var v models.ProductVariant
	if err := utils.ParseJSON(r, &v); err != nil {
		utils.WriteError(w, http.StatusBadRequest, "invalid request")
		return
	}
	v.ProductID = prodID
	if err := h.repo.AddVariant(r.Context(), &v); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "failed to add variant")
		return
	}
	utils.WriteCreated(w, v)
}

func (h *ProductHandler) DeleteVariant(w http.ResponseWriter, r *http.Request) {
	variantID, err := strconv.Atoi(r.PathValue("variantId"))
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, "invalid variant ID")
		return
	}
	if err := h.repo.DeleteVariant(r.Context(), variantID); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "failed to delete variant")
		return
	}
	utils.WriteMessage(w, "variant deleted")
}

// Image endpoints
func (h *ProductHandler) AddImage(w http.ResponseWriter, r *http.Request) {
	prodID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, "invalid product ID")
		return
	}
	var img models.ProductImage
	if err := utils.ParseJSON(r, &img); err != nil {
		utils.WriteError(w, http.StatusBadRequest, "invalid request")
		return
	}
	img.ProductID = prodID
	if err := h.repo.AddImage(r.Context(), &img); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "failed to add image")
		return
	}
	utils.WriteCreated(w, img)
}

func (h *ProductHandler) DeleteImage(w http.ResponseWriter, r *http.Request) {
	imgID, err := strconv.Atoi(r.PathValue("imageId"))
	if err != nil {
		utils.WriteError(w, http.StatusBadRequest, "invalid image ID")
		return
	}
	if err := h.repo.DeleteImage(r.Context(), imgID); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "failed to delete image")
		return
	}
	utils.WriteMessage(w, "image deleted")
}
