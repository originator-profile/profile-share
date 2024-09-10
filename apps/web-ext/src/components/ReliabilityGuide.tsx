import clsx from "clsx";
import { Modal, useModal } from "@originator-profile/ui";
import { Icon } from "@iconify/react";
import { _ } from "@originator-profile/ui/src/utils";

type Props = {
  className?: string;
  contentType: string;
};

export default function ReliabilityGuide(props: Props) {
  const reliabilityModal = useModal();
  return (
    <div className={clsx("text-center space-y-1", props.className)}>
      <p className="whitespace-pre-line text-base font-bold text-primary-800">
        {_(
          "ReliabilityGuide_HasReliabilityInformation",
          props.contentType === "ContentType_Site"
            ? _("ReliabilityGuide_SiteOperator")
            : _("ReliabilityGuide_Publisher", _(props.contentType)),
        )}
      </p>
      <button
        className="text-xs text-primary-700 px-3 py-2 inline-flex items-center gap-1 hover:bg-primary-100 rounded-full"
        onClick={reliabilityModal.onOpen}
      >
        <Icon className="inline w-3 h-3 mr-1" icon="material-symbols:help" />
        {_("ReliabilityGuide_AboutReliabilityInformation")}
      </button>
      <Modal open={reliabilityModal.open} onClose={reliabilityModal.onClose}>
        <section className="jumpu-card p-5 rounded-2xl rounded-b-none space-y-3">
          <h2 className="whitespace-pre-line text-base font-bold mb-1.5">
            {_("ReliabilityGuide_AboutReliabilityInformation")}
          </h2>
          <p className="whitespace-pre-line text-sm text-gray-600">
            {_("ReliabilityGuide_VerifiedOrganizationStatement")}
          </p>
        </section>
      </Modal>
    </div>
  );
}
