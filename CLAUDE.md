# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a multi-functional tool website written entirely in HTML, CSS, and JavaScript. The application provides various utility tools for text and data transformation, all contained within a single `index.html` file.

## Architecture

The entire application is a single-page web application with the following structure:

- **Single-file architecture**: All HTML, CSS, and JavaScript is contained in `index.html`
- **No build process**: This is a static website that can be served directly
- **Client-side only**: All processing happens in the browser using vanilla JavaScript
- **Responsive design**: Supports both light and dark themes using CSS media queries

### Tool Categories

The application includes four main tools accessible via a sidebar:

1. **Newline Text Converter** (`newlineTool`) - Converts between literal `\n` and actual newlines
2. **JSON Formatter** (`jsonTool`) - Formats and compresses JSON with error handling
3. **Base64 Encoder/Decoder** (`base64Tool`) - Base64 encoding and decoding using `btoa()`/`atob()`
4. **URL Encoder/Decoder** (`urlTool`) - URL encoding and decoding using `encodeURIComponent()`/`decodeURIComponent()`

## Development

### File Structure

```txt
/
├── index.html          # Main application file (contains all HTML, CSS, JS)
├── CNAME              # Custom domain configuration for GitHub Pages
└── .git/              # Git repository
```

### Making Changes

Since this is a single-file application, all changes will be made to `index.html`:

1. **Adding new tools**:
   - Add a button in the sidebar (`.sidebar` section)
   - Create a new tool container with id `[toolName]Tool`
   - Implement the tool functionality in the JavaScript section
   - Add the tool to the `showTool()` function navigation

2. **Styling changes**:
   - Modify CSS in the `<style>` section
   - The application uses CSS custom properties and media queries for theming
   - Dark/light theme support is handled via `@media (prefers-color-scheme: dark/light)`

3. **JavaScript functionality**:
   - All functions are defined in the `<script>` section at the bottom
   - DOM manipulation uses vanilla JavaScript (no frameworks)
   - Error handling uses simple `alert()` for user feedback

### Testing

Since this is a static client-side application:

1. **Local testing**: Open `index.html` directly in a web browser
2. **Live server**: Use any static file server (e.g., `python -m http.server`, VS Code Live Server)
3. **Browser testing**: Test across different browsers for compatibility
4. **No automated tests**: The application doesn't have a test suite

### Deployment

The site is designed for GitHub Pages deployment:

- The `CNAME` file configures the custom domain
- Simply push to the `master` branch to deploy
- No build step required - the static HTML file is served directly

## Key Implementation Details

### Theme System

- Uses CSS media queries for automatic light/dark theme detection
- Smooth transitions between themes (0.5s transition)
- Manual theme switching not implemented - relies on system preferences

### Tool Management

- Tools are shown/hidden using CSS classes (`.active`)
- The `showTool(toolId)` function handles navigation between tools
- Each tool has its own container with unique ID

### Copy Functionality

- Universal `copyToClipboard(elementId)` function for all outputs
- Uses `document.execCommand("copy")` for clipboard access
- Shows non-blocking notification when copy succeeds

### Error Handling

- Simple `alert()` messages for invalid inputs
- Try-catch blocks for JSON parsing and encoding/decoding operations

## Browser Compatibility

The application uses modern JavaScript features but should work in all major browsers:

- `btoa()`/`atob()` for Base64
- `encodeURIComponent()`/`decodeURIComponent()` for URL encoding
- `JSON.parse()`/`JSON.stringify()` for JSON processing
- CSS media queries for theme detection
