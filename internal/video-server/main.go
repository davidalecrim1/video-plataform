package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8095"
	}

	mux := http.NewServeMux()

	mux.HandleFunc("GET /healthz", healthz)
	mux.Handle("GET /video/", http.StripPrefix("/video/", http.HandlerFunc(videoHandler)))

	log.Printf("server starting on port %s", port)

	wrappedMux := Chain(mux.ServeHTTP, allMiddlewares...)
	err := http.ListenAndServe(":"+port, wrappedMux)
	if err != nil {
		log.Fatal("failed to start server: ", err)
	}
}

func videoHandler(w http.ResponseWriter, r *http.Request) {
	filePath := filepath.Join("/app/output/", r.URL.Path)
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		http.Error(w, "Video not found", http.StatusNotFound)
		return
	}

	ext := filepath.Ext(filePath)

	if ext == "" {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	validExtensions := map[string]bool{
		".mp4":  true,
		".m4s":  true,
		".mpd":  true,
		".webm": true,
		".m3u8": true,
		".ts":   true,
	}

	if !validExtensions[ext] {
		http.Error(w, "Invalid file type", http.StatusBadRequest)
		return
	}

	contentTypes := map[string]string{
		".mp4":  "video/mp4",
		".m4s":  "video/mp4",
		".mpd":  "application/dash+xml",
		".webm": "video/webm",
		".m3u8": "application/vnd.apple.mpegurl",
		".ts":   "video/mp2t",
	}

	if ct, ok := contentTypes[ext]; ok {
		w.Header().Set("Content-Type", ct)
	}

	http.ServeFile(w, r, filePath)
}

func healthz(w http.ResponseWriter, _ *http.Request) {
	w.Write([]byte("OK"))
}
