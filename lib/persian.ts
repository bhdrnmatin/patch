const FA = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianDigits(value: string): string {
  return value.replace(/[0-9]/g, (d) => FA[+d]);
}

// Inverse of toPersianDigits — Persian inputs (phone, OTP) store ۰–۹; the API
// needs Latin 0–9.
export function toLatinDigits(value: string): string {
  return value.replace(/[۰-۹]/g, (d) => String(FA.indexOf(d)));
}

// Keep only Persian/Arabic letters (U+0600–U+06FF), ZWNJ (نیم‌فاصله), and
// whitespace — drops Latin letters/digits and symbols as they're typed.
export function toPersianOnly(value: string): string {
  return value.replace(/[^؀-ۿ‌\s]/g, "");
}
