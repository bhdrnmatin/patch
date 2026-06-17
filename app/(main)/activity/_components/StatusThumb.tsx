interface Props {
  image: string;
  /** Overlay label, e.g. "در انتظار تایید". */
  status: string;
}

/** 91×112 court thumbnail with a dark status label across the bottom. */
export default function StatusThumb({ image, status }: Props) {
  return (
    <div className="relative h-28 w-[91px] shrink-0 overflow-hidden rounded-lg bg-edge">
      <img src={image} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-black/70 px-2 py-1.5">
        <span dir="rtl" className="text-[10px] font-bold text-white">
          {status}
        </span>
      </div>
    </div>
  );
}
