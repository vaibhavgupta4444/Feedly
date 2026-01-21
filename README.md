# Social Media Frontend

A modern social media application built with React, TypeScript, and Ant Design. This application provides a complete social networking experience with user authentication, post creation, profile management, and social interactions.

## 🚀 Features

- **User Authentication**
  - Sign up with email and password
  - Sign in with secure authentication
  - Password reset functionality
  - Session management with JWT tokens

- **Feed & Posts**
  - Create and share posts
  - View posts from all users
  - Interactive post composer with rich UI
  - Real-time post updates

- **User Profiles**
  - Personal profile page
  - View other users' profiles
  - Display user statistics (posts, followers, following)
  - Followers and following lists

- **Notifications**
  - Stay updated with app notifications
  - Notification center

- **Responsive Design**
  - Mobile-friendly interface
  - Clean and modern UI with Ant Design
  - Tailwind CSS for custom styling

## 🛠️ Tech Stack

- **Framework**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **Build Tool**: Vite 7.2.4
- **UI Library**: Ant Design 6.2.1
- **Styling**: Tailwind CSS 4.1.18
- **Routing**: React Router 7.12.0
- **HTTP Client**: Axios 1.13.2
- **Linting**: ESLint 9.39.1

## 📁 Project Structure

```
social-media-frontend/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable components
│   │   ├── AppHeader.tsx
│   │   ├── PostComposer.tsx
│   │   └── PostItem.tsx
│   ├── contexts/       # React contexts
│   │   └── userContext.tsx
│   ├── lib/           # Utility libraries
│   │   └── api.ts     # Axios API configuration
│   ├── pages/         # Page components
│   │   ├── feed.tsx
│   │   ├── profile.tsx
│   │   ├── signin.tsx
│   │   ├── signup.tsx
│   │   ├── notifications.tsx
│   │   ├── forgot-password.tsx
│   │   └── reset-password.tsx
│   ├── providers/     # Context providers
│   │   └── userProvider.tsx
│   ├── App.tsx        # Main app component
│   ├── main.tsx       # Application entry point
│   ├── router.tsx     # Route configuration
│   └── type.d.ts      # TypeScript type definitions
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd social-media-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure the API endpoint:
   - Update the API base URL in `src/lib/api.ts` to point to your backend server

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start the development server with hot module replacement
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally

## 🔌 API Integration

The application uses Axios for API calls. All API requests are configured in `src/lib/api.ts`. Make sure to:

1. Set the correct `baseURL` for your backend API
2. Configure authentication token handling
3. Set up request/response interceptors as needed

Example API configuration:
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Update this
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

## 🎨 Customization

### Styling
- Ant Design theme can be customized in the component level
- Tailwind CSS configuration is available in `tailwind.config.js`
- Global styles are defined in `src/index.css`

### Routes
- Add or modify routes in `src/router.tsx`
- Each route should have a corresponding page component in `src/pages/`

## 🔐 Authentication Flow

1. User signs up or signs in
2. JWT token is stored in localStorage
3. Token is automatically attached to API requests
4. User context provides authentication state across the app
5. Protected routes redirect to sign-in if not authenticated

## 📱 Pages

- **/** - Landing/Home page
- **/signin** - User login
- **/signup** - User registration
- **/forgot-password** - Password recovery
- **/reset-password** - Password reset
- **/feed** - Main feed with all posts
- **/profile/:userId** - User profile page
- **/notifications** - Notifications center

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🐛 Known Issues

- Ensure backend API is running before starting the frontend
- Check CORS configuration if experiencing API connection issues

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

Built with ❤️ using React + TypeScript + Vite
