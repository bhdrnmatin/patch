"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type IconProps = { className?: string };

function DiscoverIcon({ className }: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.03809 4.08887C10.6061 3.43653 13.3887 3.43653 15.9707 4.08887C17.0667 4.36397 17.833 5.3585 17.833 6.50684V7.41016C20.1392 8.09837 21.8196 10.1471 21.9697 12.6094V12.6084C21.9893 12.9278 22 13.2577 22 13.5967C22 14.5396 21.917 15.4897 21.7529 16.4209C21.442 18.1824 20.0371 19.5432 18.2568 19.8057C16.1913 20.1096 14.0859 20.2637 12 20.2637C9.9251 20.2637 7.83052 20.1103 5.77441 19.8096C3.97919 19.5464 2.56387 18.1969 2.25293 16.4531C2.08499 15.5126 2 14.5513 2 13.5967C2.00001 13.2937 2.00881 12.9556 2.03223 12.584C2.18623 10.1254 3.86762 8.0832 6.16602 7.4082V6.50684C6.16602 5.35999 6.9358 4.36468 8.03809 4.08887ZM11.999 8.59766C10.4468 8.59767 8.87897 8.68634 7.34082 8.86133C5.35271 9.08792 3.81865 10.6972 3.69434 12.6885C3.67404 13.0219 3.667 13.3259 3.66699 13.5977C3.66699 14.4545 3.7428 15.3174 3.89355 16.1611C4.07862 17.1986 4.93133 18.0025 6.01562 18.1611C9.97962 18.7432 14.0552 18.7408 18.0146 18.1572C19.0831 17.9992 19.9254 17.1845 20.1113 16.1309H20.1104C20.258 15.2958 20.332 14.4428 20.332 13.5977C20.332 13.2931 20.3228 12.9976 20.3057 12.7109C20.1831 10.7054 18.631 9.08398 16.6162 8.85742C15.0897 8.68479 13.5364 8.59766 11.999 8.59766ZM7 10.2646C7.46011 10.2646 7.83391 10.6368 7.83398 11.0977V16.0977C7.83398 16.5586 7.46016 16.9316 7 16.9316C6.53984 16.9316 6.16602 16.5586 6.16602 16.0977V11.0977C6.16609 10.6368 6.53989 10.2647 7 10.2646ZM17 10.2646C17.4601 10.2646 17.8339 10.6368 17.834 11.0977V16.0977C17.834 16.5586 17.4602 16.9316 17 16.9316C16.5398 16.9316 16.166 16.5586 16.166 16.0977V11.0977C16.1661 10.6368 16.5399 10.2647 17 10.2646ZM14.501 9.43066C14.9611 9.43076 15.334 9.80377 15.334 10.2646C15.3337 10.7253 14.9609 11.0976 14.501 11.0977H9.5C9.03999 11.0977 8.66625 10.7254 8.66602 10.2646C8.66602 9.80371 9.03984 9.43067 9.5 9.43066H14.501ZM15.5645 5.70508C13.2465 5.11916 10.7518 5.1192 8.44727 5.70508L8.44629 5.7041C8.08461 5.79471 7.83306 6.12447 7.83301 6.50488V7.14746C10.5924 6.87872 13.403 6.87853 16.167 7.14648V6.50586C16.167 6.13017 15.9135 5.79346 15.5645 5.70508Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CupIcon({ className }: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M12.1499 16.5V18.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.1499 22H17.1499V21C17.1499 19.9 16.2499 19 15.1499 19H9.1499C8.0499 19 7.1499 19.9 7.1499 21V22V22Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" />
      <path d="M6.1499 22H18.1499" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 16C8.13 16 5 12.87 5 9V6C5 3.79 6.79 2 9 2H15C17.21 2 19 3.79 19 6V9C19 12.87 15.87 16 12 16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.47004 11.6496C4.72004 11.4096 4.06004 10.9696 3.54004 10.4496C2.64004 9.44961 2.04004 8.24961 2.04004 6.84961C2.04004 5.44961 3.14004 4.34961 4.54004 4.34961H5.19004C4.99004 4.80961 4.89004 5.31961 4.89004 5.84961V8.84961C4.89004 9.84961 5.10004 10.7896 5.47004 11.6496Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.5298 11.6496C19.2798 11.4096 19.9398 10.9696 20.4598 10.4496C21.3598 9.44961 21.9598 8.24961 21.9598 6.84961C21.9598 5.44961 20.8598 4.34961 19.4598 4.34961H18.8098C19.0098 4.80961 19.1098 5.31961 19.1098 5.84961V8.84961C19.1098 9.84961 18.8998 10.7896 18.5298 11.6496Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MatchesIcon({ className }: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.9434 2.3457C13.9774 2.3457 15.9097 2.98262 17.5283 4.14648L17.5342 4.15137C17.5373 4.15345 17.5402 4.1548 17.542 4.15625L17.543 4.15723C17.9588 4.45788 18.3603 4.78507 18.7324 5.15723C20.5461 6.96997 21.5439 9.38208 21.5439 11.9453C21.5439 14.5086 20.5451 16.9207 18.7324 18.7334C16.9197 20.5471 14.5085 21.5449 11.9443 21.5449C9.38019 21.5449 6.96897 20.547 5.15625 18.7334C3.34255 16.9207 2.34473 14.5095 2.34473 11.9453C2.34473 9.56525 3.21414 7.32429 4.78711 5.56445L4.84961 5.49512L5.15527 5.15723C6.96801 3.34352 9.37922 2.34571 11.9434 2.3457ZM17.2236 5.35645C16.563 6.19046 16.2022 7.21397 16.2021 8.29199V11.9307C16.2028 11.9351 16.2041 11.9401 16.2041 11.9453C16.2039 15.1284 13.6147 17.7187 10.4307 17.7188C8.89133 17.7188 7.44091 17.1166 6.34961 16.0254C5.25929 14.9332 4.65727 13.4838 4.65723 11.9443V7.66797C3.90043 8.95084 3.49219 10.4149 3.49219 11.9443C3.49223 14.2019 4.37134 16.3235 5.96777 17.9199C7.56421 19.5163 9.68689 20.3954 11.9434 20.3955C14.201 20.3955 16.3234 19.5162 17.9189 17.9199C19.5148 16.3236 20.3935 14.2025 20.3936 11.9453C20.3936 9.68769 19.5143 7.56616 17.918 5.96973C17.6979 5.74965 17.4645 5.5489 17.2236 5.35645ZM11.9434 3.49316C9.68576 3.49322 7.56417 4.37235 5.96777 5.96875C5.93655 5.99998 5.9069 6.03314 5.87598 6.06836C5.85383 6.09358 5.82968 6.11987 5.80566 6.14648V11.9453C5.80661 13.1779 6.28811 14.3387 7.16211 15.2129C8.03738 16.0872 9.19797 16.5693 10.4316 16.5693C12.9797 16.5692 15.0531 14.4965 15.0557 11.9492V8.29102C15.0558 6.97613 15.4861 5.72426 16.2783 4.69922C14.9803 3.91949 13.4962 3.49316 11.9434 3.49316Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ProfileIcon({ className }: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M12.1601 10.87C12.0601 10.86 11.9401 10.86 11.8301 10.87C9.45006 10.79 7.56006 8.84 7.56006 6.44C7.56006 3.99 9.54006 2 12.0001 2C14.4501 2 16.4401 3.99 16.4401 6.44C16.4301 8.84 14.5401 10.79 12.1601 10.87Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.16021 14.56C4.74021 16.18 4.74021 18.82 7.16021 20.43C9.91021 22.27 14.4202 22.27 17.1702 20.43C19.5902 18.81 19.5902 16.17 17.1702 14.56C14.4302 12.73 9.92021 12.73 7.16021 14.56Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AddIcon({ className }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path d="M6.6665 10H13.3332" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 13.3327V6.66602" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.49984 18.3327H12.4998C16.6665 18.3327 18.3332 16.666 18.3332 12.4993V7.49935C18.3332 3.33268 16.6665 1.66602 12.4998 1.66602H7.49984C3.33317 1.66602 1.6665 3.33268 1.6665 7.49935V12.4993C1.6665 16.666 3.33317 18.3327 7.49984 18.3327Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WhistleIcon({ className }: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.74721 5.00051C12.5732 2.17455 17.1665 2.21756 20.006 5.05715C22.8447 7.89663 22.8875 12.4902 20.0617 15.3159C18.8954 16.4822 17.2455 18.1574 15.2501 18.8843C14.2157 19.2613 13.0678 19.3951 11.8439 19.0835C11.2139 18.9233 10.5862 18.651 9.96108 18.2583L7.57046 21.6079C6.82125 22.6548 5.31092 22.7807 4.40054 21.8697L3.1935 20.6626C2.28312 19.7522 2.40808 18.241 3.4562 17.4927L6.80386 15.1011C6.41216 14.4759 6.13888 13.8483 5.97866 13.2193C5.66815 11.9945 5.80184 10.8464 6.17886 9.81301C6.90559 7.81757 8.57987 6.16676 9.74721 5.00051ZM4.66714 19.19L5.87417 20.396L8.33022 16.9585L8.10366 16.732L4.66714 19.19ZM18.5314 6.52981C16.488 4.48742 13.2154 4.48073 11.2209 6.47414C9.97744 7.71755 8.67707 9.04317 8.13686 10.5249C7.87997 11.2292 7.80576 11.9485 7.99819 12.7056C8.19356 13.4724 8.6835 14.3646 9.69057 15.3716C10.6984 16.3793 11.5909 16.8686 12.3576 17.064C13.1146 17.2564 13.833 17.1832 14.5382 16.9263C16.02 16.3861 17.3457 15.0838 18.589 13.8413C20.5825 11.8467 20.5748 8.57326 18.5314 6.52981ZM2.75503 2.41555C3.97605 1.19491 5.955 1.19472 7.17495 2.41555C8.39596 3.63559 8.39596 5.61539 7.17495 6.83645C5.95504 8.05621 3.97608 8.05602 2.75503 6.83645C1.53499 5.61544 1.53499 3.63561 2.75503 2.41555ZM5.70132 3.88918C5.29496 3.48284 4.63501 3.48283 4.22866 3.88918C3.82146 4.29652 3.82139 4.95552 4.22866 5.36184C4.63497 5.76913 5.29495 5.76904 5.70132 5.36184C6.10865 4.95548 6.10865 4.29651 5.70132 3.88918Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CourtIcon({ className }: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M17.0664 21.3398H3.8C3.5789 21.3398 3.4 21.1609 3.4 20.9398V3C3.4 2.7789 3.57891 2.6 3.8 2.6H17.579C17.8001 2.6 17.979 2.77891 17.979 3V14.696C18.547 14.8546 19.0548 15.1577 19.4602 15.5624C20.0727 16.1749 20.4516 17.021 20.4516 17.9554C20.4516 18.8898 20.0727 19.7359 19.4602 20.3484C18.8477 20.9609 18.0016 21.3398 17.0672 21.3398H17.0664ZM18.7031 15.9554V17.5116C18.7031 17.9624 18.5187 18.3718 18.2227 18.6679C17.9266 18.964 17.5172 19.1483 17.0664 19.1483C16.6156 19.1483 16.2063 18.964 15.9102 18.6679C15.6141 18.3718 15.4297 17.9624 15.4297 17.5116V15.9554C15.361 16.0132 15.3039 16.0632 15.2391 16.1281C14.75 16.6171 14.4821 17.2718 14.4821 17.9554C14.4821 18.6687 14.7711 19.3156 15.2391 19.7827C15.7063 20.2499 16.3532 20.5398 17.0664 20.5398C17.7797 20.5398 18.4266 20.2507 18.8938 19.7827C19.361 19.3156 19.6508 18.6687 19.6508 17.9554C19.6508 17.2421 19.3618 16.5952 18.8938 16.1281C18.8328 16.0671 18.7695 16.0101 18.7031 15.9554ZM16.2289 15.5101V17.5125C16.2289 17.7422 16.3235 17.9515 16.475 18.1031C16.6266 18.2547 16.8367 18.3492 17.0664 18.3492C17.2961 18.3492 17.5055 18.2547 17.657 18.1031C17.8086 17.9515 17.9031 17.7422 17.9031 17.5125V15.5101C17.6406 15.4202 17.3594 15.3718 17.0664 15.3718C16.7735 15.3718 16.4922 15.4202 16.2289 15.5101ZM17.1781 14.5734V12.3702H15.4938V14.9584C15.9633 14.7115 16.4984 14.5716 17.0656 14.5716L17.1781 14.5734ZM14.6945 15.5413V12.3695H6.68354V16.9819H13.8241C13.9866 16.439 14.2827 15.953 14.6734 15.5624L14.6945 15.5413ZM13.6867 17.7819H6.69292V20.5397H14.8811C14.8092 20.4788 14.7397 20.4147 14.6733 20.3483C14.0608 19.7358 13.6819 18.8897 13.6819 17.9553C13.6819 17.8975 13.6836 17.8397 13.6867 17.7819ZM14.6945 6.95772H6.68354V11.5701H14.6945V6.95772ZM6.68354 6.15772H14.6945V3.39992H6.68354V6.15772ZM17.1789 11.5695V3.39912H15.4946V11.5695H17.1789ZM4.19994 11.5695H5.88432V3.39912H4.19994V11.5695ZM5.88432 12.3695H4.19994V20.5399H5.88432V12.3695Z"
        fill="currentColor"
      />
    </svg>
  );
}

type Tab = {
  href: string;
  Icon: (p: IconProps) => React.ReactElement;
  label: string;
  badge?: boolean;
};

type AddAction = {
  href: string;
  Icon: (p: IconProps) => React.ReactElement;
  label: string;
};

const addActions: AddAction[] = [
  { href: "/tournaments", Icon: WhistleIcon, label: "ساخت تورنومنت" },
  { href: "/matches", Icon: MatchesIcon, label: "ساخت مسابقه" },
  { href: "/courts", Icon: CourtIcon, label: "رزرو زمین" },
];

const tabs: Tab[] = [
  { href: "/matches", Icon: MatchesIcon, label: "مسابقات", badge: true },
  { href: "/tournaments", Icon: CupIcon, label: "تورنومنت" },
  { href: "/activity", Icon: DiscoverIcon, label: "کاوش", badge: true },
  { href: "/profile", Icon: ProfileIcon, label: "پروفایل" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function BottomNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  // Set when the menu closes because the user tapped one of its links — that
  // navigation supersedes the history entry we pushed, so skip the rollback.
  const navigatingRef = useRef(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);

    // Make the hardware/browser back button close the menu instead of
    // navigating to the previous URL.
    window.history.pushState({ addMenu: true }, "");
    const onPop = () => setMenuOpen(false);
    window.addEventListener("popstate", onPop);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("popstate", onPop);
      // Closed via the UI (backdrop / toggle / Escape) — drop the entry we
      // pushed. Skip it when a link is navigating away or the back button
      // already popped it.
      if (!navigatingRef.current && window.history.state?.addMenu) {
        window.history.back();
      }
      navigatingRef.current = false;
    };
  }, [menuOpen]);

  return (
    <>
      {/* Dimmed blurred backdrop behind the nav while the add menu is open */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[4px]"
          onClick={() => setMenuOpen(false)}
          aria-hidden
        />
      )}

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 flex items-center justify-between gap-3 px-6">
      {/* Add menu anchored above the nav */}
      {menuOpen && (
        <div className="absolute bottom-full mb-4 left-6 right-6 flex flex-col gap-2">
          {addActions.map(({ href, Icon, label }) => (
            <Link
              key={label}
              href={href}
              onClick={() => {
                navigatingRef.current = true;
                setMenuOpen(false);
              }}
              className="flex items-center justify-end gap-3 w-full p-1 rounded-full bg-white/10 border border-white/20"
            >
              <span className="text-sm font-semibold leading-4 text-white" dir="rtl">
                {label}
              </span>
              <span className="size-10 shrink-0 flex items-center justify-center rounded-full bg-white/30 text-white">
                <Icon />
              </span>
            </Link>
          ))}
        </div>
      )}
      {/* Frosted pill with the four section tabs */}
      <div className="flex-1 flex items-stretch rounded-[48px] border-2 border-white/30 bg-white/35 backdrop-blur-[6px] overflow-hidden">
        {tabs.map(({ href, Icon, label, badge }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className="relative flex-1 h-[52px] flex items-center justify-center"
            >
              {active ? (
                <span className="absolute inset-1 rounded-[32px] bg-primary flex items-center justify-center">
                  <Icon className="text-white" />
                </span>
              ) : (
                <span className="relative">
                  <Icon className="text-ink-soft" />
                  {badge && (
                    <span className="absolute -top-0.5 -right-1 size-2 rounded-full bg-[#FF4869] border border-white" />
                  )}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Standalone add button — toggles the add menu */}
      <button
        type="button"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="افزودن"
        aria-expanded={menuOpen}
        className="size-[52px] shrink-0 flex items-center justify-center rounded-[32px] border-2 border-white/15 bg-primary backdrop-blur-[10px]"
      >
        <AddIcon className="text-white" />
      </button>
      </nav>
    </>
  );
}
