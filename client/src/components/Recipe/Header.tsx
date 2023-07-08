import "../../css/Recipe/recipe.css";

type Props = {
  children: string;
};

const Header = ({ children }: Props) => {
  return (
    <>
      <h3 className="header">{children}</h3>
      <hr />
    </>
  );
};

export default Header;
