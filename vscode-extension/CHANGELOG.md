# Changelog

## [1.2.0] - 2025-02-16

### Added
- **Repository Discovery Features**
  - New "Top Rated" repositories view with star-based filtering
  - Enhanced trending repositories view with weekly updates
  - Improved search functionality with better rate limit handling
  - Smart retry mechanism for API rate limits
  - Dynamic repository loading with progress indicators

- **Search and Filter Enhancements**
  - Advanced repository search with multiple criteria
  - Language-based filtering system
  - Minimum stars filter option
  - Search within results capability
  - Real-time search results updates

- **User Interface Improvements**
  - New repository list layout with rich metadata
  - Enhanced repository details view
  - Loading states and progress indicators
  - Improved error messages and notifications
  - Better rate limit feedback
  - Status bar integration for GitHub connection status

- **Performance Optimizations**
  - Reduced API calls for repository details
  - Optimized search results loading
  - Improved data caching
  - Better handling of GitHub API rate limits
  - Smarter data refresh strategies

- **Collections System**
  - New Collections view for organizing repositories
  - Add/Remove repositories to collections
  - Collection tagging system
  - Filter collections by tags
  - Collection notes and annotations
  - Bulk collection operations
  - Collection search and filtering
  - Collection sharing capabilities

- **Repository Categories**
  - Repository tagging system
  - Custom categorization support
  - Tag-based filtering
  - Smart tag suggestions
  - Category-based organization
  - Multi-tag support
  - Tag cloud visualization

- **Note System**
  - Add notes to repositories in collections
  - Rich text note support
  - Note search functionality
  - Note history tracking
  - Automatic note timestamps
  - Note sharing capabilities

- **Advanced Filtering**
  - Tag-based repository filtering
  - Collection-based filtering
  - Combined filters support
  - Filter history
  - Filter presets
  - Custom filter creation

- **UI/UX Improvements**
  - New collection management sidebar
  - Enhanced tag management interface
  - Improved collection organization
  - Better note visualization
  - Tag cloud display
  - Collection statistics view

### Fixed
- Repository search rate limit issues
- Search results pagination problems
- Filter application consistency
- UI freezing during large searches
- Authentication token refresh issues
- Collection refresh after modifications
- Status bar update delays

### Changed
- Improved repository search algorithm
- Enhanced filter application logic
- Updated trending repositories calculation
- Modified minimum stars filtering
- Restructured repository list display
- Optimized GitHub API usage
- Updated error handling approach

### Security
- Enhanced token management
- Improved API request security
- Better error handling for failed requests
- Added rate limit protection
- Secure authentication flow improvements

### New Commands
- `opensource-explorer.addTag`: Add tags to collections
- `opensource-explorer.removeTag`: Remove tags from collections
- `opensource-explorer.filterByTag`: Filter collections by tags
- `opensource-explorer.addNote`: Add notes to repositories
- `opensource-explorer.editNote`: Edit repository notes
- `opensource-explorer.createCollection`: Create new collections
- `opensource-explorer.deleteCollection`: Delete collections
- `opensource-explorer.renameCollection`: Rename collections
- `opensource-explorer.addToCollection`: Add repositories to collections
- `opensource-explorer.removeFromCollection`: Remove repositories from collections

### Configuration
Added new configuration options:
- `collections.defaultView`: Default collections view mode
- `collections.tagSuggestions`: Enable/disable tag suggestions
- `collections.maxTags`: Maximum number of tags per collection
- `notes.maxLength`: Maximum note length
- `tags.caseSensitive`: Case sensitivity for tags

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