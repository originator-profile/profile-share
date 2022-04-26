import { Link } from "react-router-dom";
import useOpsAtom from "../store/useOpsAtom";

function Holders(): React.ReactElement {
  const [ops] = useOpsAtom();
  return (
    <>
      <h1>保有者の一覧</h1>
      <ul>
        <li>
          <Link to="/holder">保有者の詳細</Link>
        </li>
      </ul>
      <p>{JSON.stringify(ops)}</p>
    </>
  );
}

export default Holders;
