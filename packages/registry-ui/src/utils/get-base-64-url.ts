/**
 * Data URL文字列からBase64 URLを取得する
 * @param data Data URL文字列
 * @returns Blobから取り出したデータのBase64 URL表現文字列
 */
export default function getBase64URL(data: string) {
  // DataURLの先頭の"data:\w+/[\w+-]+;base64,"を削除するとbase64文字列を取得できるので、そこからbase64urlに変換する
  return data
    .replace(/data:\w+\/[\w+-]+;base64,/, "")
    .replace(/[+/=]/g, (c) => {
      return (
        {
          "+": "-",
          "/": "_",
          "=": "",
        }[c] ?? ""
      );
    });
}
