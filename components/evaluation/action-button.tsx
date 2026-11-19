export function ActionButton({
  children,
  onClick,
  type = "button",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "submit" | "button";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      className="action-button mb-2 inline-flex min-h-[58px] min-w-[150px] items-center justify-between gap-4 rounded-[50px] bg-brand-gradient py-0 pr-0 pl-8 text-[20px] text-white uppercase hover:brightness-[1.06] max-[768px]:min-h-[51px] max-[768px]:pl-[30px]"
      onClick={onClick}
      disabled={disabled}
    >
      <span>{children}</span>
      <span
        className="button-arrow m-2 inline-block size-10 rounded-full bg-white text-[23px] leading-10 text-brand max-[768px]:size-[35px] max-[768px]:text-[20px] max-[768px]:leading-[35px]"
        aria-hidden="true"
      >
        ➜
      </span>
    </button>
  );
}
