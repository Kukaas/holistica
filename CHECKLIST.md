# Holistica Project Checklist

This checklist tracks the progress of the Holistica Community Protocol & Discussion Platform.

## Phase 1: Project Setup & Configuration [x]
- [x] Create implementation plan and get approval
- [x] Initialize Laravel backend in `backend/` directory
- [x] Configure database and environment variables (MySQL)
- [x] Install and configure Typesense PHP client
- [x] Initialize Next.js frontend with TailwindCSS
- [x] Configure API base URL connection
- [x] Prepare `.env.example` files

## Phase 2: Core Data Architecture [x]
- [x] Create `Protocol` model (title, content, tags, author, rating)
- [x] Create `Thread` model (title, body, associated protocol)
- [x] Create `Comment` model (threaded replies structure)
- [x] Create `Review` model (rating 1–5 + feedback)
- [x] Create `Vote` model (polymorphic upvote/downvote system)
- [x] Define Eloquent relationships (foreign keys, morphs)

## Phase 3: CRUD Operations & Seeding [ ]
- [ ] Implement RESTful API endpoints for all models
- [ ] Add validation and HTTP status codes
- [ ] Implement pagination for list endpoints
- [ ] Create Factories and Seeders (12+ protocols, 10+ threads)
- [ ] Seed realistic mock data (comments, reviews, votes)

## Phase 4: Typesense Search Integration [ ]
- [ ] Create Typesense collections for `Protocols` and `Threads`
- [ ] Implement automatic indexing (create/update/delete hooks)
- [ ] Support API filters (Title, Recent, Most Reviewed, Top Rated, Most Upvoted)
- [ ] Add reindexing CLI command/route


## Phase 5: Frontend Implementation (Next.js + TailwindCSS + shadcn) [ ]
- [ ] Install `shadcn/ui` and layout components
- [ ] Build search-as-you-type interface
- [ ] Implement dynamic filters
- [ ] Protocol detail page (embedded threads, reviews)
- [ ] Thread detail page (nested comments)
- [ ] Voting UX (upvote/downvote feedback)
- [ ] Responsive design & animations

## Phase 6: Documentation & Final Delivery [ ]
- [ ] Complete `README.md` (setup, API overview, Typesense config)
- [ ] Finalize `.env.example` files
- [ ] 1–2 page implementation notes
- [ ] Final verification and walkthrough
