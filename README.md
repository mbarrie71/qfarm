# QFarm - AgriTech Platform

QFarm is an innovative agricultural marketplace platform connecting farmers and buyers in Sierra Leone through a comprehensive digital solution.

## Features

- User Authentication
- Crop Marketplace
- Farmer Profiles
- Farming Resources
- Secure Payments
- Admin Dashboard

## Tech Stack

- Frontend: React with TypeScript
- Styling: TailwindCSS
- Backend: Supabase
- State Management: Zustand
- Form Handling: React Hook Form
- API Client: Axios & React Query
- Routing: React Router DOM

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── features/       # Feature-specific components and logic
├── hooks/         # Custom React hooks
├── lib/           # Third-party library configurations
├── pages/         # Page components
├── services/      # API and external service integrations
├── store/         # Global state management
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
