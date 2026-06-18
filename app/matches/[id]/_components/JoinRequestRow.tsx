"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckIcon } from "./icons";
import { CloseIcon } from "../../../(main)/_components/icons";
import { toPersianDigits } from "../../../../lib/persian";
import { respondToJoinRequest } from "@/lib/data";
import type { JoinRequest } from "../../../../lib/types";

interface Props {
  request: JoinRequest;
  matchId: string;
}

/** One join request: player pill + accept/reject buttons (creator view). */
export default function JoinRequestRow({ request, matchId }: Props) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (accept: boolean) =>
      respondToJoinRequest({ matchId, requestId: request.id, accept }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["matchDetails", matchId] }),
  });

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="w-full bg-white border border-white/15 rounded-full p-2 flex items-center justify-end gap-3 shadow-card">
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
          onClick={() => mutate(false)}
          disabled={isPending}
          className="flex-1 min-w-0 h-11 px-[13px] bg-white border border-white/15 rounded-full flex items-center justify-between shadow-card text-xs font-semibold text-ink-soft active:opacity-80 disabled:opacity-50"
        >
          <CloseIcon className="size-4" />
          <span dir="rtl">رد درخواست</span>
        </button>
        <button
          type="button"
          onClick={() => mutate(true)}
          disabled={isPending}
          className="flex-1 min-w-0 h-11 px-[13px] bg-white border border-white/15 rounded-full flex items-center justify-between shadow-card text-xs font-semibold text-ink-soft active:opacity-80 disabled:opacity-50"
        >
          <CheckIcon className="size-4 text-[#00B86B]" />
          <span dir="rtl">قبول درخواست</span>
        </button>
      </div>
    </div>
  );
}
