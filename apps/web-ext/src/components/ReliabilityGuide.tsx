import clsx from "clsx";
import { Modal, useModal } from "@originator-profile/ui";
import { Icon } from "@iconify/react";

type Props = {
  className?: string;
  contentType: string;
};

export default function ReliabilityGuide(props: Props) {
  const reliabilityModal = useModal();
  return (
    <div className={clsx("text-center space-y-1", props.className)}>
      <p className="text-base font-bold text-primary-800">
        {`この${props.contentType}の${props.contentType === "サイト" ? "運営者" : "発行者"}には信頼性情報があります`}
      </p>
      <button
        className="text-xs text-primary-700 px-3 py-2 inline-flex items-center gap-1 hover:bg-primary-100 rounded-full"
        onClick={reliabilityModal.onOpen}
      >
        <Icon className="inline w-3 h-3 mr-1" icon="material-symbols:help" />
        信頼性情報について
      </button>
      <Modal open={reliabilityModal.open} onClose={reliabilityModal.onClose}>
        <section className="jumpu-card p-5 rounded-2xl rounded-b-none space-y-3">
          <h2 className="text-base font-bold mb-1.5">信頼性情報について</h2>
          <p className="text-sm text-gray-600">
            この組織と組織が保有する資格の実在性は OP
            レジストリ運用者によって確認済みです。組織の信頼性の判断に資するものとして組織の基本情報と資格情報を閲覧することができます。
          </p>
        </section>
      </Modal>
    </div>
  );
}
