package main

import "net/http"
func AddProdact(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Here you would typically parse the request body to get the product details
	// and then add the product to your database or in-memory store.

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("Product added successfully"))
}
func main() {
	http.HandleFunc("/api/addProdact", AddProdact)
	http.ListenAndServe(":8080", nil)
}