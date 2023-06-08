import { FromSchema } from "json-schema-to-ts";

// OpenRTB 2.6の Object: Site にあるcat, cattax 類似の情報カテゴリーを持つ
// https://iabtechlab.com/wp-content/uploads/2022/04/OpenRTB-2-6_FINAL.pdf
const Category = {
  title: "情報カテゴリー",
  type: "object",
  properties: {
    cat: {
      title: "情報カテゴリーID",
      description: "情報カテゴリータクソノミーcattaxで示される分類におけるコードまたはID",
      type: "string",
    },
    cattax: {
      title: "情報カテゴリータクソノミー",
      description: "https://github.com/InteractiveAdvertisingBureau/AdCOM/blob/master/AdCOM%20v1.0%20FINAL.md#list_categorytaxonomies",
      type: "number",
    },
    name: {
      title: "情報カテゴリー名",
      description: "情報カテゴリータクソノミーcattaxで示される分類におけるカテゴリー名",
      type: "string",
    },
  },
  required: ["cat"],
} as const;

type Category = FromSchema<typeof Category>;

export default Category;
