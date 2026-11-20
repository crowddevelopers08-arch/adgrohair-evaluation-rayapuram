// The reference CDN throttles these five illustrations. Reuse the verified
// reference render as a local sprite: SVG viewports display only each original
// stage illustration, without recreating or changing its artwork.
const stageX = [569, 740.390625, 911.796875, 1083.1875, 1254.59375];

export function HairStageIllustration({ index }: { index: number }) {
  return (
    <svg
      viewBox={`${stageX[index]} 280.796875 149.4 149.4`}
      aria-hidden="true"
      className="mb-0.5 block aspect-square h-auto w-full"
      data-stage-illustration={index + 1}
    >
      <image href="/consultation/stage-atlas.png" width="1490" height="690" />
    </svg>
  );
}
