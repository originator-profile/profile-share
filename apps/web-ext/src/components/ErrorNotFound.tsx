import { Dialog } from "@headlessui/react";

function ErrorNotFound() {
  const onClose = () => {
    // nop
  };
  return (
    <Dialog open onClose={onClose}>
      <Dialog.Panel className="fixed top-0 left-0 z-10 bg-white w-screen min-h-screen overflow-y-auto">
        {/* TODO: 不在と不正のケースの見た目を実装して */}
      </Dialog.Panel>
    </Dialog>
  );
}

export default ErrorNotFound;
