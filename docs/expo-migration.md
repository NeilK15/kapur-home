# Expo / React Native migration roadmap

Moving the frontend from the Vite web SPA (`client/`) to a native iOS/Android app
built with Expo (`mobile/`). The app has **no users yet**, so this is a clean rewrite
of the frontend only — **the server (`server/`) is not changing**.

- **Native-only** (no Expo web). `client/` stays as a working reference until parity, then is deleted.
- All new code lives in **`mobile/`** (Expo SDK 57, Expo Router, TypeScript). App dir: `mobile/src/app/`.
- Branch: **`expo-migration`**.

## Status

| Phase | State |
|---|---|
| 0 — Prep (branch, `.gitattributes`) | ✅ done |
| 1 — Scaffold `mobile/` + deps + `app.json` + `.env` | ✅ done (`expo-doctor` 21/21) |
| 2 — Auth (Amplify RN + Authenticator + token plumbing) | ⬜ next |
| 3 — Navigation shell + theme system | ⬜ |
| 4 — Shared API/types layer + react-query hooks | ⬜ |
| 5 — Screen migration (list → detail → cookbooks → add → wizard → settings) | ⬜ |
| 6 — Image capture/upload (`expo-image-picker`) | ⬜ |
| 7 — Polish (loading/error UI, fonts, icons, splash, tests) | ⬜ |
| 8 — EAS build + internal distribution | ⬜ |
| 9 — Delete `client/`, update `README.md` | ⬜ |

## Architecture decisions

