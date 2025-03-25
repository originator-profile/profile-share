import { expect, test } from "vitest";
import { Advertiser, BidResponse } from "./types";
import { getAdvertiser, getBidResponses } from "./bidresponse";
import { Window } from "happy-dom";

test("advertiserが見つかる", () => {
  const template = {
    "@context": "https://originator-profile.org/context.jsonld",
    bidresponse: {
      bid: {
        op: [
          {
            type: "advertiser",
            id: "<広告主の OP ID>",
          },
        ],
      },
    },
  } satisfies BidResponse;

  expect(getAdvertiser(template)).toEqual({
    type: "advertiser",
    id: "<広告主の OP ID>",
  } satisfies Advertiser);
});

test.each([
  {
    "@context": "https://originator-profile.org/context.jsonld",
    bidresponse: {
      bid: {
        op: [{ type: "foo", id: "bar" }],
      },
    },
  },

  {
    "@context": "https://originator-profile.org/context.jsonld",
  },
  {},
])("advertiserが見つからないときnull", (template) => {
  expect(getAdvertiser(template as BidResponse)).toBe(null);
});

test("HTML内にadvertiserが見つかる", () => {
  const window = new Window();
  window.document.body.innerHTML = `
    <script type="application/ld+json">
    {
      "@context": "https://originator-profile.org/context.jsonld",
      "bidresponse": {
        "bid": {
          "op": [
            {
              "type": "advertiser",
              "id": "localhost"
            }
          ]
        }
      }
    }
    </script>
  `;

  const bids = getBidResponses(window.document as unknown as Document);
  expect(bids).toBeDefined();
  expect(Array.isArray(bids)).toBe(true);
  expect(bids.length).toBe(1);
  const first = bids[0] as (typeof bids)[number];
  expect(getAdvertiser(first)).toEqual({
    type: "advertiser",
    id: "localhost",
  } satisfies Advertiser);
});

test("HTML内にBidResponseがみつからない", () => {
  const window = new Window();
  window.document.body.innerHTML = `
    <script type="application/ld+json">
    {
      "@context": "https://originator-profile.org/context.jsonld",
      "bidresponse": {
      }
    }
    </script>
  `;

  const bids = getBidResponses(window.document as unknown as Document);
  expect(bids).toBeDefined();
  expect(Array.isArray(bids)).toBe(true);
  expect(bids.length).toBe(0);
});
