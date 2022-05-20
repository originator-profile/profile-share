import Placeholder from "./Placeholder";
import Spinner from "./Spinner";

type Props = {
  children: React.ReactNode;
};

function LoadingPlaceholder({ children }: Props) {
  return (
    <Placeholder>
      <Spinner />
      {children}
    </Placeholder>
  );
}

export default LoadingPlaceholder;
