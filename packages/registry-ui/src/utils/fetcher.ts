export default async function fetcher(req: {
  method?: string;
  url: string;
  token: string;
}) {
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
