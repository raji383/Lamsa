package repositories

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/lamsa/backend/internal/models"
)

type CategoryRepository struct {
	db *pgxpool.Pool
}

func NewCategoryRepository(db *pgxpool.Pool) *CategoryRepository {
	return &CategoryRepository{db: db}
}

func (r *CategoryRepository) List(ctx context.Context, activeOnly bool) ([]models.Category, error) {
	query := `SELECT id, name, slug, description, image_url, parent_id, sort_order, is_active, created_at, updated_at FROM categories`
	if activeOnly {
		query += ` WHERE is_active = true`
	}
	query += ` ORDER BY sort_order ASC`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var cats []models.Category
	for rows.Next() {
		var c models.Category
		if err := rows.Scan(&c.ID, &c.Name, &c.Slug, &c.Description, &c.ImageURL, &c.ParentID, &c.SortOrder, &c.IsActive, &c.CreatedAt, &c.UpdatedAt); err != nil {
			return nil, err
		}
		cats = append(cats, c)
	}
	return cats, nil
}

func (r *CategoryRepository) GetByID(ctx context.Context, id int) (*models.Category, error) {
	c := &models.Category{}
	err := r.db.QueryRow(ctx, `SELECT id, name, slug, description, image_url, parent_id, sort_order, is_active, created_at, updated_at FROM categories WHERE id = $1`, id).Scan(&c.ID, &c.Name, &c.Slug, &c.Description, &c.ImageURL, &c.ParentID, &c.SortOrder, &c.IsActive, &c.CreatedAt, &c.UpdatedAt)
	return c, err
}

func (r *CategoryRepository) Create(ctx context.Context, c *models.Category) error {
	return r.db.QueryRow(ctx, `INSERT INTO categories (name, slug, description, image_url, parent_id, sort_order, is_active) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, created_at, updated_at`, c.Name, c.Slug, c.Description, c.ImageURL, c.ParentID, c.SortOrder, c.IsActive).Scan(&c.ID, &c.CreatedAt, &c.UpdatedAt)
}

func (r *CategoryRepository) Update(ctx context.Context, c *models.Category) error {
	_, err := r.db.Exec(ctx, `UPDATE categories SET name=$2, slug=$3, description=$4, image_url=$5, parent_id=$6, sort_order=$7, is_active=$8, updated_at=NOW() WHERE id=$1`, c.ID, c.Name, c.Slug, c.Description, c.ImageURL, c.ParentID, c.SortOrder, c.IsActive)
	return err
}

func (r *CategoryRepository) Delete(ctx context.Context, id int) error {
	_, err := r.db.Exec(ctx, `DELETE FROM categories WHERE id = $1`, id)
	return err
}
