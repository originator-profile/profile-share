import DOMPurify from "dompurify";

export const htmlPolicy = window.trustedTypes?.createPolicy("htmlPolicy", {
  createHTML: (input) =>
    DOMPurify.sanitize(input, { RETURN_TRUSTED_TYPE: false }),
});
