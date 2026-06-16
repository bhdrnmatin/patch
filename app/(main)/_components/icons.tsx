// Iconsax (Vuesax Linear) icons used in the Matches feature, traced from Figma.
// Single-color via `currentColor` so they recolor by context (white in the
// header, dark in cards). Size is controlled by the caller via `className`.

type IconProps = { className?: string };

export function FilterSearchIcon({ className }: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M14.32 19.07c0 .61-.4 1.41-.91 1.72l-1.41.91c-1.31.81-3.13-.1-3.13-1.72v-5.35c0-.71-.4-1.62-.81-2.12L4.22 8.47c-.51-.51-.91-1.41-.91-2.02V4.13c0-1.21.91-2.12 2.02-2.12h13.34c1.11 0 2.02.91 2.02 2.02v2.22c0 .81-.51 1.82-1.01 2.32" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.07 16.52a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m19.87 17.12-1-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SortIcon({ className }: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M3 7h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 17h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ChartIcon({ className }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M1.333 14.667h13.334" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 2.667v12h3v-12c0-.734-.3-1.334-1.2-1.334h-.6c-.9 0-1.2.6-1.2 1.334Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 6.667v8h2.667v-8c0-.734-.267-1.334-1.067-1.334h-.533c-.8 0-1.067.6-1.067 1.334Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.333 10v4.667H14V10c0-.733-.267-1.333-1.067-1.333h-.533c-.8 0-1.067.6-1.067 1.333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PeopleIcon({ className }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M8.107 7.247a1.1 1.1 0 0 0-.22 0 2.96 2.96 0 1 1 .22 0Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.773 9.707c-1.613 1.08-1.613 2.84 0 3.913 1.834 1.227 4.84 1.227 6.674 0 1.613-1.08 1.613-2.84 0-3.913-1.827-1.22-4.834-1.22-6.674 0Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M5.333 1.333v2M10.667 1.333v2" stroke="currentColor" strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.333 6.06h11.334" stroke="currentColor" strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 5.667v5.666c0 2-1 3.334-3.333 3.334H5.333C3 14.667 2 13.333 2 11.333V5.667c0-2 1-3.334 3.333-3.334h5.334C13 2.333 14 3.667 14 5.667Z" stroke="currentColor" strokeWidth="1.2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.466 9.133h.006M10.466 11.133h.006M7.997 9.133h.006M7.997 11.133h.006M5.53 9.133h.005M5.53 11.133h.005" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TomanIcon({ className }: IconProps) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={className} aria-hidden>
      <path d="M6.554 3.24c0 .32-.052.62-.156.9-.098.285-.239.532-.423.742-.184.21-.409.373-.674.49-.265.122-.562.183-.89.183h-.528c-.645 0-1.147-.2-1.504-.602-.357-.402-.536-.952-.536-1.65V1.755h.7v1.52c0 .454.112.82.337 1.1.225.28.594.42 1.107.42h.38c.26 0 .481-.04.666-.122.19-.082.346-.192.467-.332.121-.14.21-.303.268-.49.058-.186.087-.38.087-.584V.917h.7v2.323ZM4.497.751H3.65V0h.847v.751Z" fill="currentColor" />
      <path d="M1.176 9.886c-.156 0-.305-.02-.45-.061a.949.949 0 0 1-.38-.227.93.93 0 0 1-.25-.41A1.6 1.6 0 0 1 0 8.541V4.472h.709v3.912c0 .221.046.399.138.533.098.134.25.201.458.201h.173c.127 0 .19.125.19.376 0 .262-.063.393-.19.393h-.302Z" fill="currentColor" />
      <path d="M1.593 9.118c.438 0 .657-.186.657-.559v-.27c0-.495.127-.885.38-1.17.26-.292.617-.437 1.072-.437.236 0 .444.04.622.122.179.075.329.183.45.323.121.14.21.308.268.506.064.192.095.405.095.638 0 .512-.13.911-.39 1.196-.259.28-.616.42-1.071.42-.23 0-.452-.044-.665-.131-.208-.093-.369-.247-.484-.463a1.1 1.1 0 0 1-.19.305.715.715 0 0 1-.234.183.79.79 0 0 1-.259.09 1.2 1.2 0 0 1-.25.02h-.112c-.075 0-.124-.029-.147-.087-.029-.064-.043-.157-.043-.28 0-.139.014-.241.043-.305.023-.064.072-.096.147-.096h.111Zm2.852-.795c0-.256-.057-.466-.173-.629-.11-.163-.305-.244-.588-.244-.259 0-.452.078-.579.236-.121.157-.181.378-.181.663 0 .256.069.448.207.576.144.128.326.192.545.192.26 0 .453-.067.58-.2.126-.14.19-.338.19-.594Z" fill="currentColor" />
      <path d="M6.853 11.24c.236 0 .444-.038.623-.114a1.04 1.04 0 0 0 .44-.288c.121-.122.213-.265.276-.428.064-.163.101-.338.113-.524h-.735c-.294 0-.536-.032-.726-.096a.875.875 0 0 1-.45-.32 1.04 1.04 0 0 1-.164-.445 2.55 2.55 0 0 1-.06-.397c0-.221.031-.43.095-.628.063-.204.155-.382.276-.533.121-.152.271-.271.45-.359.184-.093.397-.14.639-.14.19 0 .372.033.545.097.178.064.334.166.467.305.132.134.236.312.31.533.081.222.122.49.122.804v.577h.769c.07 0 .115.032.138.096.029.058.043.151.043.28 0 .133-.014.232-.043.296-.023.064-.069.096-.138.096h-.787c-.011.285-.069.556-.172.812-.098.256-.236.48-.415.673-.179.192-.395.343-.648.454-.254.116-.536.175-.847.175h-.9l-.05-.76h.898ZM6.776 8.42c0 .25.057.43.172.54.121.105.352.158.692.158h.683v-.541c0-.367-.072-.629-.216-.786-.138-.163-.334-.245-.588-.245-.236 0-.42.079-.553.236-.127.151-.19.364-.19.638Z" fill="currentColor" />
      <path d="M10.565 9.118c.207 0 .369-.055.484-.166.121-.11.182-.268.182-.472V7.362h.709v1.153c0 .443-.118.783-.354 1.022-.23.233-.553.35-.968.35h-.839c-.075 0-.124-.03-.147-.088-.029-.064-.043-.157-.043-.28 0-.139.014-.24.043-.305.023-.064.072-.096.147-.096h.786ZM12 6.288h-.787v-.733H12v.733Zm-1.158 0h-.787v-.733h.787v.733Z" fill="currentColor" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function InfoIcon({ className }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 8h.01M11 12h1v4h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
