import Layout from "./layouts/Layout";
import { Routes, Route } from "react-router-dom";
import Recipes from "./pages/Recipes";
import Recipe from "./pages/Recipe";
import About from "./pages/About";
import AddRecipe from "./pages/AddRecipe";
import EditRecipe from "./pages/EditRecipe";
import Cookbooks from "./pages/Cookbooks";
import CookbookDetail from "./pages/CookbookDetail";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import "./css/globals.css";

const authFormFields = {
    signIn: {
        username: {
            label: "Email",
            placeholder: "Enter your email address",
        },
    },
};

function App() {
    return (
        <Authenticator formFields={authFormFields} hideSignUp>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Recipes />} />
                    <Route path="recipes" element={<Recipes />} />
                    <Route path="recipes/add" element={<AddRecipe />} />
                    <Route path="recipes/:id" element={<Recipe />} />
                    <Route path="recipes/edit/:id" element={<EditRecipe />} />
                    <Route path="cookbooks" element={<Cookbooks />} />
                    <Route path="cookbooks/:id" element={<CookbookDetail />} />
                    <Route path="about" element={<About />} />
                </Route>
            </Routes>
        </Authenticator>
    );
}

export default App;
