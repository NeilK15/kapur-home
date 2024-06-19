import { Link } from "react-router-dom";

import "./navbar.css";

const Navbar = () => {
    const recipeSubMenus = [
        {
            key: "2a",
            href: "/recipes/add",
            children: "Add",
        },
    ];

    return (
        <nav>
            <ul className="navbar">
                <NavButton key={1} href={"/"} className="navbar__nav_button--first">
                    <img src="/chewie-outline.png" alt="Chewbarka" className="navbar__nav_buton__img"></img>
                </NavButton>
                <NavDropdown key={2} href={"/recipes"} subMenus={recipeSubMenus}>
                    Cookbook
                </NavDropdown>
                <NavButton key={3} href={"/about"}>
                    About
                </NavButton>
                <SearchBar />
            </ul>
        </nav>
    );
};

type NavButtonProps = {
    key?: string | number;
    href: string;
    className?: string;
    children: React.ReactNode;
};

const NavButton = ({ key = -1, href, className = "", children }: NavButtonProps) => {
    return (
        <>
            {key !== -1 ? (
                <li className="navbar__item" key={key}>
                    <Link to={href} className={`navbar__nav_button ${className}`}>
                        {children}
                    </Link>
                </li>
            ) : (
                <Link to={href} className={`navbar__nav_button ${className}`}>
                    {children}
                </Link>
            )}
        </>
    );
};

type NavDropdownProps = {
    key: string | number;
    href: string;
    subMenus: Array<NavButtonProps>;
    children: React.ReactNode;
};

const NavDropdown = ({ key, href, subMenus, children }: NavDropdownProps) => {
    const subMenuComponents = subMenus.map((menus) => (
        <NavButton key={menus.key} href={menus.href} className="dropdown__item">
            {menus.children}
        </NavButton>
    ));

    return (
        <li key={key} className="navbar__dropdown navbar__item">
            <NavButton href={href}>{children}</NavButton>
            <ul className="dropdown__items">{subMenuComponents}</ul>
        </li>
    );
};

const SearchBar = () => {
    return (
        <li key={10} className="navbar__search_item">
            <input type="search" name="search" id="search" className="navbar__search_bar" autoComplete="off" />
            <input type="submit" value="Search" className="search_bar__suffix" />
        </li>
    );
};

export default Navbar;
