

# 📊 ChitraData

> **Create beautiful, interactive charts and graphs without any coding. Free, fast, and easy to use.**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)](https://www.chartjs.org/)

## 🌟 Features

### 📈 Multiple Chart Types
- **Bar Charts** - Perfect for comparing data across categories
- **Line Charts** - Show trends and changes over time
- **Pie Charts** - Visualize proportions and percentages
- **Doughnut Charts** - Modern alternative to pie charts
- **Area Charts** - Display data with filled areas for better visual impact

### 🎨 Modern Design
- **Dark/Light Mode** - Seamless theme switching
- **Responsive Design** - Works perfectly on all devices
- **Smooth Animations** - Enhanced with Framer Motion
- **Clean UI** - Built with Tailwind CSS

### 🛠️ User-Friendly Features
- **No Registration Required** - Start creating immediately
- **Real-time Preview** - See changes as you make them
- **Export Options** - Download charts as images
- **Data Persistence** - Your charts are saved locally
- **Gallery View** - Browse and manage your created charts

## 🚀 Live Demo

**[View Live Demo](https://your-vercel-app-url.vercel.app)**

## 📸 Screenshots

### Landing Page
![Landing Page Screenshot](./screenshots/landing.png)

### Chart Creation
![Chart Creation Screenshot](./screenshots/create.png)

### Gallery View
![Gallery Screenshot](./screenshots/gallery.png)

## 🏗️ Technology Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | Frontend Framework | ^19.1.1 |
| **TypeScript** | Type Safety | ~5.8.3 |
| **Vite** | Build Tool | ^7.1.7 |
| **Tailwind CSS** | Styling | ^3.4.17 |
| **Chart.js** | Chart Library | ^4.5.0 |
| **React Chart.js 2** | React Wrapper | ^5.3.0 |
| **Framer Motion** | Animations | ^12.23.19 |
| **React Icons** | Icon Library | ^5.5.0 |
| **html2canvas** | Image Export | ^1.4.1 |

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/subhajitlucky/chitraData.git
   cd chitraData
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Building for Production

```bash
# Build the project
npm run build
# or
yarn build

# Preview the build
npm run preview
# or
yarn preview
```

## 📁 Project Structure

```
chitraData/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── ChartPreview.tsx      # Chart rendering component
│   │   ├── Footer.tsx            # Footer component
│   │   ├── GraphCreation.tsx     # Chart creation interface
│   │   ├── GraphGallery.tsx      # Gallery view
│   │   ├── Header.tsx            # Navigation header
│   │   └── LandingPage.tsx       # Landing page
│   ├── hooks/                    # Custom React hooks (if any)
│   ├── types/
│   │   └── index.ts              # TypeScript type definitions
│   ├── utils/
│   │   └── chartRenderer.tsx     # Chart rendering utilities
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # App entry point
│   └── index.css                 # Global styles
├── eslint.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

## 🎯 Key Components

### ChartPreview Component
- Renders different chart types using Chart.js
- Handles data validation and formatting
- Provides accessibility features
- Supports modern chart styling

### GraphCreation Component
- Interactive chart builder interface
- Real-time data input and preview
- Multiple dataset support
- Color customization options

### GraphGallery Component
- Displays saved charts in a grid layout
- Provides chart management features
- Enables chart editing and deletion

## 🎨 Styling & Theming

The project uses **Tailwind CSS** for styling with:
- **Custom color palette** optimized for data visualization
- **Dark mode support** with automatic theme switching
- **Responsive breakpoints** for mobile-first design
- **Custom animations** powered by Framer Motion

## 📊 Supported Data Formats

ChitraData accepts data in various formats:

```typescript
// Simple array format
labels: ['Jan', 'Feb', 'Mar']
data: '10, 20, 30' // Comma-separated values

// Multiple datasets
datasets: [
  { label: 'Sales', data: '100, 150, 200', color: '#3b82f6' },
  { label: 'Profit', data: '50, 75, 100', color: '#ef4444' }
]
```

## 🚀 Deployment

The project is configured for easy deployment on **Vercel**:

1. **Connect your GitHub repository** to Vercel
2. **Configure build settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
3. **Deploy automatically** on every push to main branch

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
1. Follow the existing code style
2. Write TypeScript for type safety
3. Test your changes thoroughly
4. Update documentation as needed

### Reporting Issues
- Use the GitHub issue tracker
- Include steps to reproduce
- Provide screenshots when helpful

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙋‍♂️ Author

**Subhajit Lucky**
- GitHub: [@subhajitlucky](https://github.com/subhajitlucky)

## 🎯 Roadmap

### Upcoming Features
- [ ] **More Chart Types** (Scatter plots, Bubble charts, Radar charts)
- [ ] **Data Import** (CSV, JSON file upload)
- [ ] **Advanced Styling** (Custom themes, fonts, colors)
- [ ] **Collaboration Features** (Share charts via URL)
- [ ] **Export Options** (PDF, SVG formats)
- [ ] **Data Analytics** (Basic statistical insights)

### Version History
- **v1.0.0** - Initial release with core chart types
- **v1.1.0** - Added dark mode and improved UI
- **v1.2.0** - Added gallery and data persistence

---

<div align="center">

**[⬆ Back to Top](#-chitradata)**

Made with ❤️ by [Subhajit Lucky](https://github.com/subhajitlucky)

**⭐ Star this repo if you found it helpful!**

</div>

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
