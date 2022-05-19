type Props = {
  children: React.ReactNode;
};

function Placeholder({ children }: Props): React.ReactElement {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="p-2 flex flex-col items-center gap-4">{children}</div>
    </div>
  );
}

export default Placeholder;
