import { Link } from "react-router-dom";
import useOpAtom from "../store/useOpAtom";

function Holders(): React.ReactElement {
  const [op] = useOpAtom();
  return (
    <>
      <h1>保有者の一覧</h1>
      <ul>
        <li>
          <Link to="/holder">保有者の詳細</Link>
        </li>
      </ul>
      <p>{JSON.stringify(op)}</p>
    </>
  );
}

export default Holders;
