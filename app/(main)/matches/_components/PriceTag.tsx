import { toPersianDigits } from "@/lib/persian";
import { TomanIcon } from "../../_components/icons";

interface Props {
  amount: number;
  className?: string;
}

/** Price amount with the Toman currency glyph, in Persian digits. */
export default function PriceTag({ amount, className }: Props) {
  const formatted = toPersianDigits(amount.toLocaleString("en-US"));
  return (
    <span dir="rtl" className={`inline-flex items-center gap-1 ${className ?? ""}`}>
      {formatted}
      <TomanIcon className="size-3" />
    </span>
  );
}
