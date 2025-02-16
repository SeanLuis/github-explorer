# Changelog

## [1.1.0] - 2025-02-16

### Added
- **Markdown Support**
  - Added full Markdown rendering support in repository details view
  - Syntax highlighting for code blocks in README files
  - Image rendering support in README previews
  - Support for GitHub flavored markdown

- **Repository Actions**
  - New "Open in New Tab" context menu option
  - Single-click now opens repository details directly
  - Double-click opens repository in external browser
  - Enhanced context menu organization

- **Clone Features**
  - Added default clone path configuration
  - "Copy Clone Command" now includes `git clone` prefix
  - Clone path picker now remembers last location
  - Improved clone path validation

- **Configuration Options**
  - `defaultClonePath`: Set default directory for cloning repositories
  - `showLanguageIcons`: Toggle language icons in repository list
  - `dateFormat`: Customize date display format
  - `trendingPeriod`: Configure trending repositories time period

- **UI Improvements**
  - Repository details tab now updates title dynamically
  - Added loading indicators for long operations
  - Enhanced error messages and notifications
  - Improved responsive layout for details view

### Fixed
- Repository clone path escaping issues on Windows
- Tab title not updating when switching repositories
- Double-click detection conflicts with selection
- Markdown rendering issues with certain characters
- Collection refresh after adding/removing repositories
- Settings command registration and execution
- Memory leaks in webview panels

### Changed
- Improved repository details loading performance
- Enhanced error handling for API requests
- Optimized collection storage mechanism
- Updated dependencies to latest versions
- Reorganized command palette structure

### Security
- Enhanced token storage encryption
- Improved secure credential handling
- Updated authentication flow
- Added token validation checks

### Commands
New commands added:
- `opensource-explorer.openInNewTab`: Open repository details in new tab
- `opensource-explorer.pickClonePath`: Set default clone path
- `opensource-explorer.refreshView`: Manual refresh of repository view

Updated commands:
- `opensource-explorer.clone`: Now supports default path
- `opensource-explorer.details`: Improved loading performance
- `opensource-explorer.openSettings`: Fixed configuration access

### Developer Notes
- Added extensive error logging
- Improved TypeScript type definitions
- Enhanced code documentation
- Added unit tests for new features
- Updated build and packaging scripts

### Documentation
- Added new configuration options documentation
- Updated keyboard shortcuts section
- Added troubleshooting guide
- Enhanced API documentation
- Added development setup instructions

For more detailed information about changes, please visit our [GitHub repository](https://github.com/SeanLuis/github-explorer/tree/master/vscode-extension).