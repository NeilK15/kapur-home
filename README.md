# Kapur Home

A private household web app for the Kapur family. Currently focused on recipe and cookbook management, with plans for groceries, chat, and home automation down the road.

---

## Overview

Kapur Home lets household members save, organize, and browse recipes. You can add recipes manually or by pasting a URL (the server scrapes the recipe data automatically). Recipes can be grouped into cookbooks. All features require sign-in — access is authenticated via AWS Cognito.

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

### Data Models

**Recipe** — name, prep/cook/total time, servings, cuisine, courses, keywords, ingredient groups (with amounts and units), instruction groups (with optional step images), tips, nutrition info, author, source URL, and cover image.

**Cookbook** — name, description, cover image, and a reference to the user who created it. Recipes are linked to a cookbook via `cookbookId`.

### Authentication

Sign-in is handled by **AWS Cognito**. The client uses AWS Amplify to manage the auth flow and attaches the Cognito access token to every API request. The server verifies the token using `aws-jwt-verify` before processing any request.

---

## Running Locally

### Prerequisites

- Node.js
- A MongoDB connection string
- AWS Cognito User Pool (user pool ID + app client ID)

### Server

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```
PORT=3000
MONGODB_URI=<your MongoDB URI>
DB_NAME=<your DB name>
DB_RECIPE_COLLECTION=<collection name>
DB_TAG_COLLECTION=<collection name>
COGNITO_USER_POOL_ID=<your user pool ID>
COGNITO_APP_CLIENT_ID=<your app client ID>
ALLOWED_ORIGINS=http://localhost:5173
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

## Planned Features

- Recipe scaling (2x, 4x, etc.)
- Search by ingredient, keyword, and cook time
- Nutritional facts display
- Recipe duplication
- Cuisine and keyword separation
- Category tags (main dish, side dish, appetizer, dessert)
- Realtime household chat
- Grocery list management
- Calendar event notifications
- Home automation integrations
