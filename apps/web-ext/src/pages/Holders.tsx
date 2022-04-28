import useOpDocumentsAtom from "../store/useOpsAtom";
import Spinner from "../components/Spinner";
import ProfileItem from "../components/ProfileItem";

function Holders(): React.ReactElement {
  const { ops } = useOpDocumentsAtom();
  if (!ops)
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );
  return (
    <>
      {ops.map((op) => (
        <ProfileItem key={op.subject} op={op} variant="primary" />
      ))}
    </>
  );
}

export default Holders;
