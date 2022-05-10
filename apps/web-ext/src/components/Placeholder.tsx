type Props = {
  children: React.ReactNode;
};

function Placeholder({ children }: Props): React.ReactElement {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      {children}
    </div>
  );
}

export default Placeholder;
