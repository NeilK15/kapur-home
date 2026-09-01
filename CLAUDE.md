# Kapur Home

Private, invite-only household app for the Kapur family — recipe & cookbook manager
(groceries / chat / home-automation planned later). Auth is AWS Cognito, sign-up disabled.

## Packages

| Dir | What | Status |
|---|---|---|
| `server/` | Express 4 + Mongoose/MongoDB REST API under `/v1`, Cognito token verify (`aws-jwt-verify`), S3 image uploads via `sharp`. Docker → Elastic Beanstalk. | Stable. **Not changing** during the mobile migration. |
| `client/` | Vite + React 18 web SPA, `react-router-dom` v6, `@aws-amplify/ui-react`. Amplify Hosting. | **Legacy.** Frozen reference. Deleted once `mobile/` reaches parity. |
| `mobile/` | **Expo SDK 57 + Expo Router + TypeScript** native app (iOS/Android). Active development. | Scaffolded (Phase 1). See below. |

## Active work: web → React Native migration

Full plan and phase-by-phase detail: **`docs/expo-migration.md`**. Read it before touching `mobile/`.

- Branch: **`expo-migration`**.
- Native-only (no Expo web). The server and its API contract stay as-is.
- **Current state:** Phase 1 done — `mobile/` scaffolded, deps installed, `app.json` + `.env` set up,
  `expo-doctor` 21/21.
- **Next: Phase 2 (auth).** Wire `Amplify.configure` + `<Authenticator>` from
  `@aws-amplify/ui-react-native` in `mobile/src/app/_layout.tsx`, then prove sign-in →
  `fetchAuthSession()` token → an authed `GET /v1/preferences` on a dev build. Details in the plan.

### First-time setup on a new machine

```bash
git checkout expo-migration
cd mobile
npm install
cp .env.example .env      # then fill in real values:
                          #   EXPO_PUBLIC_API_URI  -> LAN IP of the server, incl. /v1 (not localhost)
                          #   EXPO_PUBLIC_COGNITO_* -> same values client/ uses for VITE_COGNITO_*
```

Amplify needs native modules, so **Expo Go will not work** — use a dev build:
`npx expo run:ios` or `npx expo run:android` (generates `mobile/ios` + `mobile/android`, both git-ignored).
Run the API locally with `cd server && npm run dev`.

## Conventions

- Prettier: `.prettierrc` at root — **4-space indent**, `printWidth` 120. Applies everywhere.
- Line endings: `.gitattributes` forces LF. Don't fight it.
- `mobile/` uses `EXPO_PUBLIC_*` env vars (embedded at build time). `client/` uses `import.meta.env.VITE_*`.
- Commit only when asked. `mobile/ios` and `mobile/android` are generated — never commit them.
- Data-fetching in `mobile/` goes through `@tanstack/react-query` hooks in `mobile/src/queries/`,
  not ad-hoc `useEffect` (that's the `client/` pattern being replaced).

## Gotchas

- Client/server type drift: client `course` vs server `courses[]`, client `notes` vs server `tips`,
  client `*TimeUnit` vs server misspelled `*TiemUnit`. Server stores loosely; unknown keys dropped.
- Server needs undocumented env `DB_RECIPE_COLLECTION`, `DB_TAG_COLLECTION` (`server/models/recipe.js`)
  plus `AWS_REGION`, `S3_BUCKET_NAME`.
- `client/src/components/recipe-edit/` is dead code — do not port it.
- API responses are inconsistent (bare JSON string IDs, `Error` vs `error` keys). Normalising is a
  separate future task, not part of this migration.
