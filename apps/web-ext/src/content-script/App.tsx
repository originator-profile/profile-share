import { useState, Fragment } from "react";
import { useMount, useEvent } from "react-use";
import { Dialog, Transition } from "@headlessui/react";
import { IFramePostMessageEvent } from "../types/message";
import DpMap from "../components/DpMap";
import DpArea from "../components/DpArea";
import { ProfileSet, DocumentProfile } from "@originator-profile/ui";

function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [profiles, setProfiles] = useState<ProfileSet>(new ProfileSet([]));
  const [activeDp, setActiveDp] = useState<DocumentProfile | null>(null);

  function closeModal() {
    setIsOpen(false);
  }

  function handleMessage(event: IFramePostMessageEvent) {
    if (event.origin !== window.parent.location.origin) return;
    let profileSet, dp, websiteProfiles;
    switch (event.data.type) {
      case "enter-overlay":
        profileSet = ProfileSet.deserialize(
          event.data.profiles,
          websiteProfiles,
        );

        dp =
          event.data.activeDp &&
          DocumentProfile.deserialize(
            event.data.activeDp.profile,
            event.data.activeDp.metadata,
          );
        setProfiles(profileSet);
        setActiveDp(dp);
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
    window.parent.postMessage({ type: "leave-overlay" });
  }

  async function handleClickDp(dp: DocumentProfile) {
    setActiveDp(dp);
    window.parent.postMessage({
      type: "select-overlay-dp",
      dp: dp.serialize(),
    });
  }

  return (
    // gh-907: Dialog内では `<details><summary /></details>` がうまく動作しない可能性があるので注意
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
          <DpArea dps={profiles.dps} />
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
