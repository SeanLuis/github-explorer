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
