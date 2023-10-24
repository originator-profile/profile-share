export default function Logo() {
  return (
    <div className="mb-8">
      <div className="flex flex-col mb-8 md:flex-row gap-8 md:gap-4 md:items-center">
        <h2 className="text-3xl font-bold">ロゴマーク</h2>
      </div>
      <div>
        <p className="mb-4">
          法人・組織のロゴ画像(媒体ロゴではない) をご提供ください。
          <br />
          組織情報表示画面の正方形領域にアイコンとして表示して不自然とならないもの、余白が適切なものを指定してください。
        </p>

        <p className="mb-8">
          縦横396pxまたはそれより十分大きな画像で縮小利用可な画像を指定してください。画像ファイルはWebに公開済みファイル、ダウンロードページをご案内頂くか、別途事務局に送付してその旨をご記入ください。
        </p>
      </div>
    </div>
  );
}
