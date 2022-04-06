import { InlineIcon } from "@iconify/react";
import { Disclosure } from "@headlessui/react";

function App(): React.ReactElement {
  return (
    <div className="p-4">
      <p css={{ letterSpacing: 2 }} className="mb-2">
        Hello World <InlineIcon icon="heroicons-solid:heart" />
      </p>
      <button className="mb-2 jumpu-button">ボタン</button>
      <Disclosure>
        <div className="jumpu-accordion">
          <Disclosure.Button>アコーディオン</Disclosure.Button>
          <Disclosure.Panel className="p-2">
            アコーディオンパネル
          </Disclosure.Panel>
        </div>
      </Disclosure>
    </div>
  );
}

export default App;
