import { FromSchema } from "json-schema-to-ts";

// OpenRTB 2.6に基づく情報カテゴリー https://iabtechlab.com/wp-content/uploads/2022/04/OpenRTB-2-6_FINAL.pdf
const Category = {
  title: "情報カテゴリー",
  type: "object",
  properties: {
    cat: {
      title: "情報カテゴリーID",
      type: "string",
    },
    cattax: {
      title: "情報カテゴリータクソノミー",
      type: "number",
    },
    name: {
      title: "情報カテゴリー名",
      type: "string",
    },
  },
  required: ["cat"],
} as const;

type Category = FromSchema<typeof Category>;

export default Category;
