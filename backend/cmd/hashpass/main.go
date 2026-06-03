package main

import (
	"fmt"
	"os"

	"golang.org/x/crypto/bcrypt"
)

func main() {
	pw := "LamsaAdmin2024!"
	if len(os.Args) > 1 {
		pw = os.Args[1]
	}
	h, _ := bcrypt.GenerateFromPassword([]byte(pw), 12)
	fmt.Println(string(h))
}
