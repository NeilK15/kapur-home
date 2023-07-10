import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import RecipeView from "./pages/RecipeView.tsx";
import HomeView from "./pages/HomeView.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/recipes">
          <Route index element={<RecipeView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
