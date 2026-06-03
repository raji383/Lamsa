package handlers

import (
	"net/http"
	"time"

	"github.com/lamsa/backend/internal/auth"
	"github.com/lamsa/backend/internal/middleware"
	"github.com/lamsa/backend/internal/repositories"
	"github.com/lamsa/backend/internal/utils"
	"github.com/lamsa/backend/internal/validators"
)

type AuthHandler struct {
	userRepo   *repositories.UserRepository
	jwtManager *auth.JWTManager
}

func NewAuthHandler(userRepo *repositories.UserRepository, jwtManager *auth.JWTManager) *AuthHandler {
	return &AuthHandler{userRepo: userRepo, jwtManager: jwtManager}
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req validators.LoginRequest
	if err := utils.ParseJSON(r, &req); err != nil {
		utils.WriteError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if errs := validators.ValidateLogin(req); errs.HasErrors() {
		utils.WriteJSON(w, http.StatusBadRequest, map[string]interface{}{"success": false, "errors": errs})
		return
	}
	user, err := h.userRepo.FindByEmail(r.Context(), req.Email)
	if err != nil || !auth.CheckPassword(req.Password, user.PasswordHash) {
		utils.WriteError(w, http.StatusUnauthorized, "invalid email or password")
		return
	}
	if !user.IsActive {
		utils.WriteError(w, http.StatusForbidden, "account is disabled")
		return
	}
	tokenPair, err := h.jwtManager.GenerateTokenPair(user.ID, user.Email, user.RoleName)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "failed to generate token")
		return
	}
	h.userRepo.StoreRefreshToken(r.Context(), user.ID, tokenPair.RefreshToken, time.Now().Add(h.jwtManager.RefreshExpiry()))
	h.userRepo.UpdateLastLogin(r.Context(), user.ID)

	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    tokenPair.RefreshToken,
		Path:     "/api/admin",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
		MaxAge:   int(h.jwtManager.RefreshExpiry().Seconds()),
	})
	utils.WriteSuccess(w, map[string]interface{}{
		"access_token": tokenPair.AccessToken,
		"expires_at":   tokenPair.ExpiresAt,
		"user": map[string]interface{}{
			"id": user.ID, "email": user.Email, "first_name": user.FirstName,
			"last_name": user.LastName, "role": user.RoleName,
		},
	})
}

func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("refresh_token")
	if err == nil {
		h.userRepo.RevokeRefreshToken(r.Context(), cookie.Value)
	}
	http.SetCookie(w, &http.Cookie{Name: "refresh_token", Value: "", Path: "/api/admin", MaxAge: -1})
	utils.WriteMessage(w, "logged out successfully")
}

func (h *AuthHandler) RefreshToken(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("refresh_token")
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, "no refresh token")
		return
	}
	userID, err := h.userRepo.ValidateRefreshToken(r.Context(), cookie.Value)
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, "invalid refresh token")
		return
	}
	h.userRepo.RevokeRefreshToken(r.Context(), cookie.Value)
	user, err := h.userRepo.FindByID(r.Context(), *userID)
	if err != nil {
		utils.WriteError(w, http.StatusUnauthorized, "user not found")
		return
	}
	tokenPair, err := h.jwtManager.GenerateTokenPair(user.ID, user.Email, user.RoleName)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, "failed to generate token")
		return
	}
	h.userRepo.StoreRefreshToken(r.Context(), user.ID, tokenPair.RefreshToken, time.Now().Add(h.jwtManager.RefreshExpiry()))
	http.SetCookie(w, &http.Cookie{
		Name: "refresh_token", Value: tokenPair.RefreshToken, Path: "/api/admin",
		HttpOnly: true, Secure: true, SameSite: http.SameSiteStrictMode,
		MaxAge: int(h.jwtManager.RefreshExpiry().Seconds()),
	})
	utils.WriteSuccess(w, map[string]interface{}{"access_token": tokenPair.AccessToken, "expires_at": tokenPair.ExpiresAt})
}

func (h *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	claims := middleware.GetUserClaims(r)
	if claims == nil {
		utils.WriteError(w, http.StatusUnauthorized, "unauthorized")
		return
	}
	user, err := h.userRepo.FindByID(r.Context(), claims.UserID)
	if err != nil {
		utils.WriteError(w, http.StatusNotFound, "user not found")
		return
	}
	utils.WriteSuccess(w, map[string]interface{}{
		"id": user.ID, "email": user.Email, "first_name": user.FirstName,
		"last_name": user.LastName, "role": user.RoleName,
	})
}
