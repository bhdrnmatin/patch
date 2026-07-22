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
