const FA = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianDigits(value: string): string {
  return value.replace(/[0-9]/g, (d) => FA[+d]);
}
