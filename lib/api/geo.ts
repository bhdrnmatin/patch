import { apiFetch } from "./client";
import type { CityResponse, ProvinceResponse } from "./types";

// Reference data, but the endpoints require a bearer token (profile-setup runs
// after OTP verify, so one is present).

/** All provinces. */
export function getProvinces(): Promise<ProvinceResponse[]> {
  return apiFetch<ProvinceResponse[]>("/provinces");
}

/** Cities within a province. */
export function getCities(provinceId: string): Promise<CityResponse[]> {
  return apiFetch<CityResponse[]>(`/provinces/${provinceId}/cities`);
}

/**
 * Patch runs in Karaj only for now (user, 2026-09-27), so residence is locked
 * to it: both profile forms show البرز / کرج and can't change them. Looked up
 * by name, not a hardcoded id — a backend reset would change the ids.
 */
export const HOME = { province: "البرز", city: "کرج" } as const;

export async function getHomeCity() {
  const province = (await getProvinces()).find((p) => p.name === HOME.province);
  if (!province) throw new Error(`province ${HOME.province} not found`);
  const city = (await getCities(province.id)).find((c) => c.name === HOME.city);
  if (!city) throw new Error(`city ${HOME.city} not found`);
  return { provinceId: province.id, cityId: city.id };
}
