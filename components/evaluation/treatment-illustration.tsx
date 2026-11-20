import type { hairTreatments } from "@/lib/treatments";

// Brand-coloured illustrations of each hair treatment, drawn as inline SVG so
// every treatment card shows imagery that matches its content.
const RED = "#c91b22";
const DARK = "#231f20";
const HAIR = "#3a2a26";

type TreatmentName = (typeof hairTreatments)[number]["name"];

type Follicle = { x: number; h: number; dim?: boolean };

function Scalp({ follicles }: { follicles: Follicle[] }) {
  return (
    <g>
      <path d="M0 122 Q75 114 150 122 T300 122 V186 H0Z" fill="#f6dccf" />
      <path
        d="M0 122 Q75 114 150 122 T300 122 V133 Q225 141 150 133 T0 133Z"
        fill="#efc3ae"
      />
      {follicles.map(({ x, h, dim }) => (
        <g key={x} opacity={dim ? 0.55 : 1}>
          <ellipse cx={x} cy={156} rx={4.5} ry={7} fill="#e3a994" />
          {h > 0 && (
            <path
              d={`M${x} 156 C${x} 140 ${x - 1} 128 ${x + 3} ${120 - h}`}
              fill="none"
              stroke={HAIR}
              strokeWidth={2.4}
              strokeLinecap="round"
            />
          )}
        </g>
      ))}
    </g>
  );
}

function Glow({ x, y, r = 4 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r * 2.2} fill={RED} opacity={0.18} />
      <circle cx={x} cy={y} r={r} fill={RED} />
    </g>
  );
}

function Gfc() {
  return (
    <>
      <Scalp
        follicles={[40, 75, 110, 145, 180, 215, 250].map((x, i) => ({
          x,
          h: 20 + (i % 3) * 7,
        }))}
      />
      {/* vial */}
      <rect x={22} y={14} width={36} height={58} rx={7} fill="#fff" stroke={DARK} strokeWidth={2} />
      <rect x={22} y={38} width={36} height={34} rx={6} fill={RED} opacity={0.85} />
      <rect x={26} y={6} width={28} height={12} rx={3} fill={DARK} />
      <text x={40} y={60} textAnchor="middle" fontSize={11} fontWeight={700} fill="#fff">
        GFC
      </text>
      {/* growth factors travelling to the follicles */}
      <path d="M62 50 C100 40 120 70 130 110" fill="none" stroke={RED} strokeWidth={1.6} strokeDasharray="3 5" />
      <Glow x={92} y={52} r={3} />
      <Glow x={118} y={78} r={3.5} />
      <Glow x={132} y={106} r={3} />
      <Glow x={110} y={148} r={4} />
      <Glow x={145} y={150} r={4} />
      <Glow x={180} y={150} r={4} />
      <text x={205} y={55} fontSize={20} fontWeight={700} fill={RED} opacity={0.6}>
        +
      </text>
      <text x={240} y={80} fontSize={14} fontWeight={700} fill={RED} opacity={0.5}>
        +
      </text>
    </>
  );
}

function PlasmaGrowthFactors() {
  return (
    <>
      <Scalp
        follicles={[120, 150, 180, 210, 240, 270].map((x, i) => ({
          x,
          h: 18 + (i % 2) * 8,
        }))}
      />
      {/* centrifuge tube with separated plasma layers */}
      <path d="M26 16 H62 V110 Q62 134 44 134 Q26 134 26 110 Z" fill="#fff" stroke={DARK} strokeWidth={2} />
      <path d="M27 100 H61 V110 Q61 133 44 133 Q27 133 27 110 Z" fill="#9f141a" />
      <rect x={27} y={58} width={34} height={42} fill="#f3d37a" />
      <rect x={27} y={42} width={34} height={16} fill="#fbeab0" />
      <rect x={22} y={10} width={44} height={10} rx={3} fill={DARK} />
      <text x={44} y={86} textAnchor="middle" fontSize={11} fontWeight={700} fill={DARK}>
        PRGF
      </text>
      <path d="M72 70 H100" stroke={RED} strokeWidth={2.4} strokeLinecap="round" />
      <path d="M94 63 L102 70 L94 77" fill="none" stroke={RED} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      {/* syringe injecting plasma into the scalp */}
      <g transform="translate(168 126) rotate(28)">
        <rect x={-9} y={-82} width={18} height={50} rx={3} fill="#fff" stroke={DARK} strokeWidth={2} />
        <rect x={-9} y={-62} width={18} height={30} fill="#f3d37a" />
        <rect x={-3} y={-104} width={6} height={22} fill={DARK} />
        <rect x={-14} y={-108} width={28} height={6} rx={3} fill={DARK} />
        <rect x={-13} y={-34} width={26} height={5} rx={2} fill={DARK} />
        <path d="M0 -29 V0" stroke={DARK} strokeWidth={2} strokeLinecap="round" />
      </g>
      <circle cx={170} cy={142} r={5} fill="#f3d37a" stroke="#d9b24a" />
      <circle cx={156} cy={150} r={3.5} fill="#f3d37a" stroke="#d9b24a" />
    </>
  );
}

