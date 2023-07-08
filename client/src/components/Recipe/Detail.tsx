type Props = {
  before?: "clock" | "person" | "utensils";
  title: string;
  children: string;
};

const Detail = (props: Props) => {
  return (
    <li className={`detail before_${props.before}`}>
      <span className="detail__title">{`${props.title}: `}</span>
      <span className="detail__content">{props.children}</span>
    </li>
  );
};

export default Detail;
