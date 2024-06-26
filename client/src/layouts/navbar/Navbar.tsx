import { Link } from "react-router-dom";

import { useState, useEffect } from "react";

import "./navbar.css";

const Navbar = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 769);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 769);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const handleBarsIconClick = () => {
        toggleModal();
    };

    const navLinks = [
        {
            content: "Cookbook",
            href: "/recipes",
        },
        {
            content: "Add",
            href: "/recipes/add",
        },
        {
            content: "About",
            href: "/about",
        },
    ];

    const iconLinks = [{}];

    const recipeSubMenus = [
        {
            key: "2a",
            href: "/recipes/add",
            children: "Add",
        },
    ];

    const navCenter = (
        <ul className="navbar__list navbar__list--center">
            {navLinks.map((item, index) => (
                <NavButton key={index} href={item.href}>
                    {item.content}
                </NavButton>
            ))}
        </ul>
    );

    const navbar = (
        <>
            {!isMobile ? (
                // Laptop Navbar Code Here
                <nav className="navbar navbar--laptop">
                    <ul className="navbar__list navbar__list--left">
                        <NavButton key={1} href={"/"} className="navbar__nav_button--first">
                            <img src="/chewie-outline.png" alt="Chewbarka" className="navbar__nav_buton__img"></img>
                        </NavButton>
                    </ul>

                    {navCenter}

                    <ul className="navbar__list navbar__list--right">
                        <Search />
                    </ul>
                </nav>
            ) : (
                // Mobile Navbar Code Here

                <nav className="navbar navbar--mobile">
                    <ul className="navbar__list navbar__list--left">
                        <NavButton key={1} href="/">
                            <img src="/chewie-outline.png" alt="Chewbarka" className="navbar__nav_buton__img"></img>
                        </NavButton>
                    </ul>

                    <ul className="navbar__list navbar__list--right">
                        <Search />
                        <Hamburger onClick={handleBarsIconClick} />
                    </ul>
                    {showModal && (
                        <div className="modal">
                            <div className="modal__top">
                                <button onClick={toggleModal} className="modal__top__close_button">
                                    <img className="modal__top__close_button__img" src="/close.png"></img>
                                </button>
                            </div>
                            <div className="modal__bottom">
                                <ul className="modal__bottom__list">
                                    {navLinks.map((item, index) => (
                                        <li key={index} className="modal__bottom__list__item">
                                            <Link
                                                onClick={toggleModal}
                                                className="modal__bottom__list__item__link"
                                                to={item.href}
                                            >
                                                {item.content}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </nav>
            )}
        </>
    );

    return navbar;
};

type HamburgerProps = {
    onClick: () => void;
};

const Hamburger = ({ onClick }: HamburgerProps) => {
    return (
        <li className="navbar__list__item navbar__list__hamburger">
            <button className="navbar__list__hamburger__button" onClick={onClick}>
                <img className="navbar__list__hamburger__button__img" src="/hamburger.png"></img>
            </button>
        </li>
    );
};

type NavButtonProps = {
    key: string | number;
    href: string;
    className?: string;
    children: React.ReactNode;
};

const NavButton = ({ key = -1, href, className = "", children }: NavButtonProps) => {
    return (
        <li className="navbar__list__item" key={key}>
            <Link to={href} className={`navbar__list__item__button ${className}`}>
                {children}
            </Link>
        </li>
    );
};

const Search = () => {
    return (
        <li key={1} className="navbar__list__item navbar__list__search">
            <button className="navbar__list__item__button navbar__list__search__button">
                <img className="navbar__list__search__button__img" src="/search.png"></img>
            </button>
        </li>
    );
};

export default Navbar;
