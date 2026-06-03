package repositories

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/lamsa/backend/internal/models"
	"github.com/lamsa/backend/internal/utils"
)

type OrderRepository struct {
	db *pgxpool.Pool
}

func NewOrderRepository(db *pgxpool.Pool) *OrderRepository {
	return &OrderRepository{db: db}
}

type OrderFilter struct {
	Status string
	Search string
	Source string
	Page   int
	PerPage int
}

func (r *OrderRepository) List(ctx context.Context, filter OrderFilter) ([]models.Order, int, error) {
	var conds []string
	var args []interface{}
	idx := 1
	if filter.Status != "" {
		conds = append(conds, fmt.Sprintf("o.status = $%d", idx))
		args = append(args, filter.Status)
		idx++
	}
	if filter.Search != "" {
		conds = append(conds, fmt.Sprintf("(o.order_number ILIKE $%d OR o.customer_name ILIKE $%d OR o.customer_phone ILIKE $%d)", idx, idx, idx))
		args = append(args, "%"+filter.Search+"%")
		idx++
	}
	if filter.Source != "" {
		conds = append(conds, fmt.Sprintf("o.source = $%d", idx))
		args = append(args, filter.Source)
		idx++
	}
	where := ""
	if len(conds) > 0 {
		where = "WHERE " + strings.Join(conds, " AND ")
	}
	var total int
	r.db.QueryRow(ctx, fmt.Sprintf("SELECT COUNT(*) FROM orders o %s", where), args...).Scan(&total)
	if filter.Page < 1 { filter.Page = 1 }
	if filter.PerPage < 1 { filter.PerPage = 20 }
	offset := (filter.Page - 1) * filter.PerPage
	query := fmt.Sprintf(`SELECT o.id, o.order_number, o.customer_id, o.status, o.source, o.subtotal, o.shipping_cost, o.discount, o.total, o.currency, o.customer_name, o.customer_phone, o.customer_city, o.customer_address, o.notes, o.created_at, o.updated_at FROM orders o %s ORDER BY o.created_at DESC LIMIT $%d OFFSET $%d`, where, idx, idx+1)
	args = append(args, filter.PerPage, offset)
	rows, err := r.db.Query(ctx, query, args...)
	if err != nil { return nil, 0, err }
	defer rows.Close()
	var orders []models.Order
	for rows.Next() {
		var o models.Order
		rows.Scan(&o.ID, &o.OrderNumber, &o.CustomerID, &o.Status, &o.Source, &o.Subtotal, &o.ShippingCost, &o.Discount, &o.Total, &o.Currency, &o.CustomerName, &o.CustomerPhone, &o.CustomerCity, &o.CustomerAddress, &o.Notes, &o.CreatedAt, &o.UpdatedAt)
		orders = append(orders, o)
	}
	return orders, total, nil
}

func (r *OrderRepository) GetByID(ctx context.Context, id uuid.UUID) (*models.Order, error) {
	o := &models.Order{}
	err := r.db.QueryRow(ctx, `SELECT id, order_number, customer_id, status, source, subtotal, shipping_cost, discount, total, currency, customer_name, customer_phone, customer_city, customer_address, notes, confirmed_at, shipped_at, delivered_at, cancelled_at, created_at, updated_at FROM orders WHERE id = $1`, id).Scan(&o.ID, &o.OrderNumber, &o.CustomerID, &o.Status, &o.Source, &o.Subtotal, &o.ShippingCost, &o.Discount, &o.Total, &o.Currency, &o.CustomerName, &o.CustomerPhone, &o.CustomerCity, &o.CustomerAddress, &o.Notes, &o.ConfirmedAt, &o.ShippedAt, &o.DeliveredAt, &o.CancelledAt, &o.CreatedAt, &o.UpdatedAt)
	if err != nil { return nil, err }
	items, _ := r.GetItems(ctx, id)
	o.Items = items
	history, _ := r.GetStatusHistory(ctx, id)
	o.StatusHistory = history
	return o, nil
}

func (r *OrderRepository) Create(ctx context.Context, o *models.Order) error {
	o.OrderNumber = utils.GenerateOrderNumber()
	return r.db.QueryRow(ctx, `INSERT INTO orders (order_number, customer_id, status, source, subtotal, shipping_cost, discount, total, currency, customer_name, customer_phone, customer_city, customer_address, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id, created_at, updated_at`,
		o.OrderNumber, o.CustomerID, o.Status, o.Source, o.Subtotal, o.ShippingCost, o.Discount, o.Total, o.Currency, o.CustomerName, o.CustomerPhone, o.CustomerCity, o.CustomerAddress, o.Notes).Scan(&o.ID, &o.CreatedAt, &o.UpdatedAt)
}

func (r *OrderRepository) AddItem(ctx context.Context, item *models.OrderItem) error {
	return r.db.QueryRow(ctx, `INSERT INTO order_items (order_id, product_id, variant_id, product_name, product_image, size, color, quantity, unit_price, total_price) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
		item.OrderID, item.ProductID, item.VariantID, item.ProductName, item.ProductImage, item.Size, item.Color, item.Quantity, item.UnitPrice, item.TotalPrice).Scan(&item.ID)
}

func (r *OrderRepository) GetItems(ctx context.Context, orderID uuid.UUID) ([]models.OrderItem, error) {
	rows, err := r.db.Query(ctx, `SELECT id, order_id, product_id, variant_id, product_name, product_image, size, color, quantity, unit_price, total_price FROM order_items WHERE order_id = $1`, orderID)
	if err != nil { return nil, err }
	defer rows.Close()
	var items []models.OrderItem
	for rows.Next() {
		var i models.OrderItem
		rows.Scan(&i.ID, &i.OrderID, &i.ProductID, &i.VariantID, &i.ProductName, &i.ProductImage, &i.Size, &i.Color, &i.Quantity, &i.UnitPrice, &i.TotalPrice)
		items = append(items, i)
	}
	return items, nil
}

func (r *OrderRepository) UpdateStatus(ctx context.Context, id uuid.UUID, status models.OrderStatus, changedBy *uuid.UUID, note string) error {
	now := time.Now()
	var tsField string
	switch status {
	case models.OrderConfirmed: tsField = "confirmed_at"
	case models.OrderShipped: tsField = "shipped_at"
	case models.OrderDelivered: tsField = "delivered_at"
	case models.OrderCancelled: tsField = "cancelled_at"
	}
	query := `UPDATE orders SET status = $2, updated_at = NOW()`
	if tsField != "" { query += fmt.Sprintf(", %s = '%s'", tsField, now.Format(time.RFC3339)) }
	query += ` WHERE id = $1`
	r.db.Exec(ctx, query, id, status)
	r.db.Exec(ctx, `INSERT INTO order_status_history (order_id, status, changed_by, note) VALUES ($1,$2,$3,$4)`, id, status, changedBy, note)
	return nil
}

func (r *OrderRepository) GetStatusHistory(ctx context.Context, orderID uuid.UUID) ([]models.OrderStatusHistory, error) {
	rows, err := r.db.Query(ctx, `SELECT id, order_id, status, changed_by, note, created_at FROM order_status_history WHERE order_id = $1 ORDER BY created_at DESC`, orderID)
	if err != nil { return nil, err }
	defer rows.Close()
	var history []models.OrderStatusHistory
	for rows.Next() {
		var h models.OrderStatusHistory
		rows.Scan(&h.ID, &h.OrderID, &h.Status, &h.ChangedBy, &h.Note, &h.CreatedAt)
		history = append(history, h)
	}
	return history, nil
}
