/** iframe から得られた DP のページ上での位置を特定するために使用する属性の名前 */
export const DATASET_ATTRIBUTE = "data-document-profile-subjects";
export const DATASET_ATTRIBUTE_CAMEL_CASE = DATASET_ATTRIBUTE.replace(
  /-\w/g,
  (match) => match.substring(1).toUpperCase(),
);
