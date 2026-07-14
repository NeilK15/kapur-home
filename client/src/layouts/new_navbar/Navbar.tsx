import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import AddRecipeModal from "../../components/AddRecipeModal";
import "./navbar.css";

type NavButtonRegProps = {
    onClick?: () => void;
    imgSrc: string;
    onHoverText?: string;
    clsName?: string;
    isMobile?: boolean;
};

const NavButtonReg = ({ onClick, imgSrc, onHoverText, clsName, isMobile }: NavButtonRegProps) => {
    const [isHovering, setIsHovering] = useState(false);

    return (
        <li className={`navbar__navitem ${clsName}`}>
            <button
                onClick={onClick}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="navitem__button"
            >
                <img className="navitem__img" src={imgSrc} alt={imgSrc} />
            </button>
            {onHoverText ? (
                isHovering && !isMobile ? (
                    <span className="navitem__tooltip tooltip--visible">{onHoverText}</span>
                ) : (
                    <span className="navitem__tooltip tooltip--hidden">{onHoverText}</span>
                )
            ) : (
                <></>
            )}
        </li>
    );
};

const Navbar = () => {
    const navigate = useNavigate();
    const { signOut } = useAuthenticator();

    const [isMobile, setIsMobile] = useState(window.innerWidth < 769);
    const [showHamburger, setShowHamburger] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 769);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const laptopView = (
        <nav className="navbar navbar--laptop">
            <ul className="navbar__list">
                <NavButtonReg
                    imgSrc="/icons/chewie-outline.png"
                    onHoverText="Home"
                    onClick={() => navigate("/")}
                    clsName="navitem--tooltip_left"
                    isMobile={false}
                />
                <li className="navbar__navitem"></li>
                <NavButtonReg
                    imgSrc="/icons/add.png"
                    onHoverText="Add Recipe"
                    onClick={() => setShowAddModal(true)}
                    clsName="navitem--first_right navitem--tooltip_right"
                    isMobile={false}
                />
                <NavButtonReg
                    imgSrc="/icons/books2.png"
                    onHoverText="Cookbooks"
                    onClick={() => navigate("/cookbooks")}
                    clsName="navitem--tooltip_right"
                    isMobile={false}
                />
                <NavButtonReg
                    imgSrc="/icons/exit.png"
                    onHoverText="Sign Out"
                    onClick={signOut}
                    clsName="navitem--tooltip_right"
                    isMobile={false}
                />
            </ul>
        </nav>
    );

    const mobileView = (
        <nav className="navbar navbar--mobile">
            <ul className="navbar__list">
                <NavButtonReg
                    imgSrc="/icons/home.png"
                    onClick={() => navigate("/")}
                    clsName="navitem--tooltip_left"
                    isMobile={true}
                />
                <NavButtonReg
                    imgSrc="/icons/add.png"
                    onClick={() => setShowAddModal(true)}
                    clsName="navitem--first_right"
                    isMobile={true}
                />
                <NavButtonReg imgSrc="/icons/hamburger.png" onClick={() => setShowHamburger(true)} isMobile={true} />
            </ul>
            {showHamburger && (
                <div className="navbar__modal">
                    <div className="navbar__modal__top">
                        <button className="navbar__modal__close" onClick={() => setShowHamburger(false)}>
                            <img src="/close.png" alt="Close" />
                        </button>
                    </div>
                    <ul className="navbar__modal__links">
                        <li>
                            <Link to="/" onClick={() => setShowHamburger(false)}>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/cookbooks" onClick={() => setShowHamburger(false)}>
                                Cookbooks
                            </Link>
                        </li>
                        <li>
                            <button onClick={signOut} className="navbar__modal__signout">
                                Sign Out
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );

    return (
        <>
            {isMobile ? mobileView : laptopView}
            {showAddModal && <AddRecipeModal onClose={() => setShowAddModal(false)} />}
        </>
    );
};

export default Navbar;
