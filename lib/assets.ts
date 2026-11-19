const BASE = "https://res.cloudinary.com/ms16lpja";

// Every image/svg used by the site, hosted on Cloudinary.
// Keys are the original file names; use asset("name.webp") to get the URL.
export const ASSET_URLS: Record<string, string> = {
  "hair-evaluvation-2.png": `${BASE}/image/upload/v1795092034/hair-evaluvation-2.png`,
  "adglow-rajaji.png": `${BASE}/image/upload/v1795092033/adglow-rajaji.png`,
  "stm.svg": `${BASE}/image/upload/v1795092013/stm.svg`,
  "offer-image-3.webp": `${BASE}/image/upload/v1795092013/offer-image-3.webp`,
  "offer-image-2.webp": `${BASE}/image/upload/v1795092013/offer-image-2.webp`,
  "mp2.webp": `${BASE}/image/upload/v1795092012/mp2.webp`,
  "male-result-2-after.webp": `${BASE}/image/upload/v1795092012/male-result-2-after.webp`,
  "male-result-2-before.webp": `${BASE}/image/upload/v1795092012/male-result-2-before.webp`,
  "mp1.webp": `${BASE}/image/upload/v1795092012/mp1.webp`,
  "male-result-1-before.webp": `${BASE}/image/upload/v1795092012/male-result-1-before.webp`,
  "male-result-1-after.webp": `${BASE}/image/upload/v1795092011/male-result-1-after.webp`,
  "hair-care-pattern.svg": `${BASE}/image/upload/v1795092011/hair-care-pattern.svg`,
  "hair-f-4.webp": `${BASE}/image/upload/v1795092011/hair-f-4.webp`,
  "lock-icon.webp": `${BASE}/image/upload/v1795092011/lock-icon.webp`,
  "hair-f-3.webp": `${BASE}/image/upload/v1795092011/hair-f-3.webp`,
  "hair-f-2.webp": `${BASE}/image/upload/v1795092011/hair-f-2.webp`,
  "hair-3.webp": `${BASE}/image/upload/v1795092011/hair-3.webp`,
  "hair-f-1.webp": `${BASE}/image/upload/v1795092011/hair-f-1.webp`,
  "female-result-1-before.webp": `${BASE}/image/upload/v1795092011/female-result-1-before.webp`,
  "hair-4.webp": `${BASE}/image/upload/v1795092011/hair-4.webp`,
  "hair-2.webp": `${BASE}/image/upload/v1795092010/hair-2.webp`,
  "grohair.svg": `${BASE}/image/upload/v1795092009/grohair.svg`,
  "fc1.webp": `${BASE}/image/upload/v1795092010/fc1.webp`,
  "female-result-1-after.webp": `${BASE}/image/upload/v1795092010/female-result-1-after.webp`,
  "dnf-3.webp": `${BASE}/image/upload/v1795092010/dnf-3.webp`,
  "fc2.webp": `${BASE}/image/upload/v1795092010/fc2.webp`,
  "dnf-2.webp": `${BASE}/image/upload/v1795092009/dnf-2.webp`,
  "hair-1.webp": `${BASE}/image/upload/v1795092009/hair-1.webp`,
  "female-result-2-before.webp": `${BASE}/image/upload/v1795092009/female-result-2-before.webp`,
  "gender-2.webp": `${BASE}/image/upload/v1795092009/gender-2.webp`,
  "comb-3.webp": `${BASE}/image/upload/v1795092009/comb-3.webp`,
  "gender-1.webp": `${BASE}/image/upload/v1795092009/gender-1.webp`,
  "female-result-2-after.webp": `${BASE}/image/upload/v1795092009/female-result-2-after.webp`,
  "comb-2.webp": `${BASE}/image/upload/v1795092009/comb-2.webp`,
  "comb-1.webp": `${BASE}/image/upload/v1795092008/comb-1.webp`,
};

export function asset(name: string): string {
  const url = ASSET_URLS[name];
  if (!url && process.env.NODE_ENV !== "production") {
    console.warn(`[assets] No Cloudinary URL for "${name}"`);
  }
  return url ?? `/assets/${name}`;
}
