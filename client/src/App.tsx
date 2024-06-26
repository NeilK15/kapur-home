import Layout from "./layouts/Layout";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import Recipe from "./pages/Recipe";
import About from "./pages/About";
import AddRecipe from "./pages/AddRecipe";

import "./css/globals.css";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Recipes />} />
                    <Route path="recipes" element={<Recipes />} />
                    <Route path="recipes/add" element={<AddRecipe />} />
                    <Route path="recipes/:id" element={<Recipe />} />
                    <Route path="about" element={<About />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
