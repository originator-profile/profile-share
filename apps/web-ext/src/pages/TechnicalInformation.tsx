import { Link } from "react-router-dom";

function TechnicalInformation(): React.ReactElement {
  return (
    <>
      <h1>技術情報</h1>
      <ul>
        <li>
          <Link to="/holder">保有者の詳細</Link>
        </li>
      </ul>
    </>
  );
}

export default TechnicalInformation;
