# Holistica Backend

This is the backend for the Holistica platform, built with Laravel 11. It serves as a REST API managing health protocols, threaded discussions, comments, and community feedback, all supercharged with Typesense for lightning-fast search capabilities.

## 🚀 Setup & Installation

### Prerequisites
- PHP 8.2+
- Composer
- MySQL or MariaDB
- Typesense Server (Local via Docker or Typesense Cloud)

### 1. Install Dependencies
```bash
composer install
```

### 2. Environment Configuration
Copy the `.env.example` file and configure your environment variables:
```bash
cp .env.example .env
```
Generate the application key:
```bash
php artisan key:generate
```

#### Database Configuration
Update the `.env` file with your database credentials:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=holistica
DB_USERNAME=root
DB_PASSWORD=
```

#### Typesense Configuration
To enable the high-performance search engine, configure your Typesense host and API keys in the `.env` file:
```env
TYPESENSE_HOST=your-typesense-host.net
TYPESENSE_PORT=443
TYPESENSE_PROTOCOL=https
TYPESENSE_ADMIN_API_KEY=your-admin-api-key
TYPESENSE_SEARCH_ONLY_API_KEY=your-search-only-api-key
```

### 3. Database Migration and Seeding
Run the database migrations and populate the database with dummy data (protocols, users, threads, comments):
```bash
php artisan migrate --seed
```

### 4. Full Reset & Quick Setup
For a complete reset of the database and search index, run this unified command:
```bash
php artisan migrate:fresh --seed; php artisan typesense:reindex
```
> **Note:** Use `&&` instead of `;` if you are using CMD or Bash. This will wipe your database, re-seed demo data, and sync everything to Typesense.

> **Automatic Sync:** During normal operation, any creating, updating, or deleting of models will automatically be synced to Typesense via Eloquent observers.

### 5. Running the Application
Start the local development server:
```bash
php artisan serve
```
The API will be accessible at `http://localhost:8000/api`.

---

## 📡 Core API Resources

### Authentication (`/api/register`, `/api/login`, `/api/user`)
Manages user authentication and token issuance using Laravel Sanctum.

### Protocols (`/api/protocols`)
Resource for fetching wellness protocols. Supports robust querying (search, filtering, and sorting) handled natively via Typesense.

### Discussions/Threads (`/api/protocols/{id}/threads`, `/api/threads/{id}`)
Endpoints dedicated to viewing or starting new discussion threads linked to a specific protocol.

### Comments & Replies (`/api/threads/{id}/comments`)
Supports deep, recursive threaded conversations within discussions.

### Reviews & Votes (`/api/reviews`, `/api/votes`)
Allows users to give a 1-5 star grade on protocols and cast Upvotes or Downvotes on protocols, threads, and comments.

**Please refer to the root `README.md` for full project-wide documentation.**
