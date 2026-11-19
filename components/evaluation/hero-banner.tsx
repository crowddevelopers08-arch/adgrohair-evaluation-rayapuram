/* eslint-disable @next/next/no-img-element */
import { asset } from "@/lib/assets";
export function HeroBanner() {
  return (
    <section
      className="hero-banner flex h-[479px] uppercase [background:linear-gradient(120deg,#fff7f5_0%,#fff1ed_52%,#f9dedb_100%)] max-[768px]:h-auto max-[768px]:flex-col max-[768px]:bg-[#fff4f3] max-[768px]:[background-image:none] max-[768px]:text-center"
      aria-label="Hair health evaluation"
    >
      <div className="hero-copy flex w-1/2 items-center py-12 pr-5 pl-[clamp(24px,4.5vw,72px)] max-[768px]:w-full max-[768px]:justify-center max-[768px]:px-5 max-[768px]:py-8">
        <div className="w-full max-w-[720px]">
          <p className="over text-[clamp(24px,2.5vw,40px)] leading-[1.2] font-medium tracking-[-0.02em] text-[#737c82]">
            Over
          </p>
          <p className="user-count mt-5 mb-3 text-[clamp(28px,4.7vw,76px)] leading-[1.05] font-extrabold tracking-[-0.025em] whitespace-nowrap text-brand [&_strong]:text-[clamp(44px,6vw,96px)] [&_strong]:font-extrabold max-[768px]:mt-4 max-[768px]:text-[30px] max-[768px]:[&_strong]:text-[48px] max-[361px]:text-[26px] max-[361px]:[&_strong]:text-[40px]">
            <strong>1500</strong> patients
          </p>
          <p className="taken inline-block max-w-full border-b-2 border-solid border-[#ccc] pb-1 text-[clamp(20px,2.5vw,40px)] leading-[1.2] font-semibold tracking-[-0.02em] text-[#737c82]">
            treated with their hairfall.
          </p>
          <p className="hair-health mt-[10px] text-[clamp(20px,1.875vw,30px)] leading-[1.2] font-normal tracking-[-0.015em] text-brand">
            It&apos;s time to know your
            <br />
            hair health
          </p>
        </div>
      </div>
      <div className="hero-model w-1/2 overflow-hidden [background:linear-gradient(135deg,transparent_0%,transparent_34%,#ed1f24_34%,#c91b22_70%,#f4b0ac_70%,#f4b0ac_87%,transparent_87%)] [&_img]:h-[479px] [&_img]:w-[426px] [&_img]:object-contain min-[1200px]:pl-2 max-[768px]:w-full max-[768px]:text-center max-[768px]:[&_img]:h-auto max-[768px]:[&_img]:w-[250px] max-[768px]:[&_img]:max-w-[250px]">
        <img
          src={asset("hair-evaluvation-2.png")}
          alt="Doctor in a white coat for hair evaluation."
          className="origin-center scale-[1.1]"
          width="426"
          height="479"
          fetchPriority="high"
        />
      </div>
    </section>
  );
}
