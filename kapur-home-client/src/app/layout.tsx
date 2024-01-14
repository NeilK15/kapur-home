import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "./navbar/Navbar";
import "./index.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className + " " + "layout"}>
                <Navbar />
                <main className="main">{children}</main>
            </body>
        </html>
    );
}
