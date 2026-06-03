package repositories

import (
	"context"
	"crypto/sha256"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/lamsa/backend/internal/models"
)

type UserRepository struct {
	db *pgxpool.Pool
}

func NewUserRepository(db *pgxpool.Pool) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) FindByEmail(ctx context.Context, email string) (*models.User, error) {
	user := &models.User{}
	err := r.db.QueryRow(ctx, `
		SELECT u.id, u.email, u.password_hash, u.first_name, u.last_name, 
			   u.role_id, r.name as role_name, u.is_active, u.last_login, 
			   u.created_at, u.updated_at
		FROM users u
		JOIN roles r ON u.role_id = r.id
		WHERE u.email = $1
	`, email).Scan(
		&user.ID, &user.Email, &user.PasswordHash, &user.FirstName, &user.LastName,
		&user.RoleID, &user.RoleName, &user.IsActive, &user.LastLogin,
		&user.CreatedAt, &user.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (r *UserRepository) FindByID(ctx context.Context, id uuid.UUID) (*models.User, error) {
	user := &models.User{}
	err := r.db.QueryRow(ctx, `
		SELECT u.id, u.email, u.password_hash, u.first_name, u.last_name, 
			   u.role_id, r.name as role_name, u.is_active, u.last_login, 
			   u.created_at, u.updated_at
		FROM users u
		JOIN roles r ON u.role_id = r.id
		WHERE u.id = $1
	`, id).Scan(
		&user.ID, &user.Email, &user.PasswordHash, &user.FirstName, &user.LastName,
		&user.RoleID, &user.RoleName, &user.IsActive, &user.LastLogin,
		&user.CreatedAt, &user.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (r *UserRepository) UpdateLastLogin(ctx context.Context, id uuid.UUID) error {
	_, err := r.db.Exec(ctx, `UPDATE users SET last_login = NOW() WHERE id = $1`, id)
	return err
}

// Refresh token operations
func (r *UserRepository) StoreRefreshToken(ctx context.Context, userID uuid.UUID, token string, expiresAt time.Time) error {
	hash := hashToken(token)
	_, err := r.db.Exec(ctx, `
		INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
		VALUES ($1, $2, $3)
	`, userID, hash, expiresAt)
	return err
}

func (r *UserRepository) ValidateRefreshToken(ctx context.Context, token string) (*uuid.UUID, error) {
	hash := hashToken(token)
	var userID uuid.UUID
	err := r.db.QueryRow(ctx, `
		SELECT user_id FROM refresh_tokens
		WHERE token_hash = $1 AND expires_at > NOW() AND revoked_at IS NULL
	`, hash).Scan(&userID)
	if err != nil {
		return nil, err
	}
	return &userID, nil
}

func (r *UserRepository) RevokeRefreshToken(ctx context.Context, token string) error {
	hash := hashToken(token)
	_, err := r.db.Exec(ctx, `
		UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = $1
	`, hash)
	return err
}

func (r *UserRepository) RevokeAllRefreshTokens(ctx context.Context, userID uuid.UUID) error {
	_, err := r.db.Exec(ctx, `
		UPDATE refresh_tokens SET revoked_at = NOW() 
		WHERE user_id = $1 AND revoked_at IS NULL
	`, userID)
	return err
}

func hashToken(token string) string {
	h := sha256.Sum256([]byte(token))
	return fmt.Sprintf("%x", h)
}
