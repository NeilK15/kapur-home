"use client";

import Link from "next/link";
import "../css/circle.css";
import { MouseEventHandler, useEffect, useState, useRef, MutableRefObject } from "react";

type CircleMultiSelectorProps = {
    children: React.ReactNode;
    selectors: React.ReactNode[];
    offset?: number;
    startAngle?: number;
    endAngle?: number;
};

export const CircleMultiSelector = ({
    children,
    offset = 20,
    startAngle = 0,
    endAngle = 360,
    selectors,
}: CircleMultiSelectorProps) => {
    const [wheelOpen, setWheelOpen] = useState(false);

    const handleClick = () => {
        setWheelOpen(!wheelOpen);
    };

    const toRads = (degree: number) => {
        return (Math.PI / 180) * degree;
    };

    const pickers = selectors.map((value, index, array) => {
        const angleStep = (endAngle - startAngle) / (selectors.length - 1);

        const yVal = offset * Math.sin(toRads(startAngle + angleStep * index));
        const xVal = offset * Math.cos(toRads(startAngle + angleStep * index));

        const determinePosition = (width: number | undefined, height: number | undefined) => {
            const position = {
                bottom: 0,
                left: 0,
            };

            if (width && height) {
                if (xVal >= 0) {
                    position.left = xVal;
                } else if (xVal < 0) {
                    position.left = xVal - width;
                }

                if (yVal >= 0) {
                    position.bottom = yVal;
                } else if (yVal < 0) {
                    position.bottom = yVal - height;
                }
            }
            console.log(position);

            return position;
        };

        return <Picker determinePosition={determinePosition}>{value}</Picker>;
    });

    return (
        <div className="circle">
            <button className="circle__main_button" onClick={handleClick}>
                {children}
            </button>
            {wheelOpen && <ul className="circle__selectors">{pickers}</ul>}
        </div>
    );
};

type PickerProps = {
    children: React.ReactNode;
    determinePosition: (width: number | undefined, height: number | undefined) => { bottom: number; left: number };
};

export function Picker({ children, determinePosition }: PickerProps) {
    const elRef = useRef<HTMLLIElement>(null);

    useEffect(() => {
        setPosition(determinePosition(elRef.current?.clientWidth, elRef.current?.clientHeight));
    });

    const [position, setPosition] = useState({
        bottom: 0,
        left: -100,
    });

    return (
        <li
            className="selectors__selector"
            style={{
                left: `${position.left}px`,
                bottom: `${position.bottom}px`,
            }}
            ref={elRef}
        >
            <button>{children}</button>
        </li>
    );
}
