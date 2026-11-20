import { BrandLogo } from "./brand-logo";
import { clinicPhone } from "@/lib/contact";
import { ConsultationTrigger } from "../consultation/consultation-provider";
export function SiteHeader() {
  return (
    <header className="site-header relative z-10 h-[102px] border-y border-solid border-[#efd9d7] bg-[#fffaf9] text-brand-dark max-[992px]:h-16">
      <div className="header-inner relative mx-auto flex h-full max-w-[1340px] items-center gap-7 min-[992px]:max-[1200px]:max-w-[960px] min-[992px]:max-[1200px]:gap-4 max-[992px]:gap-[15px] max-[992px]:px-[15px] max-[361px]:gap-2 max-[361px]:px-2.5">
        <a
          className="brand mr-auto shrink-0"
          href="/"
          aria-label="Adglow Rajaji home"
        >
          <BrandLogo />
        </a>
        <div className="header-actions flex items-center gap-3 max-[992px]:gap-1.5">
          <ConsultationTrigger
            source="Header Book Your Consultation"
            className="book-button rounded bg-brand-gradient px-[13px] py-2 text-[15px] font-medium whitespace-nowrap text-white max-[992px]:rounded-none max-[992px]:p-[5px] max-[992px]:text-[13px] max-[361px]:text-[12px]"
          >
            <span className="max-[992px]:hidden">Book Your Consultation</span>
            <span className="hidden max-[992px]:inline">Book Now</span>
          </ConsultationTrigger>
          <a
            className="call-button rounded bg-brand px-[13px] py-2 text-[15px] font-medium whitespace-nowrap text-white max-[992px]:rounded-none max-[992px]:border max-[992px]:border-solid max-[992px]:border-brand max-[992px]:bg-transparent max-[992px]:p-[5px] max-[992px]:text-[13px] max-[992px]:text-brand max-[361px]:text-[12px]"
            href={clinicPhone.href}
          >
            <span className="desktop-call max-[992px]:hidden">Call Now</span>
            <span className="mobile-call hidden max-[992px]:inline">
              ☎ {clinicPhone.display}
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
