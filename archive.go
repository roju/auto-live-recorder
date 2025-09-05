package main

import (
	"errors"
	"fmt"
	"path/filepath"
	"strings"
	"unicode/utf8"

	"runtime"

	wailsruntime "github.com/wailsapp/wails/v2/pkg/runtime"
)

func (a *App) ChooseDirectory() (string, error) {
	dir, err := wailsruntime.OpenDirectoryDialog(a.ctx, wailsruntime.OpenDialogOptions{
		Title: "Choose a Directory",
	})
	if err != nil {
		return "", err
	}
	return dir, nil
}

// reserved device names on Windows
var windowsReserved = map[string]struct{}{
	"CON": {}, "PRN": {}, "AUX": {}, "NUL": {},
	"COM1": {}, "COM2": {}, "COM3": {}, "COM4": {}, "COM5": {}, "COM6": {}, "COM7": {}, "COM8": {}, "COM9": {},
	"LPT1": {}, "LPT2": {}, "LPT3": {}, "LPT4": {}, "LPT5": {}, "LPT6": {}, "LPT7": {}, "LPT8": {}, "LPT9": {},
}

// Validates the user-supplied path without touching the filesystem.
func (a *App) ValidateDownloadPath(downloadsDir, userInput string) (string, error) {
	if downloadsDir == "" || userInput == "" {
		return "", errors.New("invalid file path (must be non-empty)")
	}

	// Normalize path
	cleanedUserInput := filepath.Clean(userInput)
	fullPath := filepath.Join(downloadsDir, cleanedUserInput)

	// Ensure path is not too long
	if len(fullPath) > 100 {
		return "", errors.New("path is too long (max 100 chars)")
	}

	// Prevent escapes from Downloads
	rel, err := filepath.Rel(downloadsDir, fullPath)
	if err != nil || strings.HasPrefix(rel, "..") {
		return "", errors.New("path escapes Downloads directory")
	}

	// Ensure final filename is valid
	base := filepath.Base(fullPath)
	if base == "." || base == ".." || base == "" {
		return "", errors.New("invalid filename")
	}

	// Extension check
	ext := filepath.Ext(base)
	if ext != "" && strings.ToLower(ext) != ".mp4" {
		return "", errors.New("invalid file extension (must be .mp4 or none)")
	}

	// Validate characters
	if err := validateName(base); err != nil {
		return "", err
	}

	return cleanedUserInput, nil
}

// Checks if filename is valid across platforms.
func validateName(name string) error {
	// Null byte or invalid UTF-8
	if !utf8.ValidString(name) || strings.ContainsRune(name, '\x00') {
		return errors.New("invalid characters in filename")
	}

	if runtime.GOOS == "windows" {
		upper := strings.ToUpper(strings.TrimSuffix(name, filepath.Ext(name)))
		if _, bad := windowsReserved[upper]; bad {
			return fmt.Errorf("invalid filename: reserved on Windows (%s)", upper)
		}
		invalidChars := `<>:"/\|?*`
		for _, r := range invalidChars {
			if strings.ContainsRune(name, r) {
				return fmt.Errorf("invalid character %q in filename", r)
			}
		}
	} else {
		// Unix: only "/" and null are invalid
		if strings.ContainsRune(name, '/') {
			return errors.New("filename cannot contain '/'")
		}
	}

	return nil
}
