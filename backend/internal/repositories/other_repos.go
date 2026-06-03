package repositories

import (
	"context"
	"fmt"
	"strings"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/lamsa/backend/internal/models"
)

type ReviewRepository struct {
	db *pgxpool.Pool
}

func NewReviewRepository(db *pgxpool.Pool) *ReviewRepository {
	return &ReviewRepository{db: db}
}

func (r *ReviewRepository) ListByProduct(ctx context.Context, productID uuid.UUID, approvedOnly bool) ([]models.Review, error) {
	query := `SELECT id, product_id, customer_name, customer_email, rating, title, comment, status, created_at, updated_at FROM reviews WHERE product_id = $1`
	if approvedOnly {
		query += ` AND status = 'approved'`
	}
	query += ` ORDER BY created_at DESC`
	rows, err := r.db.Query(ctx, query, productID)
	if err != nil { return nil, err }
	defer rows.Close()
	var reviews []models.Review
	for rows.Next() {
		var rv models.Review
		rows.Scan(&rv.ID, &rv.ProductID, &rv.CustomerName, &rv.CustomerEmail, &rv.Rating, &rv.Title, &rv.Comment, &rv.Status, &rv.CreatedAt, &rv.UpdatedAt)
		reviews = append(reviews, rv)
	}
	return reviews, nil
}

func (r *ReviewRepository) ListAll(ctx context.Context, status string, page, perPage int) ([]models.Review, int, error) {
	var conds []string
	var args []interface{}
	idx := 1
	if status != "" {
		conds = append(conds, fmt.Sprintf("r.status = $%d", idx))
		args = append(args, status)
		idx++
	}
	where := ""
	if len(conds) > 0 { where = "WHERE " + strings.Join(conds, " AND ") }
	var total int
	r.db.QueryRow(ctx, fmt.Sprintf("SELECT COUNT(*) FROM reviews r %s", where), args...).Scan(&total)
	if page < 1 { page = 1 }
	if perPage < 1 { perPage = 20 }
	offset := (page - 1) * perPage
	query := fmt.Sprintf(`SELECT r.id, r.product_id, COALESCE(p.name,'') as product_name, r.customer_name, r.customer_email, r.rating, r.title, r.comment, r.status, r.created_at, r.updated_at FROM reviews r LEFT JOIN products p ON r.product_id = p.id %s ORDER BY r.created_at DESC LIMIT $%d OFFSET $%d`, where, idx, idx+1)
	args = append(args, perPage, offset)
	rows, err := r.db.Query(ctx, query, args...)
	if err != nil { return nil, 0, err }
	defer rows.Close()
	var reviews []models.Review
	for rows.Next() {
		var rv models.Review
		rows.Scan(&rv.ID, &rv.ProductID, &rv.ProductName, &rv.CustomerName, &rv.CustomerEmail, &rv.Rating, &rv.Title, &rv.Comment, &rv.Status, &rv.CreatedAt, &rv.UpdatedAt)
		reviews = append(reviews, rv)
	}
	return reviews, total, nil
}

func (r *ReviewRepository) Create(ctx context.Context, rv *models.Review) error {
	return r.db.QueryRow(ctx, `INSERT INTO reviews (product_id, customer_name, customer_email, rating, title, comment) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, created_at, updated_at`, rv.ProductID, rv.CustomerName, rv.CustomerEmail, rv.Rating, rv.Title, rv.Comment).Scan(&rv.ID, &rv.CreatedAt, &rv.UpdatedAt)
}

func (r *ReviewRepository) UpdateStatus(ctx context.Context, id int, status models.ReviewStatus) error {
	_, err := r.db.Exec(ctx, `UPDATE reviews SET status = $2, updated_at = NOW() WHERE id = $1`, id, status)
	return err
}

func (r *ReviewRepository) Delete(ctx context.Context, id int) error {
	_, err := r.db.Exec(ctx, `DELETE FROM reviews WHERE id = $1`, id)
	return err
}

