import { Link } from "react-router-dom";

function Credential(): React.ReactElement {
  return (
    <>
      <h1>資格情報</h1>
      <ul>
        <li>
          <Link to="/holder">保有者の詳細</Link>
        </li>
      </ul>
    </>
  );
}

export default Credential;
