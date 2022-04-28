import useOpDocumentsAtom from "../store/useOpsAtom";
import Spinner from "../components/Spinner";
import ProfileItem from "../components/ProfileItem";

function Holders(): React.ReactElement {
  const { ops } = useOpDocumentsAtom();
  if (!ops) return <Spinner />;
  return (
    <>
      {ops.map((op) => (
        <ProfileItem key={op.subject} op={op} variant="primary" />
      ))}
    </>
  );
}

export default Holders;
