package main

import (
	"log"
	"net/http"
	"runtime/debug"
	"time"
)

type Middleware func(http.HandlerFunc) http.HandlerFunc

func Chain(h http.HandlerFunc, middlewares ...Middleware) http.HandlerFunc {
	// Apply in reverse order so that the first middleware
	// in the slice is executed first.
	for i := len(middlewares) - 1; i >= 0; i-- {
		h = middlewares[i](h)
	}
	return h
}

var allMiddlewares = []Middleware{
	recoverMiddleware,
	loggingMiddleware,
	corsMiddleware,
}

func loggingMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		rw := newResponseWriter(w)
		next(rw, r)
		duration := time.Since(start)

		statusColor := getStatusColor(rw.statusCode)
		reset := "\033[0m"

		// Format similar to Gin's logger
		log.Printf("[HTTP] %s %s %s %s %d %s %s %d bytes %s",
			r.Method,
			statusColor,
			r.URL.Path,
			http.StatusText(rw.statusCode),
			rw.statusCode,
			reset,
			duration,
			rw.size,
			r.UserAgent(),
		)
	})
}

type responseWriter struct {
	http.ResponseWriter
	statusCode int
	size       int64
}

func newResponseWriter(w http.ResponseWriter) *responseWriter {
	return &responseWriter{w, http.StatusOK, 0}
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}

func (rw *responseWriter) Write(b []byte) (int, error) {
	size, err := rw.ResponseWriter.Write(b)
	rw.size += int64(size)
	return size, err
}

func getStatusColor(code int) string {
	switch {
	case code >= 200 && code < 300:
		return "\033[97;42m" // Green
	case code >= 300 && code < 400:
		return "\033[90;47m" // White
	case code >= 400 && code < 500:
		return "\033[90;43m" // Yellow
	default:
		return "\033[97;41m" // Red
	}
}

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	})
}

func recoverMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				log.Printf("caught a panic: %v, stack trace: %v", err, string(debug.Stack()))

				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			}
		}()

		next(w, r)
	})
}
