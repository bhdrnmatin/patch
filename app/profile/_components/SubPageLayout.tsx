import PageHeader from "./PageHeader";

interface Props {
  title: string;
  onBack?: () => void;
  children: React.ReactNode;
}

export default function SubPageLayout({ title, onBack, children }: Props) {
  return (
    <div className="mx-auto w-full max-w-[430px] min-h-dvh bg-surface">
      {/* status bar spacer */}
      <div className="h-11" />
      <div className="px-6 pt-2 pb-10 flex flex-col gap-6">
        <PageHeader title={title} onBack={onBack} />
        {children}
      </div>
    </div>
  );
}
