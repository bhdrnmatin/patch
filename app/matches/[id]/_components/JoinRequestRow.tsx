import { CheckIcon } from "./icons";
import { CloseIcon } from "../../../(main)/matches/_components/icons";
import { toPersianDigits } from "../../../../lib/persian";
import type { JoinRequest } from "../../../../lib/types";

interface Props {
  request: JoinRequest;
}

/** One join request: player pill + accept/reject buttons (creator view). */
export default function JoinRequestRow({ request }: Props) {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="w-full bg-white border border-white/15 rounded-full p-2 flex items-center justify-end gap-3 shadow-[0px_2px_1.5px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col items-end gap-0.5 min-w-0 text-right">
          <span className="text-xs font-semibold text-ink-soft" dir="rtl">
            {request.name}
          </span>
          <span className="flex items-center gap-3 text-xs text-muted">
            <span dir="rtl">لول {toPersianDigits(String(request.level))}</span>
            <span className="w-px h-3 bg-edge" />
            <span dir="rtl">ساید ترجیحی: {request.side}</span>
          </span>
        </div>
        <img
          src={request.avatar ?? "/images/avatar-placeholder.svg"}
          alt=""
          className="size-10 shrink-0 rounded-full bg-edge object-cover"
        />
      </div>
      <div className="w-full flex gap-2">
        <button
          type="button"
          className="flex-1 min-w-0 h-11 px-[13px] bg-white border border-white/15 rounded-full flex items-center justify-between shadow-[0px_2px_1.5px_rgba(0,0,0,0.05)] text-xs font-semibold text-ink-soft active:opacity-80"
        >
          <CloseIcon className="size-4" />
          <span dir="rtl">رد درخواست</span>
        </button>
        <button
          type="button"
          className="flex-1 min-w-0 h-11 px-[13px] bg-white border border-white/15 rounded-full flex items-center justify-between shadow-[0px_2px_1.5px_rgba(0,0,0,0.05)] text-xs font-semibold text-ink-soft active:opacity-80"
        >
          <CheckIcon className="size-4 text-[#00B86B]" />
          <span dir="rtl">قبول درخواست</span>
        </button>
      </div>
    </div>
  );
}
