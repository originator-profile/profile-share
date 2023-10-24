export default function PublicKey() {
  return (
    <form className="mb-8">
      <div className="flex flex-col mb-8 md:flex-row gap-8 md:gap-4 md:items-center">
        <h2 className="text-3xl font-bold">公開鍵</h2>
        <input
          className="jumpu-outlined-button ml-auto"
          type="submit"
          value="保存する"
        />
      </div>
    </form>
  );
}