function Ht() {
  return (
    <>
      <Scalp
        follicles={[
          { x: 36, h: 0, dim: true },
          { x: 66, h: 0, dim: true },
          { x: 96, h: 0, dim: true },
          { x: 126, h: 9 },
          { x: 156, h: 11 },
          { x: 196, h: 30 },
          { x: 226, h: 34 },
          { x: 256, h: 30 },
        ]}
      />
      {/* highlight the newly placed grafts */}
      <circle cx={126} cy={154} r={13} fill="none" stroke={RED} strokeWidth={2} strokeDasharray="4 3" />
      <circle cx={156} cy={154} r={13} fill="none" stroke={RED} strokeWidth={2} strokeDasharray="4 3" />
      {/* donor -> bald area transfer */}
      <path d="M236 70 C200 20 120 20 100 66" fill="none" stroke={RED} strokeWidth={2.4} strokeLinecap="round" strokeDasharray="1 7" />
      <path d="M92 58 L100 68 L108 58" fill="none" stroke={RED} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      {/* graft */}
      <ellipse cx={236} cy={80} rx={6} ry={9} fill="#e3a994" stroke={RED} strokeWidth={1.6} />
      <path d="M236 72 C236 62 237 56 240 50" fill="none" stroke={HAIR} strokeWidth={2.4} strokeLinecap="round" />
      <text x={66} y={40} textAnchor="middle" fontSize={11} fontWeight={700} fill={DARK} opacity={0.65}>
        BALD AREA
      </text>
    </>
  );
}

function Mesotherapy() {
  const xs = [96, 126, 156, 186, 216];
  return (
    <>
      <Scalp
        follicles={[40, 70, 111, 141, 171, 201, 231, 262].map((x, i) => ({
          x,
          h: 20 + (i % 3) * 6,
        }))}
      />
      {/* multi-needle mesotherapy injector */}
      <rect x={76} y={14} width={160} height={30} rx={10} fill="#fff" stroke={DARK} strokeWidth={2} />
      <rect x={86} y={22} width={140} height={14} rx={6} fill={RED} opacity={0.85} />
      <rect x={140} y={6} width={32} height={10} rx={3} fill={DARK} />
      {xs.map((x) => (
        <g key={x}>
          <path d={`M${x} 44 V134`} stroke={DARK} strokeWidth={1.8} strokeLinecap="round" />
          <circle cx={x} cy={142} r={4} fill={RED} opacity={0.85} />
          <circle cx={x} cy={142} r={9} fill={RED} opacity={0.15} />
        </g>
      ))}
    </>
  );
}

function Olt() {
  return (
    <>
      <Scalp
        follicles={[60, 95, 130, 165, 200, 235].map((x, i) => ({
          x,
          h: 18 + (i % 3) * 7,
        }))}
      />
      {[60, 95, 130, 165, 200, 235].map((x) => (
        <circle key={x} cx={x} cy={156} r={11} fill="#ed1f24" opacity={0.22} />
      ))}
      {/* Scalp support: a neutral care symbol without implying a specific device. */}
      <path d="M150 12 L180 24 V48 Q180 72 150 88 Q120 72 120 48 V24 Z" fill="#fff" stroke={RED} strokeWidth={2.4} />
      <path d="M138 48 L147 57 L164 37" fill="none" stroke={RED} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M95 61 Q71 79 78 102 M205 61 Q229 79 222 102" fill="none" stroke={RED} strokeWidth={2} strokeLinecap="round" />
      <Glow x={78} y={104} r={3} />
      <Glow x={222} y={104} r={3} />
    </>
  );
}

const scenes: Record<TreatmentName, () => React.JSX.Element> = {
  GFC: Gfc,
  "Plasma Rich in Growth Factors": PlasmaGrowthFactors,
  HT: Ht,
  Mesotherapy,
  OLT: Olt,
};

const descriptions: Record<TreatmentName, string> = {
  GFC: "Growth-factor preparation supporting hair follicles",
  "Plasma Rich in Growth Factors": "Growth-factor-rich plasma preparation and scalp application",
  HT: "Healthy hair follicles relocated into a thinning area",
  Mesotherapy: "Targeted nutrients delivered to the scalp",
  OLT: "Non-surgical scalp care and follicle support",
};

export function TreatmentIllustration({ name }: { name: TreatmentName }) {
  const Scene = scenes[name];
  return (
    <svg
      viewBox="0 0 300 186"
      role="img"
      aria-label={`${name}: ${descriptions[name]}`}
      className="block aspect-[300/186] w-full bg-[#eceeef]"
    >
      <Scene />
    </svg>
  );
}
