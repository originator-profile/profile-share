import { Link } from "react-router-dom";

function Holder(): React.ReactElement {
  return (
    <>
      <h1>保有者の詳細</h1>
      <ul>
        <li>
          <Link to="/">保有者の一覧</Link>
        </li>
        <li>
          <Link to="/credential">資格情報</Link>
        </li>
        <li>
          <Link to="/technical-information">技術情報</Link>
        </li>
      </ul>
    </>
  );
}

export default Holder;
