# PromptForge AI - Frontend

Next.js frontend application for AI-powered prompt enhancement.

## 🎨 Features

- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Real-time Enhancement**: Live prompt optimization
- **Multiple Modes**: Standard, Creative, Technical, and Concise enhancement modes
- **Result Comparison**: Side-by-side comparison of original and enhanced prompts
- **Copy Functionality**: Easy copying of enhanced prompts
- **Loading States**: Smooth loading animations
- **Error Handling**: Comprehensive error handling and user feedback

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │◄──►│   FastAPI       │
│                 │    │    Backend      │
└─────────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────┐
│     Browser     │
│                 │
└─────────────────┘
```

## 📁 Project Structure

```
frontend/
├── app/
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/
│   ├── prompt-input.tsx         # Main prompt input
│   ├── result-card.tsx          # Result display
│   └── copy-button.tsx          # Copy functionality
├── types/
│   └── api.ts                   # TypeScript types
├── public/                      # Static assets
├── package.json                 # Dependencies
├── tailwind.config.js           # Tailwind configuration
└── tsconfig.json               # TypeScript configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Backend API running on port 8000

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd promptforge-ai/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local if needed
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

### Using Docker

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🎯 Usage

### Enhancing Prompts

1. **Select Enhancement Mode**: Choose from Standard, Creative, Technical, or Concise
2. **Enter Your Prompt**: Type or paste your prompt in the text area
3. **Click Enhance**: The AI will optimize your prompt
4. **Review Results**: Compare original vs enhanced prompts
5. **Copy Enhanced Prompt**: Use the copy button to copy the optimized version

### Enhancement Modes

- **Standard**: Balanced enhancement for general use
- **Creative**: Focus on creativity and storytelling
- **Technical**: Precise and structured for technical tasks
- **Concise**: Make prompts more brief and efficient

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |

### Tailwind CSS

The project uses Tailwind CSS for styling. Configuration can be found in `tailwind.config.js`.

### TypeScript

TypeScript is configured for type safety. Configuration can be found in `tsconfig.json`.

## 🧪 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use Tailwind CSS for styling
- Write responsive components
- Implement proper error handling

## 🚀 Deployment

### Vercel Deployment

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy automatically** on git push

### Other Platforms

The frontend can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- Render
- AWS Amplify

### Environment Setup

```bash
# Production environment variables
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

## 🎨 Customization

### Styling

- Modify `tailwind.config.js` for theme customization
- Update `app/globals.css` for global styles
- Use CSS modules for component-specific styles

### Components

- Create new components in the `components/` directory
- Follow the existing component patterns
- Use TypeScript interfaces for props

## 🔒 Security

- Input validation on the client side
- Proper error handling
- No sensitive data in client-side code
- Environment variables for configuration

## 📊 Performance

- Optimized images with Next.js Image component
- Code splitting with Next.js App Router
- Efficient state management
- Minimal bundle size

## 🤝 Contributing

1. Follow the code style
2. Write TypeScript types for new features
3. Add tests for new components
4. Update documentation
5. Submit pull requests

## 📄 License

MIT License