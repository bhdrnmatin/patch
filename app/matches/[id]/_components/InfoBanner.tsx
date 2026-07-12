import { InfoIcon } from "../../../(main)/_components/icons";

interface Props {
  text: string;
}

/** Tinted blue notice with an (i) icon on the right. */
export default function InfoBanner({ text }: Props) {
  return (
    <div className="w-full bg-primary/10 rounded-pill p-1 flex items-center justify-end gap-2">
      <p className="flex-1 min-w-0 text-xs font-bold leading-4 text-primary text-right" dir="rtl">
        {text}
      </p>
      <span className="shrink-0 p-2 rounded-full bg-primary/15 text-primary">
        <InfoIcon className="size-6" />
      </span>
    </div>
  );
}
