# Holistica Frontend

This is the frontend client for Holistica, built with Next.js 15, React, Tailwind CSS, and `shadcn/ui`. It offers a dynamic, sleek, and highly interactive user interface designed to explore wellness protocols and engage in community discussions.

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+
- npm, yarn, pnpm, or bun

### 1. Install Dependencies
Navigate into the `frontend` directory and install the necessary packages:
```bash
npm install
# or
yarn install
```

### 2. Environment Configuration
Copy the `.env.example` file to create your local `.env.local` configuration:
```bash
cp .env.example .env.local
```
Ensure it accurately points to your backend Laravel API. By default, it expects the backend to be running on port 8000:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

### 3. Running the Application
Start the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The application supports Hot Module Replacement (HMR) for a seamless development experience.

---

## 🏗 Architecture & Features

### Next.js App Router
Holistica utilizes the Next.js `app/` directory for robust routing, layouts, and server/client component boundaries.

### State Management & Context
- **Context API Context (`context/AuthContext.tsx`)**: Manages the authentication state across the entire application globally, allowing components to react to logged-in/logged-out states frictionlessly.

### UI & Styling
- **Tailwind CSS**: Core utility-first styling.
- **shadcn/ui**: High-quality, accessible, and customizable components (such as Dialogs, Buttons, Select inputs).
- **Framer Motion**: Integrated for smooth, engaging animations (e.g., page transitions, hover states).
- **Sonner**: Used for elegant toast notifications on async actions (creating replies, deleting discussions, etc.).

### Features Overview
- **Protocol Discovery**: A sleek grid-based interface to search, sort, and filter protocols in real-time.
- **Robust Community Engagement**: Recursive threaded comments under discussions, star ratings on protocols, and an upvote/downvote generic system.
- **Dynamic Loading States**: Utilizing skeletal loaders to prevent content jumps and offer snappy perceived performance while APIs resolve.

**Please refer to the root `README.md` for full project-wide documentation.**
