import React from "react";
import Navbar from "./new_navbar/Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <header>
                <Navbar />
            </header>
            <main>
                <Outlet />
            </main>
            <footer></footer>
        </>
    );
};

export default Layout;
