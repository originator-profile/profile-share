/**
 * `/internal/`配下のAPIをフェッチする関数
 * @param req.method リクエストメソッド
 * @param req.url URL
 * @param token アクセストークン
 * @returns レスポンスコンテンツ
 */
export default async function fetcher<Data>(req: {
  method?: string;
  url: string;
  token: string;
}): Promise<Data> {
  const res = await fetch(req.url, {
    method: req.method,
    headers: {
      authorization: `Bearer ${req.token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`, { cause: res });
  }

  return await res.json();
}
