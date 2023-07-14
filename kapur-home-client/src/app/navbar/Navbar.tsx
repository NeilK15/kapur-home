import Link from "next/link";
import { Url } from "next/dist/shared/lib/router/router";
import "./navbar.css";

import { Inter } from "next/font/google";

const Navbar = () => {
  return (
    <nav className="navbar">
      <NavButton href={"/"} className="navbar__nav_button--first">
        <img src="/chewie-outline.png" alt="Chewbarka" className="navbar__nav_buton__img"></img>
      </NavButton>
      <NavButton href={"/recipes"}>Cookbook</NavButton>
      <NavButton href={"/chat"}>Chat</NavButton>
      <NavButton href={"/about"}>About</NavButton>

      <SearchBar />
    </nav>
  );
};

type NavButtonProps = {
  href: Url;
  className?: string;
  children: React.ReactNode;
};

const NavButton = ({ href, className = "navbar__nav_button", children }: NavButtonProps) => {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
};

const SearchBar = () => {
  return <input type="search" name="search" id="search" className="navbar__search_bar" />;
};

export default Navbar;
