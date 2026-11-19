export function EvaluationBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none"
    >
      <div className="absolute inset-0 [background-image:radial-gradient(ellipse_at_top_left,#fce8e7_0%,transparent_45%),radial-gradient(ellipse_at_bottom_right,#fff0ed_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[url('/assets/hair-care-pattern.svg')] bg-repeat [background-size:640px_640px] max-[768px]:[background-size:440px_440px]" />
      <div className="absolute inset-0 [background:linear-gradient(90deg,transparent_0%,rgba(255,253,252,0.9)_22%,rgba(255,253,252,0.96)_50%,rgba(255,253,252,0.9)_78%,transparent_100%)] max-[768px]:[background:linear-gradient(90deg,rgba(255,253,252,0.25),rgba(255,253,252,0.92)_22%,rgba(255,253,252,0.92)_78%,rgba(255,253,252,0.25))]" />
      <svg
        viewBox="0 0 280 460"
        fill="none"
        className="absolute top-8 -left-20 h-[460px] w-[280px] text-brand opacity-[0.08] max-[768px]:-left-36"
      >
        <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M30-20C310 120-50 265 200 480" />
          <path d="M48-20C328 120-32 265 218 480" />
          <path d="M66-20C346 120-14 265 236 480" />
          <path d="M84-20C364 120 4 265 254 480" />
          <path d="M102-20C382 120 22 265 272 480" />
        </g>
      </svg>
      <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-brand-border to-transparent" />
    </div>
  );
}
