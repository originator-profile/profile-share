import {
  OpItem,
  OpHolder,
  OpCertifier,
  OpCredential,
  OpVerifier,
} from "@webdino/profile-model";

/**
 * OpItem が OpHolder 型であるか否か
 * @param opItem
 * @return OpHolder 型であれば true、それ以外ならば false
 */
export const isOpHolder = (opItem: OpItem): opItem is OpHolder =>
  opItem.type === OpHolder.properties.type.const;

/**
 * OpItem が OpCertifier 型であるか否か
 * @param opItem
 * @return OpCertifier 型であれば true、それ以外ならば false
 */
export const isOpCertifier = (opItem: OpItem): opItem is OpCertifier =>
  opItem.type === OpCertifier.properties.type.const;

/**
 * OpItem が OpCredential 型であるか否か
 * @param opItem
 * @return OpCredential 型であれば true、それ以外ならば false
 */
export const isOpCredential = (opItem: OpItem): opItem is OpCredential =>
  opItem.type === OpCredential.properties.type.const;

/**
 * OpItem が OpVerifier 型であるか否か
 * @param opItem
 * @return OpVerifier 型であれば true、それ以外ならば false
 */
export const isOpVerifier = (opItem: OpItem): opItem is OpVerifier =>
  opItem.type === OpVerifier.properties.type.const;
