# OpenSource Explorer for VS Code

A powerful GitHub integration that brings repository management directly into your VS Code environment.

![Overview](/public/screenshots/overview.jpeg)

## Features Overview

### Main Toolbar 🛠️
Quick access to essential actions like search, filter, and authentication.

![Main Toolbar](/public/screenshots/toolbar.jpeg)

- Search repositories globally
- Filter by language and stars
- Quick access to trending repositories
- Authentication controls
- Settings access

### Repository List 📋
Browse and interact with repositories efficiently.

![Repository List](/public/screenshots/repo-list.jpeg)

- Clear repository information display
- Language detection
- Star and fork counts
- Repository visibility indicators
- Quick action buttons

### Quick Actions ⚡
Perform common operations directly from the list.

![Quick Actions](/public/screenshots/quick-actions.jpeg)

- Star/Unstar repositories
- Fork repositories
- Clone repositories
- Add to collections
- Open in browser
- View details

### Collections Management 📁
Organize repositories into personal collections.

![Collections](/public/screenshots/collections.jpeg)

- Create custom collections
- Add repositories from any view
- Quick access to favorite repos
- Organize by project or topic

### Collection Actions 🔄
Manage your collections efficiently.

![Collection Actions](/public/screenshots/collection-actions.jpeg)

- Rename collections
- Delete collections
- Add/Remove repositories
- Quick repository actions

### Repository Details 📊
Comprehensive repository information view.

![Repository Details](/public/screenshots/details-view.jpeg)

- README preview
- Repository statistics
- Clone options (HTTPS/SSH)
- File structure
- Commit history
- Issues and PRs count

## Installation

1. Open VS Code
2. Press `Cmd+P` (Mac) / `Ctrl+P` (Windows/Linux)
3. Type `ext install SeanLuisGuadaRodriguez.opensource-explorer`

Or install through the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=SeanLuisGuadaRodriguez.opensource-explorer)

## Getting Started

1. Click the GitHub icon in the activity bar
2. Sign in to your GitHub account when prompted
3. Start exploring repositories!

![Getting Started](resources/public/screenshots/getting-started.jpeg)

## Key Features

### Authentication 🔐
Secure GitHub authentication using VS Code's built-in auth system.
```json
{
  "opensource-explorer.autoRefresh": true,
  "opensource-explorer.refreshInterval": 300
}
```

### Repository Search 🔍
Advanced search capabilities with filters.
```json
{
  "opensource-explorer.defaultSearchSort": "stars",
  "opensource-explorer.languageFilter": "typescript"
}
```

### Collections 📚
Create and manage repository collections.
```json
{
  "opensource-explorer.showLanguageIcons": true,
  "opensource-explorer.dateFormat": "medium"
}
```

## Keyboard Shortcuts

| Command | Windows/Linux | Mac |
|---------|--------------|-----|
| Open Search | `Ctrl+Shift+F` | `Cmd+Shift+F` |
| Open Filter | `Ctrl+Shift+P` | `Cmd+Shift+P` |
| Quick Add to Collection | `Ctrl+Alt+C` | `Cmd+Alt+C` |
| Show Repository Details | `Ctrl+Enter` | `Cmd+Enter` |

## Extension Settings

Configure the extension through VS Code settings:

```json
{
  "opensource-explorer.autoRefresh": true,
  "opensource-explorer.refreshInterval": 300,
  "opensource-explorer.defaultSearchSort": "stars",
  "opensource-explorer.showLanguageIcons": true,
  "opensource-explorer.dateFormat": "medium",
  "opensource-explorer.trendingPeriod": "week"
}
```

## Security Features

- Secure token storage using encryption
- VS Code's built-in authentication API
- HTTPS for all API calls
- No plain text token storage

## Contributing

We welcome contributions! See our [Contributing Guide](CONTRIBUTING.md) for details.

## Support

Having issues or suggestions? [Open an issue](https://github.com/SeanLuisGuadaRodriguez/opensource-explorer/issues) on our GitHub repository.

## License

[MIT License](LICENSE)

## Release Notes

### 1.0.0
- Initial release
- Repository exploration
- Collections feature
- Advanced search and filtering
- Secure authentication
