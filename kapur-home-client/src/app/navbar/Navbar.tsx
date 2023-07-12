import NavButton from "./NavButton";

const Navbar = () => {
  return (
    <nav className="bg-slate-900">
      <ul className="list-none">
        <NavButton href={"/"}>
          <img src="/chewie-outline.png" alt="Chewbarka Tuteja Kapur" className="object-contain h-16"></img>
        </NavButton>
        <NavButton href={"/recipes"}>Recipes</NavButton>
      </ul>
    </nav>
  );
};

export default Navbar;
