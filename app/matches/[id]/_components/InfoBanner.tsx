import { InfoIcon } from "../../../(main)/_components/icons";

interface Props {
  text: string;
}

/** Blue rounded notice with an (i) icon on the right. */
export default function InfoBanner({ text }: Props) {
  return (
    <div className="w-full bg-primary rounded-pill p-1 flex items-center justify-end gap-2">
      <p className="flex-1 min-w-0 text-xs font-semibold leading-4 text-white text-right" dir="rtl">
        {text}
      </p>
      <span className="shrink-0 p-2 rounded-full bg-white/20 text-white">
        <InfoIcon className="size-6" />
      </span>
    </div>
  );
}
