"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelInvitation, getMatchInvitations } from "@/lib/api/matches";
import { toPersianDigits } from "../../../../lib/persian";

interface Props {
  matchId: string;
}

/**
 * دعوت‌های ارسالی — the organizer's pending invitations, each withdrawable.
 * Renders nothing until there is one. One tap, no confirm: a withdrawn
 * invitation is undone by inviting the number again.
 */
export default function InvitationsSection({ matchId }: Props) {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["matchInvitations", matchId],
    queryFn: () => getMatchInvitations(matchId),
  });
  const { mutate, isPending, isError, variables } = useMutation({
    mutationFn: cancelInvitation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["matchInvitations", matchId] }),
  });

  const pending = data?.filter((i) => i.status === "PENDING") ?? [];
  if (pending.length === 0) return null;

  return (
    <section className="w-full flex flex-col gap-3">
      <h2 className="text-base font-bold leading-4 text-ink-soft text-right" dir="rtl">
        دعوت‌های ارسالی
      </h2>
      <ul className="flex flex-col gap-2">
        {pending.map((inv) => {
          const name = [inv.firstName, inv.lastName].filter(Boolean).join(" ");
          const busy = isPending && variables === inv.id;
          return (
            <li
              key={inv.id}
              className="w-full bg-white rounded-full p-2 flex items-center justify-between gap-3 shadow-card"
            >
              <button
                type="button"
                onClick={() => mutate(inv.id)}
                disabled={isPending}
                className="h-11 shrink-0 px-4 rounded-full bg-surface text-xs font-bold text-danger-deep active:opacity-80 disabled:opacity-50"
              >
                <span dir="rtl">{busy ? "در حال لغو…" : "پس گرفتن"}</span>
              </button>
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex flex-col items-end gap-0.5 min-w-0 text-right">
                  <span className="text-xs font-bold text-ink-soft truncate max-w-full" dir="rtl">
                    {name || toPersianDigits(inv.phoneNumber)}
                  </span>
                  <span className="text-xs text-muted" dir="rtl">
                    در انتظار پاسخ
                  </span>
                </div>
                <img
                  src={inv.photoUrl ?? "/images/avatar-placeholder.svg"}
                  alt=""
                  className="size-10 shrink-0 rounded-full bg-edge object-cover"
                />
              </div>
            </li>
          );
        })}
      </ul>
      {isError && (
        <p role="alert" className="text-xs text-danger-deep text-right" dir="rtl">
          لغو دعوت انجام نشد. دوباره تلاش کن.
        </p>
      )}
    </section>
  );
}
