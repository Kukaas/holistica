# Holistica

***

Holistica is an open-source platform for sharing, discovering, and discussing healthcare protocols. It is designed to act as a community-curated archive of wellness and biohacking routines.

## Project Structure
The project is built as a monolith repository containing both the frontend and backend applications.
- **Backend:** Laravel 11.x (REST API, MySQL Database, Typesense Search Integration)
- **Frontend:** Next.js 15.x (React, TailwindCSS, shadcn/ui)

## ⚙️ Setup Instructions

### Prerequisites
- PHP 8.2+ and Composer
- Node.js 18+ and npm/yarn
- MySQL (Create a database named `holistica` before running migrations)
- Typesense Server (Cloud or Local via Docker)

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install PHP dependencies:
   ```bash
   composer install
   ```
3. Set up the environment file:
   ```bash
   cp .env.example .env
   ```
4. Generate the application key:
   ```bash
   php artisan key:generate
   ```
5. Configure your `.env` file credentials (see **Environment Configuration** section below).
6. Run database migrations and seeders:
   ```bash
   php artisan migrate --seed
   ```
   *Note: This will seed demo data, including the following test users:*
   - **Email:** `maligaso.chesterlukea@gmail.com` | **Password:** `12345678`
   - **Email:** `jhondoe@example.com` | **Password:** `12345678`
7. Start the local development server:
   ```bash
   php artisan serve
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Set up the environment file:
   ```bash
   cp .env.example .env.local
   ```
4. Ensure your `NEXT_PUBLIC_API_BASE_URL` in `.env.local` points to your backend (e.g., `http://localhost:8000/api`).
5. Start the Next.js development server:
   ```bash
   npm run dev
   ```

---

## 🔑 Environment Configuration

### Typesense Key/Config Setup

Holistica utilizes **Typesense** for lightning-fast protocol and discussion search indexing. You must provide a Typesense cluster configuration in your backend `.env` file for the search integration to work properly.

Add or configure the following keys in your `backend/.env`:

```env
TYPESENSE_HOST=your-typesense-host.net
TYPESENSE_PORT=443
TYPESENSE_PROTOCOL=https
TYPESENSE_ADMIN_API_KEY=your-admin-api-key
TYPESENSE_SEARCH_ONLY_API_KEY=your-search-only-api-key
```

**Note:** The `admin-api-key` is required on the backend to create, update, and delete Typesense documents during Laravel Eloquent events.

#### Reindexing Typesense
Whenever you run fresh migrations or seed new data, you must manually sync your database records to Typesense using the provided artisan command:
```bash
php artisan typesense:reindex
```

---

## 📡 API Overview

The backend exposes a JSON REST API under `/api`. Below are the primary resources:

### **Authentication**
- `POST /api/register` - Create a new user account.
- `POST /api/login` - Authenticate an existing user and receive a Sanctum token.
- `POST /api/logout` - Invalidate the current token.
- `GET /api/user` - Get the currently authenticated user.

### **Protocols**
- `GET /api/protocols` - List all protocols (supports `?search=`, `?sort=`, and pagination).
- `GET /api/protocols/{id}` - Get details of a specific protocol.
- `GET /api/protocols/{id}/threads` - Get paginated discussions belonging to a protocol.
- `GET /api/protocols/{id}/reviews` - Get paginated reviews for a protocol.

### **Discussions (Threads)**
- `GET /api/threads` - List all discussions globally (supports `?search=` and pagination).
- `POST /api/threads` - Start a new discussion thread under a specific protocol (Auth required).
- `GET /api/threads/{id}` - Get a specific discussion thread.
- `PUT /api/threads/{id}` - Update a discussion title (Owner only).
- `DELETE /api/threads/{id}` - Delete a discussion thread (Owner only).
- `GET /api/threads/{id}/comments` - Get paginated nested comments/replies recursively.

### **Comments & Feedback**
- `POST /api/comments` - Reply to a thread or another comment (Auth required).
- `PUT /api/comments/{id}` - Edit a comment (Owner only).
- `DELETE /api/comments/{id}` - Delete a comment (Owner only).
- `POST /api/reviews` - Rate (1-5 stars) and review a protocol (Auth required).
- `POST /api/votes` - Upvote or downvote a Protocol, Thread, or Comment (Auth required).
