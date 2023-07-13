import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";

type Props = {
  href: Url;
  className?: string;
  children: React.ReactNode;
};

const NavButton = ({ href, className, children }: Props) => {
  return (
    <li className="mr-1">
      <Link href={href}>
        <button className="bg-cyan-300 hover:bg-cyan-200 p-3 text-black h-full">{children}</button>
      </Link>
    </li>
  );
};

export default NavButton;
