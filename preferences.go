package main

import (
	"encoding/json"
	"log/slog"
	"os"
	"path/filepath"
	"runtime"

	"github.com/adrg/xdg"
	"github.com/pelletier/go-toml/v2"
)

type Preferences struct {
	Theme                     string          `json:"theme"`
	RootFolder                string          `json:"root_folder"`
	VodPathTemplate           string          `json:"vod_path_template"`
	DashboardColumnVisibility map[string]bool `json:"dashboard_column_visibility"`
}

type Streamer struct {
	Platform   string `json:"platform"`
	Username   string `json:"username"`
	Paused     bool   `json:"paused"`
	LastLive   string `json:"last_live"` // ISO 8601 string or "unknown"
	VODs       int    `json:"vods"`
	AutoRecord bool   `json:"auto_record"`
	VodPath    string `json:"vod_path"` // Path to the folder where recordings are saved
}

type StreamerList struct {
	Streamers []Streamer `json:"streamer-list"`
}

func (p *PreferenceService) getStreamerListPath() string {
	return filepath.Join(p.userConfigPath, "streamer-list.json")
}

func (p *PreferenceService) LoadStreamerList() (*StreamerList, error) {
	list := &StreamerList{}
	path := p.getStreamerListPath()
	data, err := os.ReadFile(path)
	if err != nil {
		return list, nil // return empty list if file doesn't exist
	}
	err = json.Unmarshal(data, list)
	return list, err
}

func (p *PreferenceService) SaveStreamerList(list *StreamerList) error {
	data, err := json.MarshalIndent(list, "", "    ")
	if err != nil {
		return err
	}
	return os.WriteFile(p.getStreamerListPath(), data, 0644)
}

type PreferenceService struct {
	userConfigPath   string
	userDownloadPath string
}

func NewPreferenceService() *PreferenceService {
	return &PreferenceService{}
}

func (p *PreferenceService) startup() {
	p.userConfigPath = getUserConfigPath("AutoLiveRecorder")
	slog.Info("User config path", "path", p.userConfigPath)
	downloadsDir := xdg.UserDirs.Download
	if downloadsDir == "" {
		slog.Error("Could not determine the Downloads folder")
	}
	p.userDownloadPath = downloadsDir
	slog.Info("User download path", "path", p.userDownloadPath)
}

func (p *PreferenceService) getPreferencesPath() string {
	return filepath.Join(p.userConfigPath, "preferences.toml")
}

func getUserConfigPath(appName string) string {
	var base string
	switch runtime.GOOS {
	case "windows":
		base = os.Getenv("LOCALAPPDATA")
	case "darwin":
		home, _ := os.UserHomeDir()
		base = filepath.Join(home, "Library", "Preferences")
	default: // Linux and others
		home, _ := os.UserHomeDir()
		base = filepath.Join(home, ".config")
	}

	fullPath := filepath.Join(base, appName)
	_ = os.MkdirAll(fullPath, 0755) // Ensure the folder exists
	return fullPath
}

func (p *PreferenceService) LoadPreferences() (*Preferences, error) {
	prefs := &Preferences{
		Theme:           "system",
		RootFolder:      p.userDownloadPath,
		VodPathTemplate: "VODs/{platform}/{username}/{date}_{start_time}.mp4",
		DashboardColumnVisibility: map[string]bool{
			// Defaults: last_live & vods shown, platform & auto_record hidden
			"last_live":   true,
			"vods":        true,
			"platform":    false,
			"auto_record": false,
		},
	}

	path := p.getPreferencesPath()
	data, err := os.ReadFile(path)
	if err != nil {
		return prefs, nil // return defaults if file doesn't exist
	}

	err = toml.Unmarshal(data, prefs)
	// Ensure defaults exist if the field was missing in file
	if prefs.DashboardColumnVisibility == nil {
		prefs.DashboardColumnVisibility = map[string]bool{
			"last_live":   true,
			"vods":        true,
			"platform":    false,
			"auto_record": false,
		}
	}
	return prefs, err
}

func (p *PreferenceService) SavePreferences(prefs *Preferences) error {
	data, err := toml.Marshal(prefs)
	if err != nil {
		return err
	}

	return os.WriteFile(p.getPreferencesPath(), data, 0644)
}
