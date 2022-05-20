import { Icon } from "@iconify/react";
import Placeholder from "./Placeholder";

type Props = {
  children: React.ReactNode;
};

function ErrorPlaceholder({ children }: Props) {
  return (
    <Placeholder>
      <Icon className="text-5xl" icon="bx:error-circle" />
      {children}
    </Placeholder>
  );
}

export default ErrorPlaceholder;
