import Image from "next/image";
import { Metadata } from "next";
import "./index.css";

export const metadata: Metadata = {
    title: "Kapur Home",
};

export default function Home() {
    return (
        <div>
            <h1>The home page is in progress yo!</h1>
            <img src="construction-work.gif"></img>
        </div>
    );
}
