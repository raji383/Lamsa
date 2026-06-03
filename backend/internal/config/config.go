package config

import (
	"os"
	"strconv"
	"time"
)

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	JWT      JWTConfig
	Cloudinary CloudinaryConfig
	CORS     CORSConfig
}

type ServerConfig struct {
	Port         string
	FrontendURL  string
	ReadTimeout  time.Duration
	WriteTimeout time.Duration
	IdleTimeout  time.Duration
}

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
	SSLMode  string
	MaxConns int
}

type JWTConfig struct {
	AccessSecret  string
	RefreshSecret string
	AccessExpiry  time.Duration
	RefreshExpiry time.Duration
}

type CloudinaryConfig struct {
	CloudName string
	APIKey    string
	APISecret string
}

type CORSConfig struct {
	AllowedOrigins []string
}

func Load() *Config {
	return &Config{
		Server: ServerConfig{
			Port:         getEnv("PORT", "8080"),
			FrontendURL:  getEnv("FRONTEND_URL", "http://localhost:3000"),
			ReadTimeout:  15 * time.Second,
			WriteTimeout: 15 * time.Second,
			IdleTimeout:  60 * time.Second,
		},
		Database: DatabaseConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnv("DB_PORT", "5432"),
			User:     getEnv("DB_USER", "lamsa_user"),
			Password: getEnv("DB_PASSWORD", "lamsa_secret_2024"),
			DBName:   getEnv("DB_NAME", "lamsa"),
			SSLMode:  getEnv("DB_SSLMODE", "disable"),
			MaxConns: getEnvAsInt("DB_MAX_CONNS", 25),
		},
		JWT: JWTConfig{
			AccessSecret:  getEnv("JWT_SECRET", "lamsa_jwt_secret_change_in_production"),
			RefreshSecret: getEnv("REFRESH_SECRET", "lamsa_refresh_secret_change_in_production"),
			AccessExpiry:  15 * time.Minute,
			RefreshExpiry: 7 * 24 * time.Hour,
		},
		Cloudinary: CloudinaryConfig{
			CloudName: getEnv("CLOUDINARY_CLOUD_NAME", ""),
			APIKey:    getEnv("CLOUDINARY_API_KEY", ""),
			APISecret: getEnv("CLOUDINARY_API_SECRET", ""),
		},
		CORS: CORSConfig{
			AllowedOrigins: []string{getEnv("FRONTEND_URL", "http://localhost:3000")},
		},
	}
}

func (d DatabaseConfig) DSN() string {
	return "postgres://" + d.User + ":" + d.Password + "@" + d.Host + ":" + d.Port + "/" + d.DBName + "?sslmode=" + d.SSLMode
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func getEnvAsInt(key string, fallback int) int {
	if value, ok := os.LookupEnv(key); ok {
		if i, err := strconv.Atoi(value); err == nil {
			return i
		}
	}
	return fallback
}
