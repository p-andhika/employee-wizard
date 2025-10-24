# Employee Wizard 🧙‍♂️

A modern, feature-rich employee management application built with React, TypeScript, and Vite. This application provides a multi-step wizard for adding employees with role-based access control, auto-save functionality, and comprehensive form validation.

![React](https://img.shields.io/badge/React-19.1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)
![Vite](https://img.shields.io/badge/Vite-7.1.7-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.15-cyan)

## ✨ Features

### 🎯 Core Functionality

- **Multi-Step Wizard**: Intuitive two-step form for employee onboarding
- **Role-Based Access**: Different form flows for Admin and Ops users
  - **Admin**: Access to full form (Steps 1 & 2)
  - **Ops**: Direct access to Step 2 (Details only)
- **Auto-Save Drafts**: Automatic draft saving every 2 seconds with localStorage
- **Real-time Validation**: Email validation and required field checks
- **Auto-Generated Employee IDs**: Smart employee ID generation based on department

### 🖼️ UI/UX Features

- **Image Upload**: Custom image upload component with preview
- **Autocomplete**: Smart autocomplete for departments and locations
- **Progress Indicator**: Visual step progress with completion states
- **Toast Notifications**: User-friendly notifications using Sonner
- **Responsive Design**: Mobile-first responsive layout

### 🛠️ Technical Features

- **React Query**: Efficient data fetching and caching with TanStack Query
- **Type Safety**: Full TypeScript implementation
- **Custom Hooks**: Reusable API hooks (`useApi.ts`)
- **Component Library**: Radix UI primitives for accessibility and shadcn/ui
- **Testing**: Comprehensive test coverage with Vitest
- **React Compiler**: Optimized with React 19's compiler

## 🚀 Getting Started

### Prerequisites

- Node.js (v20.19 or higher recommended)
- npm package manager

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/p-andhika/employee-wizard.git
cd employee-wizard
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Setup** (Optional)
   Create a `.env` file in the root directory:

```env
VITE_API_URL_1=http://localhost:4001
VITE_API_URL_2=http://localhost:4002
```

### Running the Application

The application requires two mock API servers and the development server:

#### Option 1: Run all servers separately

```bash
# Terminal 1 - Mock API Server 1 (Departments & Basic Info)
npm run server1

# Terminal 2 - Mock API Server 2 (Locations & Details)
npm run server2

# Terminal 3 - Development Server
npm run dev
```

#### Option 2: Use a process manager (recommended)

```bash
# Install concurrently globally
npm install -g concurrently

# Create a custom script in package.json
"dev:all": "concurrently \"npm run server1\" \"npm run server2\" \"npm run dev\""
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
employee-wizard/
├── src/
│   ├── components/
│   │   ├── custom/          # Custom business components
│   │   │   ├── autocomplete.tsx
│   │   │   ├── employee-list.tsx
│   │   │   ├── image-upload.tsx
│   │   │   ├── wizard.tsx
│   │   │   └── __tests__/   # Component tests
│   │   └── ui/              # Reusable UI components (Radix UI) & shadcn/ui
│   ├── hooks/
│   │   ├── useApi.ts        # Custom API hooks
│   │   └── __tests__/
│   ├── lib/
│   │   ├── utils.ts         # Utility functions
│   │   └── __tests__/
│   ├── services/
│   │   └── api.ts           # API service layer
│   ├── test/
│   │   ├── mockData.ts      # Test mock data
│   │   ├── setup.ts         # Test configuration
│   │   └── utils.tsx        # Test utilities
│   ├── types/
│   │   └── index.ts         # TypeScript type definitions
│   ├── app.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── coverage/                # Test coverage reports
├── db-step1.json           # Mock data for server 1
├── db-step2.json           # Mock data for server 2
└── vite.config.ts          # Vite configuration
```

## 🧪 Testing

The project includes comprehensive testing with Vitest:

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

Coverage reports are generated in the `coverage/` directory.

## 🏗️ Build & Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📦 Tech Stack

### Frontend Framework

- **React 19.1.1** - UI library with latest features
- **TypeScript 5.9.3** - Type-safe JavaScript
- **Vite 7.1.7** - Next-generation frontend tooling

### UI & Styling

- **TailwindCSS 4.1.15** - Utility-first CSS framework
- **Radix UI and shadcn/ui** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **class-variance-authority** - Component variant management

### State & Data Management

- **TanStack Query (React Query) 5.90.5** - Server state management
- **Axios 1.12.2** - HTTP client
- **Lodash 4.17.21** - Utility functions

### Developer Experience

- **Vitest 4.0.2** - Fast unit testing framework
- **Testing Library** - React component testing utilities
- **ESLint** - Code linting
- **React Compiler** - Performance optimization

## 🎨 Key Components

### Wizard Component

Multi-step form with role-based access and auto-save functionality.

**Features:**

- Two-step progression
- Draft auto-save with localStorage
- Real-time validation
- Dynamic employee ID generation

### Autocomplete Component

Smart autocomplete with debounced search and API integration.

**Features:**

- Debounced search (500ms)
- Loading states
- Custom display field support

### Image Upload Component

Image uploader with preview.

**Features:**

- Image preview
- Base64 encoding
- File type validation

### Employee List Component

Display and manage employee records.

**Features:**

- Real-time employee data
- Role-based wizard triggering
- Responsive layout

## 📝 API Structure

The application uses two separate JSON Server instances:

### Server 1 (Port 4001)

- **Departments**: List of departments
- **Basic Info**: Employee basic information (name, email, department, role, ID)

### Server 2 (Port 4002)

- **Locations**: Office locations
- **Details**: Employee details (photo, employment type, location, notes)

Data is merged client-side based on email or employee ID.

## 🐛 Known Issues & Limitations

- Mock servers have a 3-second delay to simulate network latency
- localStorage is used for draft persistence (not suitable for multi-device)
- Image uploads are stored as base64 (consider using a file storage service for production)

## 📄 License

This project is created for learning purposes.

## 👤 Author

**Andhika Prakasiwi**

- GitHub: [@p-andhika](https://github.com/p-andhika)

## 🙏 Acknowledgments

- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [shadcn/ui](https://ui.shadcn.com/) for component inspiration
- [Vite](https://vitejs.dev/) for amazing developer experience
- [TanStack Query](https://tanstack.com/query) for powerful data synchronization

---

Built with ❤️ using React + TypeScript + Vite
