# NextJS Theme ADE

A modern Next.js implementation of the Jekyll Theme ADE, featuring TypeScript, enterprise-grade tooling, and enhanced functionality.

## Features

- 🚀 Next.js 14+ with App Router
- 📝 MDX support for enhanced Markdown processing
- 🔍 Advanced search functionality with Fuse.js
- 🎨 SCSS modules with dark theme
- 📱 Responsive design
- 🧪 Comprehensive testing with Jest
- 📊 Bundle analysis and performance monitoring
- 🔧 TypeScript with strict mode
- 📚 API documentation with TypeDoc

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run test:coverage` - Run tests with coverage
- `npm run type-check` - Run TypeScript type checking
- `npm run analyze` - Analyze bundle size
- `npm run docs` - Generate API documentation

## Project Structure

```
src/
├── app/                    # Next.js App Router
├── components/            # Reusable components
│   ├── ui/               # Basic UI components
│   ├── layout/           # Layout components
│   ├── content/          # Content-specific components
│   └── search/           # Search components
├── lib/                  # Utility libraries
├── types/                # TypeScript definitions
├── styles/               # Global styles and themes
└── content/              # Markdown content
    ├── posts/            # Blog posts
    └── pages/            # Static pages
```

## License

MIT