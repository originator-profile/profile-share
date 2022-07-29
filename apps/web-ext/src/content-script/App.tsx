import { useState, useRef, Fragment } from "react";
import { useLifecycles } from "react-use";
import { Dialog, Transition } from "@headlessui/react";
import { Profile } from "../types/profile";
import { IFramePostMessageEvent } from "../types/message";
import ProfileItem from "../components/ProfileItem";
import Spinner from "../components/Spinner";

function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const focusRef = useRef(null);

  function closeModal() {
    setIsOpen(false);
  }

  function handleMessage(event: IFramePostMessageEvent) {
    if (event.origin !== window.parent.location.origin) return;
    switch (event.data.type) {
      case "enter-overlay":
        setProfile(event.data.profile);
        break;
      case "leave-overlay":
        closeModal();
        break;
    }
  }

  useLifecycles(
    () => {
      window.addEventListener("message", handleMessage);
      window.parent.postMessage({ type: "enter-overlay" });
    },
    () => window.removeEventListener("message", handleMessage)
  );

  function handleLeave() {
    window.parent.postMessage(
      { type: "leave-overlay" },
      window.parent.location.origin
    );
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={closeModal}
        initialFocus={focusRef}
      >
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
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md bg-white rounded-xl p-6">
                <div ref={focusRef}>
                  {(profile && (
                    <ProfileItem
                      className="border-none"
                      variant="main"
                      as="div"
                      link={false}
                      profile={profile}
                    />
                  )) || <Spinner className="m-auto" />}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default App;
