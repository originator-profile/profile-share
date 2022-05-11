import useOpsAtom from "../store/useOpsAtom";
import Placeholder from "../components/Placeholder";
import Spinner from "../components/Spinner";
import ProfileItem from "../components/ProfileItem";

function Holders(): React.ReactElement {
  const { ops } = useOpsAtom();
  if (ops.length === 0) {
    return (
      <Placeholder>
        <Spinner />
      </Placeholder>
    );
  }
  return (
    <>
      {ops.map((op, index) => (
        <ProfileItem
          key={op.subject}
          op={op}
          variant={index === 0 ? "primary" : "secondary"}
        />
      ))}
    </>
  );
}

export default Holders;
