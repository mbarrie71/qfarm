# QFarm - AgriTech Platform

QFarm is an innovative agricultural marketplace platform connecting farmers and buyers in Sierra Leone through a comprehensive digital solution. Built for the KNESST Qcell Challenge by Mohamed Barrie, Njala University Graduate 2024.

## Features

- User Authentication & Authorization
- Advanced Crop Marketplace
  - Search functionality
  - Price range filtering
  - Category-based filtering
  - Location filtering
  - Featured crops section
- Farmer Profiles & Management
- Order Processing
- Secure Payments Integration
- Admin Dashboard
- Mobile Responsive Design

## Tech Stack

- Frontend: React 18 with TypeScript
- Styling: TailwindCSS 3
- Backend: Supabase
- State Management: Zustand
- Form Handling: React Hook Form
- Validation: Yup
- API Client: Axios & React Query
- Routing: React Router DOM
- Testing: Vitest
- Notifications: React Hot Toast

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/mbarrie71/qfarm.git
   cd qfarm
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── AdvancedFilter/
│   ├── CropGrid/
│   ├── FeaturedCrops/
│   └── Footer/
├── features/       # Feature-specific components
│   ├── auth/
│   ├── marketplace/
│   └── profile/
├── hooks/         # Custom React hooks
├── lib/           # Third-party configurations
├── pages/         # Page components
├── services/      # API integrations
├── store/         # Global state
├── types/         # TypeScript types
└── utils/         # Utility functions
```

## Deployment

### Netlify Deployment

1. Fork the repository to your GitHub account

2. Connect your GitHub repository to Netlify:
   - Log in to Netlify
   - Click "New site from Git"
   - Choose your repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
     - Node version: 18

3. Set up environment variables in Netlify:
   - Go to Site settings > Build & deploy > Environment
   - Add the required environment variables:
     ```
     VITE_SUPABASE_URL
     VITE_SUPABASE_ANON_KEY
     ```

4. Deploy:
   - Netlify will automatically deploy your site
   - Any push to the main branch will trigger a new deployment

### Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Test the production build locally:
   ```bash
   npm run preview
   ```

3. Deploy the `dist` directory to your hosting provider

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code

### Code Quality

- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety
- Vitest for testing

## Contact

- Developer: Mohamed Barrie
- Email: [Your Email]
- Phone: +232 99 715 857
- Location: Kamakwie Town, Sierra Leone

## License

This project is part of the KNESST Qcell Challenge. All rights reserved.
