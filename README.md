# forge2-qualifier-princi
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/princitripathi/forge2-qualifier-princi)

This repository contains a simple frontend application built with React and Vite. It serves as a starter template demonstrating a basic React component with state management, styling, and helpful links for getting started with the Vite and React ecosystems.

The application displays a hero section with Vite and React logos, a counter that increments on button clicks, and sections linking to official documentation and community channels.

## Tech Stack

-   **Frontend:** [React](https://react.dev/)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Linting:** [ESLint](https://eslint.org/)

## Project Structure

```
.
├── public/              # Static assets
├── src/
│   ├── assets/          # Image assets
│   ├── App.css          # Styles for the App component
│   ├── App.jsx          # Main application component
│   ├── index.css        # Global styles
│   └── main.jsx         # Application entry point
├── .eslintrc.config.js  # ESLint configuration
├── index.html           # Main HTML entry file
├── package.json         # Project dependencies and scripts
└── vite.config.js       # Vite configuration
```

## Getting Started

### Prerequisites

-   Node.js
-   npm (or a compatible package manager)

### Installation & Usage

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/princitripathi/forge2-qualifier-princi.git
    cd forge2-qualifier-princi
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    This command starts the Vite development server with Hot Module Replacement (HMR) enabled.
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

### Available Scripts

The `package.json` file includes the following scripts:

-   `npm run dev`: Starts the development server.
-   `npm run build`: Bundles the application for production into the `dist` directory.
-   `npm run lint`: Lints the project files using ESLint.
-   `npm run preview`: Starts a local server to preview the production build.
