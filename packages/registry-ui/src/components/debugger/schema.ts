import * as yup from "yup";
import { PresentationType } from "./types";

export const presentationTypeValues = [
  { value: "embedded", label: "Embedded" },
  { value: "external", label: "External" },
];

export const schema = yup.object({
  cas: yup.string(),
  casType: yup.string<PresentationType>().default("embedded"),
  ops: yup.string(),
  opsType: yup.string<PresentationType>().default("embedded"),
  sp: yup.string(),
  spType: yup.string<PresentationType>().default("embedded"),
  trustedOpId: yup.string().required(),
  trustedOps: yup.string().required(),
  url: yup.string().required(),
  verifyCas: yup.string<"on">(),
  verifySp: yup.string<"on">(),
});

export type Values = yup.InferType<typeof schema>;
