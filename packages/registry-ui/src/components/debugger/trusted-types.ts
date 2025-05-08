import DOMPurify, { type WindowLike } from "dompurify";

export const htmlPolicy = (window as WindowLike).trustedTypes?.createPolicy(
  "htmlPolicy",
  {
    createHTML: (input) =>
      DOMPurify.sanitize(input, { RETURN_TRUSTED_TYPE: false }),
  },
);
