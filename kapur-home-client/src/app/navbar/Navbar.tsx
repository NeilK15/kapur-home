"use client";

import Link from "next/link";
import { Url } from "next/dist/shared/lib/router/router";
import "./navbar.css";

import { Inter } from "next/font/google";

const Navbar = () => {
    return (
        <nav className="navbar">
            <ul className="navbar__list">
                <NavButton key={1} href={"/"} icon="/chewie-outline.png">
                    Home
                </NavButton>
                <NavButton key={2} href={"/recipes"} icon="/icons/dark/clock_1.png">
                    Cookbook
                </NavButton>
                <NavButton key={3} href={"/chat"} icon="/icons/dark/messages_1.png">
                    Chat
                </NavButton>
                <NavButton key={4} href={"/about"} icon="/icons/dark/info_1.png">
                    About
                </NavButton>
            </ul>
        </nav>
    );
};

type NavButtonProps = {
    key: number;
    href: Url;
    className?: string;
    icon?: string;
    children: string;
};

const NavButton = ({ key, href, className = "", icon = undefined, children }: NavButtonProps) => {
    return (
        <li className="navbar__item" key={key}>
            <Link href={href} className={`nav_button__link ${className}`}>
                <img src={icon} alt={children} className="nav_button__img" />
            </Link>
        </li>
    );
};

export default Navbar;
