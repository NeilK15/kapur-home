import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";

type Props = {
  href: Url;
  className?: string;
  children: React.ReactNode;
};

const NavButton = ({ href, className, children }: Props) => {
  return (
    <li className="float-left inline mr-5">
      <Link href={href}>
        <button className="bg-cyan-400 hover:bg-cyan-600 p-3 text-black h-16">{children}</button>
      </Link>
    </li>
  );
};

export default NavButton;
