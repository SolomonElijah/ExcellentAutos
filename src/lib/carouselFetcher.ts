let etag: string | null = null;

export async function fetchCarousel() {
  const res = await fetch(
    "https://system.excellentautosnigeria.com/api/carousel",
    {
      headers: {
        Accept: "application/json",
        ...(etag ? { "If-None-Match": etag } : {}),
      },
      cache: "no-store",
    }
  );

  if (res.status === 304) {
    return undefined;
  }

  etag = res.headers.get("ETag");
  return res.json();
}
