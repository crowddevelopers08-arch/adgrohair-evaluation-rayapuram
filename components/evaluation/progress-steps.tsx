export function ProgressSteps({ current }: { current: number }) {
  return (
    <div
      className="question-progress"
      aria-label={`Question ${current + 1} of 10`}
    >
      <ol className="progress-dots isolate relative mt-0 mb-[34px] flex list-none justify-around p-0 before:absolute before:inset-x-0 before:top-[11px] before:-z-10 before:h-2 before:rounded-lg before:bg-[#ccc] before:content-[''] [&_li]:relative [&_li]:size-[30px] [&_li]:rounded-full [&_li]:bg-[#ccc] [&_li]:leading-[30px] [&_li]:font-bold [&_li]:text-[#656565] [&_li.done]:bg-brand [&_li.done]:text-white [&_li.done::before]:absolute [&_li.done::before]:top-[11px] [&_li.done::before]:right-1/2 [&_li.done::before]:-z-10 [&_li.done::before]:h-2 [&_li.done::before]:w-[76px] [&_li.done::before]:bg-brand [&_li.done::before]:content-[''] [&_li:first-child::before]:w-[38px] [&_li:first-child::before]:rounded-l-lg max-[992px]:[&_li.done::before]:w-[69px] max-[768px]:hidden">
        {Array.from({ length: 10 }, (_, index) => (
          <li
            key={index}
            className={index <= current ? "done" : ""}
            aria-current={index === current ? "step" : undefined}
          >
            {index + 1}
          </li>
        ))}
      </ol>
      <div className="mobile-progress hidden max-[768px]:block [&>div]:h-2.5 [&>div]:overflow-hidden [&>div]:rounded-[10px] [&>div]:bg-[#f5f5f5] [&>div>span]:block [&>div>span]:h-full [&>div>span]:bg-brand-gradient [&>div>span]:[transition:width_0.3s] [&_p]:text-right [&_p]:text-[16px] [&_p]:text-[#212529]">
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round((current / 9) * 100)}
        >
          <span style={{ width: `${(current / 9) * 100}%` }} />
        </div>
        <p>QUESTION {current + 1}/10</p>
      </div>
    </div>
  );
}
