import browser from "webextension-polyfill";
import { MessageRequest, MessageResponse } from "../types/message";
import { useLifecycles } from "react-use";

function App() {
  function handleMessageResponse(
    message: MessageRequest
  ): Promise<MessageResponse> {
    switch (message.type) {
      case "fetch-profiles":
        return Promise.resolve({
          type: "fetch-profiles",
          targetOrigin: document.location.origin,
          profilesLink:
            document
              .querySelector(
                'link[rel="alternate"][type="application/ld+json"]'
              )
              ?.getAttribute("href") ?? null,
        });
      case "focus-profile":
        // TODO: プロファイルのオーバーレイ表示
        return Promise.resolve({
          type: "focus-profile",
        });
    }
  }
  useLifecycles(
    () => browser.runtime.onMessage.addListener(handleMessageResponse),
    () => browser.runtime.onMessage.removeListener(handleMessageResponse)
  );
  return <div />;
}

export default App;
