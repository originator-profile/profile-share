import { ProjectTitle, ProjectSummary } from "@originator-profile/ui";
import figUser1Url from "../assets/fig-user-1.svg";
import figUser2Url from "../assets/fig-user-2.svg";
import figUser3Url from "../assets/fig-user-3.svg";
import figUser4Url from "../assets/fig-user-4.svg";
import figUser5Url from "../assets/fig-user-5.svg";
import figTraceabilityUrl from "../assets/fig-traceability.png";
import {
  ProfileGenericError,
  ProfilesVerifyFailed,
} from "@originator-profile/verify";
import { _, useSanitizedHtml } from "@originator-profile/ui/src/utils";
import { getProfileErrorMessage } from "../utils/get-profile-error-message";

function Messages({ className, error }: { className?: string; error: Error }) {
  if (error instanceof ProfilesVerifyFailed) {
    return (
      <ul className={className}>
        <li>{_("Unsupported_NonconformingDescription")}</li>
        <li>{_("Unsupported_MissingReliability")}</li>
        <li>{_("Unsupported_MissingDistributionChannel")}</li>
      </ul>
    );
  }
  return (
    <ul className={className}>
      <li>{_("Unsupported_NoReliabilityInformationYet")}</li>
      <li>{_("Unsupported_ReliabilityInformationRetrievalFailed")}</li>
    </ul>
  );
}

type Props = {
  error: Error;
};

function Unsupported({ error }: Props) {
  const disclaimerHtml =
    useSanitizedHtml(_("Unsupported_OPDisclaimer_HTML")) ?? "";
  return (
    <main className="fixed top-0 left-0 z-10 bg-white w-screen h-screen overflow-y-auto px-4 py-12">
      <ProjectTitle className="mb-12" as="header" />
      <article className="mb-12 max-w-sm mx-auto">
        <h1 className="whitespace-pre-line text-lg mb-6 text-center">
          {_("Unsupported_ReliabilityInformationReadError")}
        </h1>
        <p className="whitespace-pre-line text-xs text-gray-700 text-center mb-8">
          {_("Unsupported_FollowingCausesConsidered")}
        </p>
        <Messages
          className="list-disc pl-8 text-sm mb-12 max-w-sm mx-auto"
          error={error}
        />
        <details className="text-gray-700 pl-4 mb-12">
          <summary>{_("Unsupported_ErrorDetails")}</summary>
          <dl>
            <dt>
              {_("Unsupported_Message")}
              <span aria-hidden>:</span>
            </dt>
            <dd>{getProfileErrorMessage(error)}</dd>
            {error instanceof ProfileGenericError && (
              <>
                <dt>
                  {_("Unsupported_ErrorCode")}
                  <span aria-hidden>:</span>
                </dt>
                <dd>{error.code}</dd>
              </>
            )}
          </dl>
        </details>
        <p className="whitespace-pre-line text-xs text-gray-700 text-center leading-5">
          {_("Unsupported_ReliabilityInformationContactStatement")}
        </p>
      </article>
      <article className="prose max-w-lg mx-auto">
        <h1 className="whitespace-pre-line text-lg mb-6 text-center font-normal">
          {_("Unsupported_ReliabilityResolvesFollowings")}
        </h1>
        <section>
          <h2 className="whitespace-pre-line after:content-[''] after:block after:absolute after:bg-sky-500 after:opacity-30 after:w-32 after:h-1 after:mt-1">
            {_("Unsupported_ChallengeInternetUser")}
          </h2>
          <div className="flex items-center justify-between gap-8 mb-4 md:mb-1">
            <img className="flex-shrink-0 my-0" src={figUser1Url} alt="" />
            <p className="whitespace-pre-line text-sky-700 text-lg font-bold p-4 border-2 border-sky-600 rounded-3xl flex-grow">
              {_("Unsupported_ChallengeReliableInformation")}
            </p>
          </div>
          <div className="flex flex-row-reverse items-center justify-between gap-8 mb-4 md:mb-1">
            <img className="flex-shrink-0 my-0" src={figUser2Url} alt="" />
            <p className="whitespace-pre-line text-sky-700 text-lg font-bold p-4 border-2 border-sky-600 rounded-3xl flex-grow">
              {_("Unsupported_ChallengeFakeNews")}
            </p>
          </div>
          <p className="whitespace-pre-line">
            {_("Unsupported_ChallengeReliabilityProblemAndSolutionStatement")}
          </p>
        </section>
        <section>
          <h2 className="whitespace-pre-line after:content-[''] after:block after:absolute after:bg-sky-500 after:opacity-30 after:w-32 after:h-1 after:mt-1">
            {_("Unsupported_ChallengeAdAndMedia")}
          </h2>
          <div className="flex items-center justify-between gap-8 mb-4 md:mb-1">
            <img className="flex-shrink-0 my-0" src={figUser5Url} alt="" />
            <p className="whitespace-pre-line text-sky-700 text-lg font-bold p-4 border-2 border-sky-600 rounded-3xl flex-grow">
              {_("Unsupported_ChallengeSketchySite")}
            </p>
          </div>
          <div className="flex flex-row-reverse items-center justify-between gap-8 mb-4 md:mb-1">
            <img className="flex-shrink-0 my-0" src={figUser3Url} alt="" />
            <p className="whitespace-pre-line text-sky-700 text-lg font-bold p-4 border-2 border-sky-600 rounded-3xl flex-grow">
              {_("Unsupported_ChallengeAdClashWithArticle")}
            </p>
          </div>
          <p className="whitespace-pre-line">
            {_("Unsupported_ChallengeAdRiskAndSolutionStatement")}
          </p>
        </section>
        <section className="mb-12">
          <h2 className="whitespace-pre-line after:content-[''] after:block after:absolute after:bg-sky-500 after:opacity-30 after:w-32 after:h-1 after:mt-1">
            {_("Unsupported_ChallengeHowever")}
          </h2>
          <div className="flex items-center justify-between gap-8 mb-4 md:mb-1">
            <img className="flex-shrink-0 my-0" src={figUser4Url} alt="" />
            <p className="whitespace-pre-line text-sky-700 text-lg font-bold p-4 border-2 border-sky-600 rounded-3xl flex-grow">
              {_("Unsupported_ChallengeInformationRegulation")}
            </p>
          </div>
          <p
            dangerouslySetInnerHTML={{
              __html: disclaimerHtml,
            }}
          />
        </section>
        <section className="mb-8">
          <h2 className="whitespace-pre-line text-lg mb-6 text-center font-normal">
            {_("Unsupported_ChallengeIfThereWereInformation")}
          </h2>
          <img
            className="mx-auto"
            src={figTraceabilityUrl}
            alt=""
            width={420}
            height={248}
          />
          <p className="whitespace-pre-line">
            {_("Unsupported_ChallengeReliabilityBenefits")}
          </p>
          <div className="flex justify-center">
            <a
              className="jumpu-button text-white"
              href="https://originator-profile.org/"
              target="_blank"
              rel="noreferrer noopener"
            >
              {_("Unsupported_MoreDetailsOP")}
            </a>
          </div>
        </section>
      </article>
      <ProjectSummary as="footer" />
    </main>
  );
}

export default Unsupported;
