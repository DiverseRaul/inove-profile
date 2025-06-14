# inove.profile - Vue.js 3 Profile Website

A clean, modern, dark-mode Vue.js 3 profile website for inove.studio with Material 3 Expressive design inspiration, proper file organization, and Supabase integration.

## 🚀 Features

- **Modern Vue.js 3** with TypeScript and Composition API
- **Material Design 3** dark theme with expressive design elements
- **Responsive Design** optimized for all devices
- **Supabase Integration** for contact forms and data management
- **Clean Architecture** with well-organized component structure
- **Performance Optimized** with Vite build system

## 📁 Project Structure

```
inove-profile/
├── src/
│   ├── components/          # Reusable UI components
│   │   └── NavigationBar.vue
│   ├── views/              # Page components
│   │   ├── HomeView.vue
│   │   ├── AboutView.vue
│   │   ├── ServicesView.vue
│   │   ├── PortfolioView.vue
│   │   └── ContactView.vue
│   ├── router/             # Vue Router configuration
│   ├── stores/             # Pinia state management
│   ├── composables/        # Reusable composition functions
│   │   └── useSupabase.ts
│   ├── types/              # TypeScript type definitions
│   │   └── supabase.ts
│   └── assets/             # Static assets and styles
│       └── main.css
├── public/                 # Public static files
├── SUPABASE_SETUP.md      # Database setup instructions
└── .env.example           # Environment variables template
```

## 🎨 Design System

The website implements Material Design 3 with:
- **Dark Theme** as primary color scheme
- **Expressive Typography** with Material 3 type scale
- **Dynamic Color System** with primary, secondary, and surface colors
- **Elevation and Shadows** for depth and hierarchy
- **Smooth Animations** and micro-interactions

## 🛠 Technology Stack

- **Frontend**: Vue.js 3, TypeScript, Vite
- **Styling**: CSS3 with Material Design 3 tokens
- **Routing**: Vue Router 4
- **State Management**: Pinia
- **Backend**: Supabase (Database, Authentication)
- **Build Tool**: Vite
- **Code Quality**: ESLint, Prettier

## 📱 Pages

1. **Home** - Hero section with company introduction and key services
2. **About** - Company story, mission, values, and team information
3. **Services** - Detailed service offerings with features
4. **Portfolio** - Project showcase with filtering capabilities
5. **Contact** - Contact form with Supabase integration

## 🗄 Database Integration

The website includes Supabase integration for:
- Contact form submissions
- Newsletter subscriptions
- Portfolio project management
- Basic analytics tracking

See `SUPABASE_SETUP.md` for complete database schema and setup instructions.

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Add your Supabase credentials
   ```

3. **Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## 📋 Environment Variables

Create a `.env.local` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🎯 Key Features Implemented

### Material Design 3 Implementation
- Custom CSS variables for Material 3 color tokens
- Typography scale following Material 3 guidelines
- Elevation system with proper shadows
- Interactive states and animations

### Vue.js 3 Best Practices
- Composition API for better code organization
- TypeScript for type safety
- Proper component separation and reusability
- Reactive data management with Pinia

### Supabase Integration
- Contact form with error handling
- Database service layer for clean API calls
- Type-safe database operations
- Analytics tracking capabilities

### Performance Optimizations
- Lazy loading for route components
- Optimized asset loading
- Minimal bundle size with tree shaking
- Fast development with Vite HMR

## 🔧 Customization

The website is designed to be easily customizable:

1. **Colors**: Modify CSS custom properties in `src/assets/main.css`
2. **Content**: Update text content in respective Vue components
3. **Branding**: Replace logo and company information
4. **Database**: Follow `SUPABASE_SETUP.md` for database configuration

## 📞 Support

For questions or support regarding this project, please contact the development team or refer to the documentation provided.

---

Built with ❤️ using Vue.js 3 and Material Design 3

