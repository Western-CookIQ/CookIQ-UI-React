![ESLint](https://github.com/Western-CookIQ/CookIQ-UI-React/actions/workflows/eslint.yml/badge.svg)

![Built & Deployed](https://github.com/Western-CookIQ/CookIQ-UI-React/actions/workflows/main.yml/badge.svg)

# CookIQ-UI-React

Welcome to the CookIQ-UI-React repository! This is the frontend codebase for the CookIQ application, a comprehensive platform for cooking enthusiasts and professional chefs. The application is built with React and leverages Material-UI for a modern, responsive user interface.

## Features

1. **User Authentication**: The application includes pages for user login (`LoginPage`), sign up (`SignUpPage`), and password recovery (`ForgotPasswordPage`). Automatically sending verification codes to a user's email.

2. **Recipe Discovery and Management**: Users can discover new recipes (`FeedPage`), save their favorite recipes, and manage their personal recipe collection (`Bookmarks`).

3. **Recipe Recommendations**: The `RecommendationPage` provides personalized recipe recommendations based on user preferences and interactions.

4. **Social Features**: The `ConnectionPage` and `ChatPage` allow users to connect with other users and engage in conversations about their culinary adventures.

5. **User Settings**: The `Settings` page allows users to manage their account settings.

## Getting Started

To set up the development environment:

1. Clone the repository:

   ```bash
   git clone https://github.com/Western-CookIQ/CookIQ-UI-React.git
   ```

2. Navigate to the project directory:

   ```bash
   cd CookIQ-UI-React
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

This will start the development server and you can view the application in your browser at `http://localhost:3000`.

To build the production-ready static files, run:

```bash
npm run build
```

This will create a `build` directory with the static files necessary to serve the application.

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more details.
