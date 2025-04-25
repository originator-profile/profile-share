import { useForm } from "@conform-to/react";
import { parseWithYup } from "@conform-to/yup";
import { LocalKeys } from "@originator-profile/cryptography";
import { VerifiedOps } from "@originator-profile/verify";
import { useState } from "react";
import {
  CheckboxField,
  InputField,
  RadioGroupField,
  TextareaField,
} from "../field";
import { PresentationField } from "./PresentationField";
import { debugCas, debugOps, debugSiteProfile, debugTrustedOps } from "./debug";
import { Values, presentationTypeValues, schema } from "./schema";
import { Output } from "./types";

type Props = {
  /** 初期値 */
  initialValues: Values;
  /** 初期値の保存 */
  saveInitialValues(input: Values | ((oldVal: Values) => Values)): void;
  /** 出力 */
  onOutput(output: Output): void;
  /** 出力のリセット */
  onOutputReset(): void;
};

export function DebuggerForm(props: Props) {
  async function debug(value: Values) {
    props.onOutput({ title: "Debug Values", type: "json", src: value });
    const trustedOps = await debugTrustedOps(
      value.trustedOps,
      value.trustedOpId,
    );
    if (!trustedOps.ok) return props.onOutput(trustedOps.output);
    const { decodedTrustedOps, trustedKeys } = trustedOps.result;
    props.onOutput({
      title: "Trusted OPS",
      type: "json",
      src: decodedTrustedOps,
    });
    props.onOutput({
      title: "Trusted Keys",
      type: "json",
      src: trustedKeys,
    });
    const keys = LocalKeys(trustedKeys);
    const verifiedOps: VerifiedOps = [];
    if (value.verifySp === "on") {
      const sp = await debugSiteProfile(
        value.sp,
        value.spType,
        trustedOps.result.trustedOps,
        keys,
        value.trustedOpId,
        value.url,
      );
      if (!sp.ok) return props.onOutput(sp.output);
      props.onOutput({
        title: "Site Profile Verification Successful",
        type: "json",
        src: sp.result,
      });
      verifiedOps.push(...sp.result.originators);
    } else {
      const ops = await debugOps(
        value.ops,
        value.opsType,
        trustedOps.result.trustedOps,
        keys,
        value.trustedOpId,
      );
      if (!ops.ok) return props.onOutput(ops.output);
      props.onOutput({
        title: "OPS Verification Successful",
        type: "json",
        src: ops.result,
      });
      verifiedOps.push(...ops.result);
    }
    if (value.verifyCas === "on") {
      const cas = await debugCas(
        value.cas,
        value.casType,
        verifiedOps,
        value.url,
      );
      if (!cas.ok) return props.onOutput(cas.output);
      props.onOutput({
        title: "CAS Verification Successful",
        type: "json",
        src: cas.result,
      });
    }
  }
  const [form, fields] = useForm({
    defaultValue: props.initialValues,
    onValidate({ formData }) {
      return parseWithYup(formData, { schema });
    },
    async onSubmit(e, context) {
      e.preventDefault();
      props.onOutputReset();
      if (context.submission?.status !== "success") return;
      const { value } = context.submission;
      props.saveInitialValues(value);
      await debug(value);
    },
  });
  const [verifySpFlag, setVerifySpFlag] = useState(
    fields.verifySp.value === "on",
  );
  const [verifyCasFlag, setVerifyCasFlag] = useState(
    fields.verifyCas.value === "on",
  );

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      className="space-y-6 md:space-y-4"
    >
      <CheckboxField
        label="Verify Site Profile"
        id={fields.verifySp.id}
        name={fields.verifySp.name}
        value={verifySpFlag}
        onChange={(e) => setVerifySpFlag(e.target.checked)}
        required={fields.verifySp.required}
        defaultValue={fields.verifySp.value === "on"}
      />
      <RadioGroupField
        values={presentationTypeValues}
        label="OPS Presentation Type"
        name={fields.opsType.name}
        defaultValue={fields.opsType.initialValue}
        required={fields.opsType.required}
        hidden={verifySpFlag}
      />
      <PresentationField
        presentationType={fields.opsType.value}
        label="OPS"
        id={fields.ops.id}
        name={fields.ops.name}
        required={fields.ops.required}
        hidden={verifySpFlag}
        defaultValue={fields.ops.initialValue}
        errors={fields.ops.errors}
      />
      <RadioGroupField
        values={presentationTypeValues}
        label="SP Presentation Type"
        name={fields.spType.name}
        defaultValue={fields.spType.initialValue}
        required={fields.spType.required}
        hidden={!verifySpFlag}
      />
      <PresentationField
        presentationType={fields.spType.value}
        label="SP"
        id={fields.sp.id}
        name={fields.sp.name}
        required={fields.sp.required}
        hidden={!verifySpFlag}
        defaultValue={fields.sp.initialValue}
        errors={fields.sp.errors}
      />
      <CheckboxField
        label="Verify CAS"
        id={fields.verifyCas.id}
        name={fields.verifyCas.name}
        value={verifyCasFlag}
        onChange={(e) => setVerifyCasFlag(e.target.checked)}
        required={fields.verifyCas.required}
        defaultValue={fields.verifyCas.value === "on"}
      />
      <RadioGroupField
        values={presentationTypeValues}
        label="CAS Presentation Type"
        name={fields.casType.name}
        defaultValue={fields.casType.initialValue}
        required={fields.casType.required}
        hidden={!verifyCasFlag}
      />
      <PresentationField
        presentationType={fields.casType.value}
        label="CAS"
        id={fields.cas.id}
        name={fields.cas.name}
        required={fields.cas.required}
        hidden={!verifyCasFlag}
        defaultValue={fields.cas.initialValue}
        errors={fields.cas.errors}
      />
      <InputField
        label="URL"
        id={fields.url.id}
        name={fields.url.name}
        required={fields.url.required}
        hidden={!(verifySpFlag || verifyCasFlag)}
        defaultValue={fields.url.initialValue}
        errors={fields.url.errors}
      />
      <InputField
        label="Trusted OP ID"
        id={fields.trustedOpId.id}
        name={fields.trustedOpId.name}
        required={fields.trustedOpId.required}
        defaultValue={fields.trustedOpId.initialValue}
        readOnly
      />
      <TextareaField
        label="Trusted OPS"
        id={fields.trustedOps.id}
        name={fields.trustedOps.name}
        required={fields.trustedOps.required}
        defaultValue={fields.trustedOps.initialValue}
        readOnly
      />
      <input className="jumpu-button" type="submit" value="Verify" />
    </form>
  );
}
