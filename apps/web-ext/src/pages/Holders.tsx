import { Link } from "react-router-dom";

function Holders(): React.ReactElement {
  return (
    <>
      <h1>保有者の一覧</h1>
      <ul>
        <li>
          <Link to="/holder">保有者の詳細</Link>
        </li>
      </ul>
    </>
  );
}

export default Holders;
