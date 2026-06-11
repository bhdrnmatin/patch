/** رنک پلیر ماه promo pill with the athlete image overflowing the top edge.
    Root owns no margin — the Figma frame is 127px tall (17px image headroom + 110px card). */
export default function PromoCard() {
  return (
    <div className="w-full pt-[17px]">
      <div className="relative w-full h-[110px] bg-white rounded-full shadow-card">
        <img
        src="/images/promo-player-rank.webp"
        alt=""
        className="absolute right-[13px] -top-[27px] w-[91px] h-[137px] object-cover pointer-events-none"
      />
        <div className="absolute right-[116px] top-1/2 -translate-y-1/2 w-[199px] flex flex-col items-end gap-0.5 text-right">
          <span className="text-sm font-bold text-ink-soft" dir="rtl">
            رنک پلیر ماه
          </span>
          <p className="w-full text-xs text-ink-soft/60" dir="rtl">
            با شرکت در این بازی، می‌تونی امتیاز رنک پلیر ماه رو بدست بیاری
          </p>
        </div>
      </div>
    </div>
  );
}
