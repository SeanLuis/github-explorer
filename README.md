# GitHub Open Source Explorer

A modern web application to discover, explore, and track trending open-source projects on GitHub. Built with Nuxt 3, Vue 3, and TailwindCSS.

## 🌗 Preview

### Light Mode
![GitHub Open Source Explorer Light Mode](/PREVIEW_LIGHT.png)

### Dark Mode
![GitHub Open Source Explorer Dark Mode](/PREVIEW_DARK.png)

## ✨ Features

- 🔍 Advanced GitHub repository search
- 📊 Trending repositories dashboard
- 🏷️ Curated collections of projects
- 🎨 Modern UI with dark mode support
- ⚡ Fast and responsive experience
- 🚀 Infinite scroll loading
- 📱 Mobile-friendly design

## 🛠️ Tech Stack

- **Framework:** Nuxt 3
- **UI Library:** Vue 3
- **Styling:** TailwindCSS
- **State Management:** Pinia
- **API Integration:** GitHub REST API
- **Icons:** Radix Icons

## 🚀 Quick Start

1. Clone the repository:
```bash
git clone https://github.com/SeanLuis/github-explorer.git
cd github-explorer
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file in the root directory with your GitHub token:
```env
NUXT_HUB_GITHUB_TOKEN=your_github_token_here
```

4. Start the development server:
```bash
pnpm dev
```

Visit `http://localhost:3000` to see the app running.

## 📦 Production Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 🔌 VS Code Extension

Explore GitHub repositories directly from your editor! Install our VS Code extension:

[![VS Code Extension](https://img.shields.io/visual-studio-marketplace/v/SeanLuisGuadaRodriguez.opensource-explorer?label=VS%20Code%20Extension&color=blue)](https://marketplace.visualstudio.com/items?itemName=SeanLuisGuadaRodriguez.opensource-explorer)

### Extension Features
- 🔍 Search repositories from VS Code
- ⭐ Star and fork repositories
- 📁 Organize into collections
- 🚀 Quick clone repositories
- 📊 View repository details

[Learn more about the VS Code extension](vscode-extension/README.md)

## 🏆 Featured On

<a href="https://www.producthunt.com/posts/github-open-source-explorer?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-github&#0045;open&#0045;source&#0045;explorer" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=873338&theme=light" alt="GitHub&#0032;Open&#0032;Source&#0032;Explorer - Discover&#0032;amazing&#0032;open&#0032;source&#0032;projects&#0032;on&#0032;GitHub | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Nuxt.js](https://nuxt.com/) for the amazing framework
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS framework
- [GitHub API](https://docs.github.com/en/rest) for providing the data
