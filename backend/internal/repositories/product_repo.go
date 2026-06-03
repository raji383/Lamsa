package repositories

import (
	"context"
	"fmt"
	"strings"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/lamsa/backend/internal/models"
)

type ProductRepository struct {
	db *pgxpool.Pool
}

func NewProductRepository(db *pgxpool.Pool) *ProductRepository {
	return &ProductRepository{db: db}
}

type ProductFilter struct {
	CategoryID  *int
	Search      string
	MinPrice    *float64
	MaxPrice    *float64
	Size        string
	Color       string
	IsFeatured  *bool
	IsBestSeller *bool
	IsNewArrival *bool
	IsPublished  *bool
	SortBy      string
	SortOrder   string
	Page        int
	PerPage     int
}

func (r *ProductRepository) List(ctx context.Context, filter ProductFilter) ([]models.Product, int, error) {
	var conditions []string
	var args []interface{}
	argIdx := 1

	if filter.IsPublished != nil {
		conditions = append(conditions, fmt.Sprintf("p.is_published = $%d", argIdx))
		args = append(args, *filter.IsPublished)
		argIdx++
	}

	if filter.CategoryID != nil {
		conditions = append(conditions, fmt.Sprintf("p.category_id = $%d", argIdx))
		args = append(args, *filter.CategoryID)
		argIdx++
	}

	if filter.Search != "" {
		conditions = append(conditions, fmt.Sprintf("(p.name ILIKE $%d OR p.description ILIKE $%d)", argIdx, argIdx))
		args = append(args, "%"+filter.Search+"%")
		argIdx++
	}

	if filter.MinPrice != nil {
		conditions = append(conditions, fmt.Sprintf("p.base_price >= $%d", argIdx))
		args = append(args, *filter.MinPrice)
		argIdx++
	}

	if filter.MaxPrice != nil {
		conditions = append(conditions, fmt.Sprintf("p.base_price <= $%d", argIdx))
		args = append(args, *filter.MaxPrice)
		argIdx++
	}

	if filter.IsFeatured != nil {
		conditions = append(conditions, fmt.Sprintf("p.is_featured = $%d", argIdx))
		args = append(args, *filter.IsFeatured)
		argIdx++
	}

	if filter.IsBestSeller != nil {
		conditions = append(conditions, fmt.Sprintf("p.is_best_seller = $%d", argIdx))
		args = append(args, *filter.IsBestSeller)
		argIdx++
	}

	if filter.IsNewArrival != nil {
		conditions = append(conditions, fmt.Sprintf("p.is_new_arrival = $%d", argIdx))
		args = append(args, *filter.IsNewArrival)
		argIdx++
	}

	whereClause := ""
	if len(conditions) > 0 {
		whereClause = "WHERE " + strings.Join(conditions, " AND ")
	}

	// Count total
	countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM products p %s`, whereClause)
	var total int
	err := r.db.QueryRow(ctx, countQuery, args...).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	// Sort
	orderClause := "ORDER BY p.created_at DESC"
	switch filter.SortBy {
	case "price_asc":
		orderClause = "ORDER BY p.base_price ASC"
	case "price_desc":
		orderClause = "ORDER BY p.base_price DESC"
	case "best_selling":
		orderClause = "ORDER BY p.total_sold DESC"
	case "newest":
		orderClause = "ORDER BY p.created_at DESC"
	case "name":
		orderClause = "ORDER BY p.name ASC"
	}

	// Pagination
	if filter.Page < 1 {
		filter.Page = 1
	}
	if filter.PerPage < 1 {
		filter.PerPage = 12
	}
	offset := (filter.Page - 1) * filter.PerPage

	query := fmt.Sprintf(`
		SELECT p.id, p.name, p.slug, p.description, p.category_id, 
			   COALESCE(c.name, '') as category_name,
			   p.base_price, p.sale_price, p.currency, p.sku,
			   p.is_featured, p.is_best_seller, p.is_new_arrival, p.is_published,
			   p.total_sold, p.avg_rating, p.review_count,
			   p.created_at, p.updated_at
		FROM products p
		LEFT JOIN categories c ON p.category_id = c.id
		%s %s
		LIMIT $%d OFFSET $%d
	`, whereClause, orderClause, argIdx, argIdx+1)

	args = append(args, filter.PerPage, offset)

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var products []models.Product
	for rows.Next() {
		var p models.Product
		err := rows.Scan(
			&p.ID, &p.Name, &p.Slug, &p.Description, &p.CategoryID,
			&p.CategoryName,
			&p.BasePrice, &p.SalePrice, &p.Currency, &p.SKU,
			&p.IsFeatured, &p.IsBestSeller, &p.IsNewArrival, &p.IsPublished,
			&p.TotalSold, &p.AvgRating, &p.ReviewCount,
			&p.CreatedAt, &p.UpdatedAt,
		)
		if err != nil {
			return nil, 0, err
		}
		products = append(products, p)
	}

	// Load primary images for each product
	for i, p := range products {
		img, err := r.GetPrimaryImage(ctx, p.ID)
		if err == nil && img != nil {
			products[i].Images = []models.ProductImage{*img}
		}
	}

	return products, total, nil
}

func (r *ProductRepository) GetByID(ctx context.Context, id uuid.UUID) (*models.Product, error) {
	p := &models.Product{}
	err := r.db.QueryRow(ctx, `
		SELECT p.id, p.name, p.slug, p.description, p.details, p.category_id,
			   COALESCE(c.name, '') as category_name,
			   p.base_price, p.sale_price, p.currency, p.sku,
			   p.is_featured, p.is_best_seller, p.is_new_arrival, p.is_published,
			   p.total_sold, p.avg_rating, p.review_count,
			   p.meta_title, p.meta_description,
			   p.created_at, p.updated_at
		FROM products p
		LEFT JOIN categories c ON p.category_id = c.id
		WHERE p.id = $1
	`, id).Scan(
		&p.ID, &p.Name, &p.Slug, &p.Description, &p.Details, &p.CategoryID,
		&p.CategoryName,
		&p.BasePrice, &p.SalePrice, &p.Currency, &p.SKU,
		&p.IsFeatured, &p.IsBestSeller, &p.IsNewArrival, &p.IsPublished,
		&p.TotalSold, &p.AvgRating, &p.ReviewCount,
		&p.MetaTitle, &p.MetaDescription,
		&p.CreatedAt, &p.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	// Load images
	images, err := r.GetImages(ctx, id)
	if err == nil {
		p.Images = images
	}

	// Load variants
	variants, err := r.GetVariants(ctx, id)
	if err == nil {
		p.Variants = variants
	}

	return p, nil
}

func (r *ProductRepository) GetBySlug(ctx context.Context, slug string) (*models.Product, error) {
	var id uuid.UUID
	err := r.db.QueryRow(ctx, `SELECT id FROM products WHERE slug = $1`, slug).Scan(&id)
	if err != nil {
		return nil, err
	}
	return r.GetByID(ctx, id)
}

func (r *ProductRepository) Create(ctx context.Context, p *models.Product) error {
	return r.db.QueryRow(ctx, `
		INSERT INTO products (name, slug, description, details, category_id, base_price, sale_price,
			currency, sku, is_featured, is_best_seller, is_new_arrival, is_published,
			meta_title, meta_description)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
		RETURNING id, created_at, updated_at
	`, p.Name, p.Slug, p.Description, p.Details, p.CategoryID,
		p.BasePrice, p.SalePrice, p.Currency, p.SKU,
		p.IsFeatured, p.IsBestSeller, p.IsNewArrival, p.IsPublished,
		p.MetaTitle, p.MetaDescription,
	).Scan(&p.ID, &p.CreatedAt, &p.UpdatedAt)
}

func (r *ProductRepository) Update(ctx context.Context, p *models.Product) error {
	_, err := r.db.Exec(ctx, `
		UPDATE products SET 
			name = $2, slug = $3, description = $4, details = $5, category_id = $6,
			base_price = $7, sale_price = $8, sku = $9,
			is_featured = $10, is_best_seller = $11, is_new_arrival = $12, is_published = $13,
			meta_title = $14, meta_description = $15, updated_at = NOW()
		WHERE id = $1
	`, p.ID, p.Name, p.Slug, p.Description, p.Details, p.CategoryID,
		p.BasePrice, p.SalePrice, p.SKU,
		p.IsFeatured, p.IsBestSeller, p.IsNewArrival, p.IsPublished,
		p.MetaTitle, p.MetaDescription,
	)
	return err
}

func (r *ProductRepository) Delete(ctx context.Context, id uuid.UUID) error {
	_, err := r.db.Exec(ctx, `DELETE FROM products WHERE id = $1`, id)
	return err
}

// Images
func (r *ProductRepository) GetImages(ctx context.Context, productID uuid.UUID) ([]models.ProductImage, error) {
	rows, err := r.db.Query(ctx, `
		SELECT id, product_id, url, public_id, alt_text, sort_order, is_primary
		FROM product_images WHERE product_id = $1 ORDER BY sort_order
	`, productID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var images []models.ProductImage
	for rows.Next() {
		var img models.ProductImage
		if err := rows.Scan(&img.ID, &img.ProductID, &img.URL, &img.PublicID, &img.AltText, &img.SortOrder, &img.IsPrimary); err != nil {
			return nil, err
		}
		images = append(images, img)
	}
	return images, nil
}

func (r *ProductRepository) GetPrimaryImage(ctx context.Context, productID uuid.UUID) (*models.ProductImage, error) {
	img := &models.ProductImage{}
	err := r.db.QueryRow(ctx, `
		SELECT id, product_id, url, public_id, alt_text, sort_order, is_primary
		FROM product_images WHERE product_id = $1 ORDER BY is_primary DESC, sort_order ASC LIMIT 1
	`, productID).Scan(&img.ID, &img.ProductID, &img.URL, &img.PublicID, &img.AltText, &img.SortOrder, &img.IsPrimary)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return img, nil
}

func (r *ProductRepository) AddImage(ctx context.Context, img *models.ProductImage) error {
	return r.db.QueryRow(ctx, `
		INSERT INTO product_images (product_id, url, public_id, alt_text, sort_order, is_primary)
		VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
	`, img.ProductID, img.URL, img.PublicID, img.AltText, img.SortOrder, img.IsPrimary).Scan(&img.ID)
}

func (r *ProductRepository) DeleteImage(ctx context.Context, id int) error {
	_, err := r.db.Exec(ctx, `DELETE FROM product_images WHERE id = $1`, id)
	return err
}

// Variants
func (r *ProductRepository) GetVariants(ctx context.Context, productID uuid.UUID) ([]models.ProductVariant, error) {
	rows, err := r.db.Query(ctx, `
		SELECT id, product_id, size, color, color_hex, stock, price_override, sku, is_active
		FROM product_variants WHERE product_id = $1 ORDER BY size, color
	`, productID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var variants []models.ProductVariant
	for rows.Next() {
		var v models.ProductVariant
		if err := rows.Scan(&v.ID, &v.ProductID, &v.Size, &v.Color, &v.ColorHex, &v.Stock, &v.PriceOverride, &v.SKU, &v.IsActive); err != nil {
			return nil, err
		}
		variants = append(variants, v)
	}
	return variants, nil
}

func (r *ProductRepository) AddVariant(ctx context.Context, v *models.ProductVariant) error {
	return r.db.QueryRow(ctx, `
		INSERT INTO product_variants (product_id, size, color, color_hex, stock, price_override, sku, is_active)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id
	`, v.ProductID, v.Size, v.Color, v.ColorHex, v.Stock, v.PriceOverride, v.SKU, v.IsActive).Scan(&v.ID)
}

func (r *ProductRepository) UpdateVariant(ctx context.Context, v *models.ProductVariant) error {
	_, err := r.db.Exec(ctx, `
		UPDATE product_variants SET size = $2, color = $3, color_hex = $4, stock = $5,
		price_override = $6, sku = $7, is_active = $8, updated_at = NOW()
		WHERE id = $1
	`, v.ID, v.Size, v.Color, v.ColorHex, v.Stock, v.PriceOverride, v.SKU, v.IsActive)
	return err
}

func (r *ProductRepository) DeleteVariant(ctx context.Context, id int) error {
	_, err := r.db.Exec(ctx, `DELETE FROM product_variants WHERE id = $1`, id)
	return err
}
