import { useState, Fragment } from "react";
import { useMount, useEvent } from "react-use";
import { Dialog, Transition } from "@headlessui/react";
import { Profile, Dp } from "../types/profile";
import { IFramePostMessageEvent } from "../types/message";
import DpMap from "../components/DpMap";

function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeDp, setActiveDp] = useState<Dp | null>(null);

  function closeModal() {
    setIsOpen(false);
  }

  function handleMessage(event: IFramePostMessageEvent) {
    if (event.origin !== window.parent.location.origin) return;
    switch (event.data.type) {
      case "enter-overlay":
        setProfiles(event.data.profiles);
        setActiveDp(event.data.activeDp);
        break;
      case "leave-overlay":
        closeModal();
        break;
    }
  }

  useMount(() => {
    window.parent.postMessage({ type: "enter-overlay" });
  });
  useEvent("message", handleMessage);

  function handleLeave() {
    window.parent.postMessage(
      { type: "leave-overlay" },
      window.parent.location.origin
    );
  }

  async function handleClickDp(dp: Dp) {
    setActiveDp(dp);
    window.parent.postMessage({
      type: "select-overlay-dp",
      dp,
    });
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={handleLeave}
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel>
                <DpMap
                  profiles={profiles}
                  activeDp={activeDp}
                  onClickDp={handleClickDp}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default App;
