import { expect, test } from "vitest";
import { Advertiser, BidResponse } from "./types";
import { getAdvertiser } from "./bidresponse";

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
