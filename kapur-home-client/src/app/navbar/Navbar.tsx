import Link from "next/link";
import { Url } from "next/dist/shared/lib/router/router";
import "./navbar.css";

import { Inter } from "next/font/google";

const Navbar = () => {
  const recipeSubMenus = [
    {
      href: "/recipes/add",
      children: "Add",
    },
  ];

  return (
    <nav className="navbar">
      <NavButton href={"/"} className="navbar__nav_button--first">
        <img src="/chewie-outline.png" alt="Chewbarka" className="navbar__nav_buton__img"></img>
      </NavButton>
      <NavDropdown href={"/recipes"} subMenus={recipeSubMenus}>
        Cookbook
      </NavDropdown>
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

type NavDropdownProps = {
  href: Url;
  subMenus: Array<NavButtonProps>;
  children: React.ReactNode;
};

const NavDropdown = ({ href, subMenus, children }: NavDropdownProps) => {
  const subMenuComponents = subMenus.map((menus) => <NavButton href={menus.href}>{menus.children}</NavButton>);

  return (
    <>
      <NavButton href={href}>{children}</NavButton>
      <ul>{subMenuComponents}</ul>
    </>
  );
};

const SearchBar = () => {
  return <input type="search" name="search" id="search" className="navbar__search_bar" />;
};

export default Navbar;
