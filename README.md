# Page App

A modern React + TypeScript application built with Vite, with comprehensive linting, pre-commit hooks, Redux Toolkit state management, and Node.js version management.

## Live Demo

**[View Live Demo](https://sample-reactjs-c6d21.web.app/)**

## Prerequisites

- **Node.js**: Version 22.x (LTS) - see [Node.js version management](#nodejs-version-management)
- **npm**: Version 10.x or higher

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Prepare Husky

```bash
npm run prepare
```

This enables pre-commit hook

### 2. Run the Development Server

```bash
npm run dev
```

This will start the Vite development server with Hot Module Replacement (HMR). Open [http://localhost:5173](http://localhost:5173) to view the application.

### 3. Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### 4. Preview Production Build

```bash
npm run preview
```

## Linting

This project includes comprehensive ESLint configuration with React-specific rules, pre-commit hooks, and automatic code formatting.

### Available Commands

```bash
# Run linting on all files (JS/TS)
npm run lint

# Run linting and automatically fix issues
npm run lint:fix

# Run TypeScript type checking
npm run typecheck

# Build for production
npm run build
```

### Linting Features

- **Zero warnings policy**: The linter enforces zero warnings
- **TypeScript support**: Full TypeScript linting with type-aware rules
- **React-specific rules**: Proper JSX handling, hooks validation, and React best practices
- **Code quality rules**: Enforces modern JavaScript/TypeScript patterns and consistency
- **Security rules**: Validates external links and prevents security vulnerabilities
- **Pre-commit hooks**: Automatically lints and fixes code before commits

### Pre-commit Hooks

The project uses Husky and lint-staged to automatically:
- Run ESLint on staged files
- Fix auto-fixable issues
- Prevent commits with linting errors

## Node.js Version Management

This project requires Node.js 22.x (LTS). The project includes version management files:

- `.nvmrc`: For nvm users
- `.node-version`: For other version managers
- `package.json` engines field: Enforces version requirements

### Using nvm (Recommended)

```bash
# Install and use the correct Node.js version
nvm use
```

## Technology Stack

- **React 19**: Latest React with modern features
- **TypeScript**: Type-safe JavaScript with full IDE support
- **Vite 7**: Fast build tool and dev server
- **Redux Toolkit**: Modern Redux state management
- **ESLint**: Code linting with React and TypeScript plugins
- **Husky**: Git hooks management
- **lint-staged**: Pre-commit linting

## API Layer

This project includes a comprehensive API layer with:

- **Factory Pattern**: Centralized API client management
- **Mock & Real Clients**: Switch between mock and real APIs
- **Schema Management**: Type-safe API response handling
- **Error Handling**: Consistent error management across clients
- **Environment Configuration**: Easy switching between environments

## Development Features

- **TypeScript**: for full type safety
- **Modern JavaScript**: ES2022+ features
- **Comprehensive Linting**: Catches errors and enforces best practices
- **Pre-commit Quality Gates**: Ensures code quality before commits
