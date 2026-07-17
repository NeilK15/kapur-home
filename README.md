# Kapur Home

A private household web app for the Kapur family. Currently focused on recipe and cookbook management, with plans for groceries, chat, and home automation down the road.

**Current version: 1.0.0**

---

## Overview

Kapur Home lets household members save, organize, and browse recipes. You can add recipes manually or by pasting a URL (the server scrapes the recipe data automatically). Recipes can be grouped into cookbooks. All features require sign-in — access is invite-only via AWS Cognito (public sign-up is disabled).

---

## How It Works

The project is a full-stack app split into two directories:

```
kapur-home/
├── client/   # React frontend (Vite + TypeScript)
└── server/   # Express backend (Node.js)
```

### Client

Built with **React 18 + TypeScript** and bundled with **Vite**. Uses React Router v6 for navigation and AWS Amplify for authentication. Deployed on **AWS Amplify**.

| Route | Page |
|---|---|
| `/` | Recipe list |
| `/recipes/add` | Add a new recipe |
| `/recipes/:id` | Recipe detail |
| `/recipes/edit/:id` | Edit a recipe |
| `/cookbooks` | Cookbook list |
| `/cookbooks/:id` | Cookbook detail + its recipes |
| `/settings` | User preferences (theme, etc.) |

### Server

Built with **Express** and connects to **MongoDB** via Mongoose. All routes are protected — every request must include a valid AWS Cognito access token in the `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/v1/recipes` | List recipes (supports filter, limit, cookbookId) |
| `POST` | `/v1/recipes` | Add a recipe (manually or by URL) |
| `GET` | `/v1/recipes/:id` | Get a single recipe |
| `PUT` | `/v1/recipes/:id` | Update a recipe |
| `DELETE` | `/v1/recipes/:id` | Delete a recipe |
| `GET` | `/v1/cookbooks` | List cookbooks |
| `POST` | `/v1/cookbooks` | Create a cookbook |
| `GET` | `/v1/cookbooks/:id` | Get a cookbook and its recipes |
| `DELETE` | `/v1/cookbooks/:id` | Delete a cookbook |
| `POST` | `/v1/upload/image` | Upload and process a recipe image to S3 |
| `GET` | `/v1/preferences` | Get the current user's preferences |
| `PUT` | `/v1/preferences` | Update the current user's preferences |

### Data Models

**Recipe** — name, prep/cook/total time, servings, cuisine, courses, keywords, ingredient groups (with amounts and units), instruction groups (with optional step images), tips, nutrition info, author, source URL, and cover image.

**Cookbook** — name, description, cover image, and a reference to the user who created it. Recipes are linked to a cookbook via `cookbookId`.

**UserPreferences** — per-user settings stored in MongoDB and synced across devices. Currently stores `theme` (`"dark"` | `"light"`).

### Authentication

Sign-in is handled by **AWS Cognito**. Public sign-up is disabled — users must be created by an admin. The client uses AWS Amplify to manage the auth flow and attaches the Cognito access token to every API request. The server verifies the token using `aws-jwt-verify` before processing any request.

---

## Running Locally

### Prerequisites

- Node.js
- A MongoDB connection string
- AWS Cognito User Pool (user pool ID + app client ID)
- AWS S3 bucket (for image uploads)

### Server

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```
PORT=3000
DB_URI=<your MongoDB URI>
COGNITO_USER_POOL_ID=<your user pool ID>
COGNITO_APP_CLIENT_ID=<your app client ID>
ALLOWED_ORIGINS=http://localhost:5173
AWS_REGION=<your AWS region>
S3_BUCKET_NAME=<your S3 bucket name>
```

```bash
npm run dev   # starts with nodemon
```

### Client

```bash
cd client
npm install
```

Create a `.env` file in `client/`:

```
VITE_API_URI=http://localhost:3000/v1
VITE_COGNITO_USER_POOL_ID=<your user pool ID>
VITE_COGNITO_APP_CLIENT_ID=<your app client ID>
```

```bash
npm run dev   # starts Vite dev server at http://localhost:5173
```

---

## Deployment

- **Client** — AWS Amplify (configured via `amplify.yml` at the repo root)
- **Server** — AWS Elastic Beanstalk using the `Dockerfile` in `server/`

---

## Versioning

This project uses [semantic versioning](https://semver.org/):

- **PATCH** (1.0.x) — bug fixes and minor tweaks
- **MINOR** (1.x.0) — new user-facing features
- **MAJOR** (x.0.0) — major redesigns or architectural changes

The version is defined in `client/package.json` and displayed in the app's Settings page. Each release is tagged in git (`git tag v1.0.0`).

### Changelog

#### v1.0.0
- Manual recipe creation and editing with a multi-step wizard
- Recipe detail view with ingredients and instructions
- Cookbook management (create, browse, add recipes)
- Image upload for recipes (iOS and desktop, processed via Sharp on the server)
- Invite-only authentication via AWS Cognito
- Dark and light mode with per-user preference stored in MongoDB

---

## Planned Features

- Recipe scaling (2x, 4x, etc.)
- Search by ingredient, keyword, and cook time
- Nutritional facts display
- Recipe duplication
- Cuisine and keyword filtering
- Category tags (main dish, side dish, appetizer, dessert)
- Realtime household chat
- Grocery list management
- Calendar event notifications
- Home automation integrations
