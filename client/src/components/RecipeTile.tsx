import { Link } from "react-router-dom";
import "../css/recipes-view.css";
import { useState, useEffect } from "react";

type RecipeTileProps = {
    id: string;
    title: string;
    imageUrl: string;
    details: {
        prepTime: number;
        prepTimeUnit: string;
        cookTime: number;
        cookTimeUnit: string;
        totalTime: number;
        totalTimeUnit: string;
        description: string;
    };
};

function RecipeTile({ id, title, imageUrl, details }: RecipeTileProps) {
    const [showsDetails, setShowsDetails] = useState(false);
    const detailsClassName = "recipe_tile--details";
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 769);
    const handleResize = () => setIsMobile(window.innerWidth <= 769);
    const [isValidImg, setIsValidImg] = useState(false);

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (!imageUrl) { setIsValidImg(false); return; }
        const img = new Image();
        img.onload = () => setIsValidImg(true);
        img.onerror = () => setIsValidImg(false);
        img.src = imageUrl;
    }, [imageUrl]);

    const imgStyle: React.CSSProperties = {
        backgroundImage: `url('${imageUrl}')`,
    };

    const backupImgStyle: React.CSSProperties = {
        backgroundColor: "#0d144f5b",
    };

    const handleMouseEnter = () => {
        setShowsDetails(true);
    };

    const handleMouseExit = () => {
        setShowsDetails(false);
    };

    const decideDetail = (time: number) => {
        const hrs = Math.floor(time / 60);
        const mins = time % 60;

        if (hrs > 0) {
            if (hrs > 1) {
                return `${hrs} hrs ${mins} mins`;
            }
            return `${hrs} hr ${mins} mins`;
        }
        return `${mins} mins`;
    };

    const renderedComputerDetails = (
        <>
            <div className="details__times">
                <div className="details__time details__time--prep_time">
                    Prep Time{" "}
                    <span className="time_value">
                        <span>{decideDetail(details.prepTime)}</span>
                    </span>
                </div>
                <div className="details__time details__time--cook_time">
                    Cook Time{" "}
                    <span className="time_value">
                        <span>{decideDetail(details.cookTime)}</span>
                    </span>
                </div>
                <div className="details__time details__time--total_time">
                    Total Time{" "}
                    <span className="time_value">
                        <span>{decideDetail(details.totalTime)}</span>
                    </span>
                </div>
            </div>
            {/* <hr /> */}
            <div className="details__description">
                <span>
                    {details.description.length <= 300
                        ? details.description
                        : `${details.description.slice(0, 300).trim()}...`}
                </span>
            </div>
        </>
    );

    const renderedMobileDetails = (
        <Link to={`/recipes/${id}`} className="recipe_tile--mobile">
            {isValidImg && <img src={imageUrl} alt={title} className="img--mobile" />}
            <span className="recipe_tile--mobile__title">{title}</span>
        </Link>
    );

    return isMobile ? (
        renderedMobileDetails
    ) : (
        <Link
            to={`/recipes/${id}`}
            style={isValidImg ? imgStyle : backupImgStyle}
            className={`recipe_tile ${showsDetails ? detailsClassName : ""}`} // Will show the details class name if showDetails state is true (on hover)
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseExit}
        >
            {!showsDetails && <h3 className="recipe_tile__title">{title}</h3>}
            {showsDetails && renderedComputerDetails}
        </Link>
    );
}

export default RecipeTile;