// Settings Repository
type SettingsRepository struct {
	db *pgxpool.Pool
}

func NewSettingsRepository(db *pgxpool.Pool) *SettingsRepository {
	return &SettingsRepository{db: db}
}

func (r *SettingsRepository) GetAll(ctx context.Context) ([]models.Setting, error) {
	rows, err := r.db.Query(ctx, `SELECT id, key, value, type, group_name, description FROM settings ORDER BY group_name, key`)
	if err != nil { return nil, err }
	defer rows.Close()
	var settings []models.Setting
	for rows.Next() {
		var s models.Setting
		rows.Scan(&s.ID, &s.Key, &s.Value, &s.Type, &s.GroupName, &s.Description)
		settings = append(settings, s)
	}
	return settings, nil
}

func (r *SettingsRepository) GetByKey(ctx context.Context, key string) (*models.Setting, error) {
	s := &models.Setting{}
	err := r.db.QueryRow(ctx, `SELECT id, key, value, type, group_name, description FROM settings WHERE key = $1`, key).Scan(&s.ID, &s.Key, &s.Value, &s.Type, &s.GroupName, &s.Description)
	return s, err
}

func (r *SettingsRepository) GetByGroup(ctx context.Context, group string) ([]models.Setting, error) {
	rows, err := r.db.Query(ctx, `SELECT id, key, value, type, group_name, description FROM settings WHERE group_name = $1 ORDER BY key`, group)
	if err != nil { return nil, err }
	defer rows.Close()
	var settings []models.Setting
	for rows.Next() {
		var s models.Setting
		rows.Scan(&s.ID, &s.Key, &s.Value, &s.Type, &s.GroupName, &s.Description)
		settings = append(settings, s)
	}
	return settings, nil
}

func (r *SettingsRepository) Update(ctx context.Context, key, value string) error {
	_, err := r.db.Exec(ctx, `UPDATE settings SET value = $2, updated_at = NOW() WHERE key = $1`, key, value)
	return err
}

func (r *SettingsRepository) BulkUpdate(ctx context.Context, updates map[string]string) error {
	for key, value := range updates {
		if err := r.Update(ctx, key, value); err != nil { return err }
	}
	return nil
}

// Newsletter Repository
type NewsletterRepository struct {
	db *pgxpool.Pool
}

func NewNewsletterRepository(db *pgxpool.Pool) *NewsletterRepository {
	return &NewsletterRepository{db: db}
}

func (r *NewsletterRepository) Subscribe(ctx context.Context, email string) error {
	_, err := r.db.Exec(ctx, `INSERT INTO newsletter_subscribers (email) VALUES ($1) ON CONFLICT (email) DO UPDATE SET is_active = true, unsubscribed_at = NULL`, email)
	return err
}

func (r *NewsletterRepository) Unsubscribe(ctx context.Context, email string) error {
	_, err := r.db.Exec(ctx, `UPDATE newsletter_subscribers SET is_active = false, unsubscribed_at = NOW() WHERE email = $1`, email)
	return err
}

// Dashboard Repository
type DashboardRepository struct {
	db *pgxpool.Pool
}

func NewDashboardRepository(db *pgxpool.Pool) *DashboardRepository {
	return &DashboardRepository{db: db}
}

func (r *DashboardRepository) GetStats(ctx context.Context) (*models.DashboardStats, error) {
	s := &models.DashboardStats{}
	r.db.QueryRow(ctx, `SELECT COUNT(*) FROM products WHERE is_published = true`).Scan(&s.TotalProducts)
	r.db.QueryRow(ctx, `SELECT COUNT(*) FROM orders`).Scan(&s.TotalOrders)
	r.db.QueryRow(ctx, `SELECT COALESCE(SUM(total), 0) FROM orders WHERE status != 'cancelled'`).Scan(&s.TotalRevenue)
	r.db.QueryRow(ctx, `SELECT COALESCE(SUM(total), 0) FROM orders WHERE status != 'cancelled' AND created_at >= date_trunc('month', CURRENT_DATE)`).Scan(&s.MonthlyRevenue)
	r.db.QueryRow(ctx, `SELECT COUNT(*) FROM orders WHERE status = 'pending'`).Scan(&s.PendingOrders)
	r.db.QueryRow(ctx, `SELECT COUNT(*) FROM orders WHERE status = 'delivered'`).Scan(&s.DeliveredOrders)
	r.db.QueryRow(ctx, `SELECT COUNT(*) FROM customers`).Scan(&s.TotalCustomers)
	return s, nil
}