| Concern | Web today | Mobile approach |
|---|---|---|
| Framework | Vite SPA | Expo SDK 57, TypeScript, **development build** (not Expo Go — Amplify needs native polyfill modules) |
| Routing | `react-router-dom` v6 | **Expo Router** (file-based), already scaffolded |
| Auth | `aws-amplify` v6 + `@aws-amplify/ui-react` `<Authenticator>` | `aws-amplify` v6 (core unchanged) + `@aws-amplify/ui-react-native` `<Authenticator>` + `@aws-amplify/react-native` polyfills |
| Token storage | Amplify → `localStorage` | Amplify → `@react-native-async-storage/async-storage` (automatic once polyfills load) |
| Env vars | `import.meta.env.VITE_*` | `process.env.EXPO_PUBLIC_*` (see `mobile/.env.example`) |
| Data fetching | ad-hoc `useEffect` + `useState(data/isLoading/isError)` triad | **`@tanstack/react-query`** hooks in `mobile/src/queries/` |
| Styling / theme | 10 hand-written `.css` files, CSS vars on `:root` / `[data-theme=light]` | JS theme-token object (dark + light) + `ThemeContext`; styles via `StyleSheet.create` factories taking `theme`. `applyTheme()` (DOM) is deleted. |
| Icons | `<img src="/icons/{name}-{dark\|light}.svg">` | `@expo/vector-icons` for generic icons; brand assets (`logo`, `chewie`) as bundled `require()`s via an explicit static map (Metro can't do dynamic `require`) |
| Images | `<input type=file>` + canvas resize (`blueimp-load-image`) | `expo-image-picker` → RN `FormData` `{ uri, name, type }`; server `sharp` already resizes/rotates. `expo-image` for display. |
| Lists | `.map()` into a flex grid | `FlatList` |
| External links | `<a target="_blank">` | `Linking.openURL` / `expo-web-browser` |
| Alerts/errors | `alert()`, some `console.log` | `Alert.alert`, react-query error states, a real loading spinner |
| Doc title | `document.title = ...` | Expo Router `<Stack.Screen options={{ title }}>` (native header) |
| Fonts | Google Fonts `@import` in CSS | `@expo-google-fonts/roboto` + `expo-font` |
| Deploy | Amplify Hosting (`amplify.yml`) | **EAS Build + EAS Submit**; TestFlight / Play internal testing |

## Code reuse — port with minimal edits

- `client/lib/api.ts` → `mobile/src/lib/api.ts`. **Pure `fetch` — portable as-is.** Only change:
  `import.meta.env.VITE_API_URI` → `process.env.EXPO_PUBLIC_API_URI`. `authHeaders()`
  (`fetchAuthSession()` from `aws-amplify/auth`) works unchanged on RN.
  While here: add the missing `res.ok` check in `addRecipeByUrl`, and add `updateCookbookById`
  (server `PUT /v1/cookbooks/:id` exists but has no client caller).
- `client/lib/preferences.ts` → `mobile/src/lib/preferences.ts`. Keep `getPreferences` /
  `updatePreferences`; **delete `applyTheme`** (DOM-only).
- `client/@customTypes/RecipeTypes.tsx`, `CookbookTypes.tsx` → `mobile/src/types/*.ts` (verbatim; `.tsx`→`.ts`).
- Wizard **logic** (`client/src/components/recipe-wizard/`) — step orchestration, immutable update
  helpers, `TIME_OPTIONS`/`COURSES` generators, `makeEmptyRecipe` — ports directly; only JSX
  primitives change (`<input>`→`<TextInput>`, `<select>`→picker).

## Full rewrite — browser-coupled

- `client/lib/storage.ts` → `mobile/src/lib/image.ts` (canvas/File/`blueimp-load-image` → `expo-image-picker`).
- `client/src/components/ImageUpload.tsx` → RN component, **same prop contract** (`{ currentUrl, alt, className?, onUpload }`).
- `client/src/layouts/new_navbar/Navbar.tsx` → native tab bar / drawer; `window.innerWidth` → `useWindowDimensions()` (or dropped).
- All `.css` → theme tokens + `StyleSheet`.

## Dead code — do NOT port

- `client/src/components/recipe-edit/` — entire folder is unused (`EditRecipe` renders `RecipeWizard`). Drop it and the `react-contenteditable` dep.
- `client/vite.config.ts` legacy `REACT_APP_API_URI` define — unused.
- `client/public/_redirects`, `client/index.html`, `amplify.yml` — web hosting only.

## Route → screen mapping (Expo Router files under `mobile/src/app/`)

| Web route (`client/src/App.tsx`) | Expo Router file | Notes |
|---|---|---|
| root providers | `src/app/_layout.tsx` | `Amplify.configure`, `Authenticator`, `ThemeProvider`, `QueryClientProvider` |
| `/` and `/recipes` → `<Recipes/>` | `src/app/(tabs)/index.tsx` | `FlatList` of `RecipeTile` |
| `/recipes/:id` → `<Recipe/>` | `src/app/recipes/[id].tsx` | fix stale-closure: effect dep on `id` |
| `/recipes/add?cookbook=` → `<AddRecipe/>` | `src/app/recipes/add.tsx` | `useLocalSearchParams()` for `cookbook`; URL-form + "manual" chooser |
| `/recipes/edit/:id` → `<EditRecipe/>` | `src/app/recipes/edit/[id].tsx` | loads recipe, renders wizard `mode="edit"` |
| `/cookbooks` → `<Cookbooks/>` | `src/app/(tabs)/cookbooks.tsx` | list + inline create form |
| `/cookbooks/:id` → `<CookbookDetail/>` | `src/app/cookbooks/[id].tsx` | recipe grid for a cookbook |
| `/settings` → `<Settings/>` | `src/app/(tabs)/settings.tsx` | theme toggle → `updatePreferences` |
| `/about` → `<About/>` | `src/app/about.tsx` | placeholder |
| (no 404) | `src/app/+not-found.tsx` | new |

`AddRecipeModal` (nav "+" button) → a modal route (`presentation: "modal"`) or a bottom sheet.
`useNavigate`/`Link`/`<Navigate>` → `useRouter().push/replace/back` + `<Link>` from `expo-router`. `navigate(-1)` → `router.back()`.

## Server API surface (unchanged — for reference)

Base `/v1`, every route requires `Authorization: Bearer <cognito access token>` (`server/middleware/auth.js`, `aws-jwt-verify`, `token_use: "access"`, `req.userId = payload.sub`).

| Method | Path | Notes |
|---|---|---|
| GET | `/v1/recipes` | query `limit`, `cookbookId` (the `filter` param the client sends is ignored server-side) |
| POST | `/v1/recipes` | body `{ method: "url" \| "manual", ... }`; returns bare `_id` string |
| GET | `/v1/recipes/:id` | full recipe (supports ad-hoc `/:id/*&path` field projection) |
| PUT | `/v1/recipes/:id` | body `{ method, recipe }` |
| DELETE | `/v1/recipes/:id` | |
| GET | `/v1/cookbooks` | array + computed `recipeCount` |
| POST | `/v1/cookbooks` | body `{ name, description?, coverImageUrl? }` |
| GET | `/v1/cookbooks/:id` | cookbook + its `recipes[]` |
| PUT | `/v1/cookbooks/:id` | exists; **no client caller yet** |
| DELETE | `/v1/cookbooks/:id` | |
| POST | `/v1/upload/image` | `multipart/form-data`, field `image`; server `sharp` rotate+resize→JPEG→S3; returns `{ imageUrl }` |
| GET / PUT | `/v1/preferences` | `{ theme: "dark" \| "light" }`, upsert by `userId` |

Response shapes are inconsistent (bare JSON strings for IDs, `Error` vs `error` keys). Normalising the API is an **optional follow-up, out of scope** for this migration.

Undocumented server env actually required: `DB_RECIPE_COLLECTION`, `DB_TAG_COLLECTION` (`server/models/recipe.js`), plus `AWS_REGION`, `S3_BUCKET_NAME`.

Client/server type drift to watch when porting: client `course` vs server `courses[]`; client `notes` vs server `tips`; client `*TimeUnit` vs server misspelled `*TiemUnit`. Server stores loosely (`new RecipeModel(json)`), unknown keys dropped.

## Phase details

### Phase 2 — Auth
- `mobile/src/app/_layout.tsx`: import `react-native-get-random-values` and
  `react-native-url-polyfill/auto` at the very top, then
  `Amplify.configure({ Auth: { Cognito: { userPoolId: process.env.EXPO_PUBLIC_COGNITO_USER_POOL_ID, userPoolClientId: process.env.EXPO_PUBLIC_COGNITO_APP_CLIENT_ID } } })`
  (mirrors `client/src/main.tsx:7`).
- Wrap the router in `<Authenticator.Provider>` + `<Authenticator hideSignUp Components={...}>` from
  `@aws-amplify/ui-react-native`; relabel username → "Email" (mirrors `authFormFields` in `client/src/App.tsx:20`).
- Port `authHeaders()` unchanged; sign-out via `useAuthenticator()` (mirrors `Navbar.tsx:43`).
- **Verify:** build a dev client (`npx expo run:ios` / `run:android`), sign in as a real Cognito
  user, confirm `fetchAuthSession()` returns a token and `GET /v1/preferences` succeeds.

### Phase 3 — Navigation shell + theme
- `(tabs)` navigator: Recipes / Cookbooks / Settings + a header/FAB "+" for add-recipe. Replaces
  `Layout.tsx` + `Navbar.tsx` (desktop tooltips and the `window.innerWidth < 769` split disappear).
- `mobile/src/theme/`: `tokens.ts` (transcribe the 21 vars from `client/src/css/globals.css`
  `:root`/`[data-theme=light]` + the 8 navbar vars from `navbar.css` into `{ dark, light }`),
  `ThemeContext.tsx` (`{ theme, tokens, setTheme }`, default `dark`), `useTheme()`, `useThemedStyles(factory)`.
- Theme load on mount: `getPreferences()` → `setTheme(prefs.theme)` (mirrors `client/src/App.tsx:32`),
  no DOM call. Feed tokens into React Navigation's `ThemeProvider` too.
- Fonts: load Roboto weights 300/500/700/900 via `useFonts`, gate render on `fontsLoaded`.
- Icons: `mobile/assets/icons/` for `logo`/`chewie` (+ light/dark) via a static `require` map;
  generic actions → `@expo/vector-icons`.
- Delete the template demo files (`explore.tsx`, `animated-icon*`, `web-badge`, `hint-row`,
  `tutorial-*`, `constants/theme.ts` CSS import) — they cause the only 2 `tsc` errors currently.

### Phase 4 — Shared API/types layer
- Copy `api.ts` / `preferences.ts` / types into `mobile/src/`; swap env accessor; apply the two API fixes.
- `QueryClient` in `_layout.tsx`. Hooks in `mobile/src/queries/`: `useRecipes`, `useRecipe(id)`,
  `useCookbooks`, `useCookbook(id)`, `usePreferences` + mutations `useCreateRecipe`, `useUpdateRecipe`,
  `useDeleteRecipe`, `useCreateCookbook`, `useDeleteCookbook`, `useUpdatePreferences`. These replace
  every `useEffect` fetch triad.

### Phase 5 — Screens (one PR each, checked on device), in dependency order
1. **Recipe list** (`(tabs)/index.tsx` + `RecipeTile`) — `FlatList`, `expo-image` thumbnails,
   pull-to-refresh, real empty/loading/error UI (`client`'s `Loading.tsx` renders nothing).
2. **Recipe detail** (`recipes/[id].tsx` + `components/recipe/*`). Ingredient links
   (`https://giantfood.com/...`) + source link → `Linking.openURL`. Delete → `Alert.alert` confirm.
   "Duplicate" still stubbed.
3. **Cookbooks list** + inline create form.
4. **Cookbook detail** — recipe grid + "add recipe to this cookbook".
5. **Add recipe** — cookbook-required gate, "Add by URL" vs "Add manually" chooser.
6. **Recipe wizard** (5 steps) — port `RecipeWizard` container (`step`/`recipe`/`saving` state,
   `updateField`, `goTo`/`next`/`back`, `save` for create+edit). `<select>` → `@react-native-picker/picker`
   or a sheet. `window.scrollTo` → `ScrollView` ref. Wire `edit/[id].tsx` with `mode="edit"`.
7. **Settings** — Dark/Light → `useUpdatePreferences` + `setTheme`. Show `version` from `mobile/package.json`.
8. **About** + **`+not-found`**.

### Phase 6 — Image capture/upload
- `mobile/src/lib/image.ts`: `pickImage()` wrapping `expo-image-picker` (camera + library, permissions,
  `quality`), returns `{ uri, name, type }`. `uploadImage(asset)` → `FormData.append('image', { uri, name, type })`
  → `POST ${EXPO_PUBLIC_API_URI}/upload/image` with `authHeaders()` only (no `Content-Type` — RN sets the
  boundary). Parse `{ imageUrl }`. Server `sharp` handles HEIC/resize/rotate.
- `ImageUpload.tsx` RN version: `expo-image` preview, tap → action sheet (Camera / Library) →
  `pickImage` → `uploadImage` → `onUpload(url)`; spinner while uploading; `Alert` on failure.
- Permission strings already in `app.json` (`expo-image-picker` plugin).
- **Verify on a physical device:** add a cover photo + a per-step photo from the camera; confirm the S3 URL renders back.

### Phase 7 — Polish
- Splash + app icon (adaptive for Android) from `logo.png`.
- Query error boundaries + retry buttons. Safe-area + keyboard avoidance in wizard forms.
- Tests (repo has **zero**): `jest-expo` + `@testing-library/react-native` — cover `api.ts`,
  theme resolution, `makeEmptyRecipe`, wizard step navigation.

### Phase 8 — Ship
- `mobile/eas.json`: `development` (dev client), `preview` (internal distribution), `production`.
- `eas build` iOS + Android → TestFlight / Play internal testing (family is invite-only anyway).
- `eas submit` once store listings exist.

### Phase 9 — Cleanup
- Delete `client/`. Remove `amplify.yml`.
- Update root `README.md`: replace the "Client" section with the Expo app, its env vars, EAS commands, the route→screen table.
- Bump `mobile/package.json` version; tag release.

## End-to-end parity checklist (run before deleting `client/`)

1. List recipes, open one, open an ingredient link.
2. Add a recipe by URL into a cookbook.
3. Create a recipe through all 5 wizard steps, with a cover photo + one step photo from the camera; verify it saves and renders.
4. Edit that recipe via the wizard; verify changes persist.
5. Create a cookbook, add a recipe to it, view cookbook detail, delete the cookbook.
6. Toggle theme in Settings; kill and relaunch; confirm the theme persisted (server round-trip).
7. Delete a recipe with the confirm dialog.
8. `eas build --profile preview` produces installable iOS + Android artifacts.