func (r *DashboardRepository) GetRecentOrders(ctx context.Context, limit int) ([]models.RecentOrder, error) {
	rows, err := r.db.Query(ctx, `SELECT order_number, customer_name, total, status, created_at FROM orders ORDER BY created_at DESC LIMIT $1`, limit)
	if err != nil { return nil, err }
	defer rows.Close()
	var orders []models.RecentOrder
	for rows.Next() {
		var o models.RecentOrder
		rows.Scan(&o.OrderNumber, &o.CustomerName, &o.Total, &o.Status, &o.CreatedAt)
		orders = append(orders, o)
	}
	return orders, nil
}

// Customer Repository
type CustomerRepository struct {
	db *pgxpool.Pool
}

func NewCustomerRepository(db *pgxpool.Pool) *CustomerRepository {
	return &CustomerRepository{db: db}
}

func (r *CustomerRepository) FindOrCreate(ctx context.Context, name, phone, city, address string) (*models.Customer, error) {
	c := &models.Customer{}
	err := r.db.QueryRow(ctx, `SELECT id, first_name, last_name, phone, city, address, total_orders, total_spent, created_at FROM customers WHERE phone = $1`, phone).Scan(&c.ID, &c.FirstName, &c.LastName, &c.Phone, &c.City, &c.Address, &c.TotalOrders, &c.TotalSpent, &c.CreatedAt)
	if err != nil {
		parts := strings.SplitN(name, " ", 2)
		first := parts[0]
		last := ""
		if len(parts) > 1 { last = parts[1] }
		err = r.db.QueryRow(ctx, `INSERT INTO customers (first_name, last_name, phone, city, address) VALUES ($1,$2,$3,$4,$5) RETURNING id, created_at`, first, last, phone, city, address).Scan(&c.ID, &c.CreatedAt)
		if err != nil { return nil, err }
		c.FirstName = first
		c.LastName = last
		c.Phone = phone
	}
	return c, nil
}

func (r *CustomerRepository) List(ctx context.Context, search string, page, perPage int) ([]models.Customer, int, error) {
	var args []interface{}
	where := ""
	idx := 1
	if search != "" {
		where = fmt.Sprintf("WHERE first_name ILIKE $%d OR last_name ILIKE $%d OR phone ILIKE $%d", idx, idx, idx)
		args = append(args, "%"+search+"%")
		idx++
	}
	var total int
	r.db.QueryRow(ctx, fmt.Sprintf("SELECT COUNT(*) FROM customers %s", where), args...).Scan(&total)
	if page < 1 { page = 1 }
	if perPage < 1 { perPage = 20 }
	offset := (page - 1) * perPage
	query := fmt.Sprintf(`SELECT id, first_name, last_name, email, phone, city, total_orders, total_spent, created_at FROM customers %s ORDER BY created_at DESC LIMIT $%d OFFSET $%d`, where, idx, idx+1)
	args = append(args, perPage, offset)
	rows, err := r.db.Query(ctx, query, args...)
	if err != nil { return nil, 0, err }
	defer rows.Close()
	var customers []models.Customer
	for rows.Next() {
		var c models.Customer
		rows.Scan(&c.ID, &c.FirstName, &c.LastName, &c.Email, &c.Phone, &c.City, &c.TotalOrders, &c.TotalSpent, &c.CreatedAt)
		customers = append(customers, c)
	}
	return customers, total, nil
}
