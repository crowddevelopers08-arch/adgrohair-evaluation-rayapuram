# Hair evaluation test

A component-based React + Next.js reproduction of https://www.drbatras.com/hair-evaluation-test.

Run `npm run dev` and open http://localhost:3000. Run `npm run build` for the production build.

The flow is contact details → age and gender → ten questions → thank-you and treatment results. Single-choice questions advance after 300 ms. Lifestyle and hair goals require at least one selection. The male lifestyle “None of the above” option is exclusive. Male medical “Yes” requires a description. Female hair patterns, lifestyle choices, portraits and medical options follow the reference. Previous navigation preserves answers.

`components/evaluation/` contains the header, hero, contact step, demographics, progress, question renderer, results, information copy and FAQ accordion. `lib/evaluation.ts` contains the original question labels, answer values and validation. Images, backgrounds and font weights are served locally from `public/assets/`.

All component styling uses inline Tailwind CSS v4 utility classes in JSX, including responsive breakpoints, selected states and focus behavior. `app/globals.css` contains Tailwind imports, theme tokens, local font definitions, base resets and the shared entry animation. The existing Tailwind Turbopack integration in `next.config.ts` compiles the utilities.

## Backend boundary

The complete browser flow works locally. Contact details and answers live only in React memory and reset on refresh. No information is sent to Dr Batra?s or another service. The original page uses private PHP endpoints (`save-lead.php` and `save-test.php`) for lead capture and server-generated scores. Those endpoints and their scoring algorithm are not available in this project. Lead storage and email delivery still require your own backend integration. The header shows the clinic logo and call link, without navigation menus or search. Treatment cards do not show booking buttons.

## Score calculation

`lib/hair-score.ts` provides a deterministic, local, **indicative self-assessment**, not the original provider?s algorithm or a clinically validated measurement. The score is 100 minus the concern points below, clamped to 0?100. The screenshot?s 29 is an example, never a hardcoded result.

| Questionnaire item | Concern points                                      |
| ------------------ | --------------------------------------------------- |
| Hairfall duration  | 0 / 5 / 10 / 3 for the four listed options          |
| Daily shedding     | 0 / 12 / 25                                         |
| Dandruff           | Yes 10; no 0                                        |
| Hair-loss pattern  | 0 / 8 / 17 / 25 for equivalent male/female stages   |
| Lifestyle          | 2 per selected concern, capped at 10; male ?None? 0 |
| Family history     | Mother 5; father 5; both 10; none 0                 |
| Medical condition  | Male ?No? 0; reported condition 10                  |

Age, contact information, confidence, supplement use and goals do not establish physical hair health and do not affect this local score. Female medical options match the original form and all report a condition. Incomplete or invalid questionnaires cannot generate a score. Scores below 40 display the supplied screenshot?s message, 40?69 show a ?some concerns? message, and 70?100 show a ?fewer reported concerns? message. Each result includes the entered name, score out of 100, appointment link to +91 73580 34097 and a brief indicative-score label. `components/evaluation/score-summary.tsx` renders this section with inline Tailwind classes.

Replace the local rules with an approved formula or your scoring API when available.

## Brand styling

The header uses the supplied `public/adglow-rajaji.png` directly. `BrandLogo` uses an SVG viewport to hide the transparent outer margins without modifying the PNG. Shared Tailwind tokens in `app/globals.css` define the logo palette: accent red `#ED1F24`, readable primary red `#C91B22`, charcoal `#231F20`, and soft red surfaces. Hero ribbons, buttons, selected options, progress and result headings use this palette.

## Gender-specific imagery

`lib/gender-media.ts` maps each selected gender to its patient portrait and two before/after pairs. The banner keeps the fixed doctor image `/hair-evaluvation-2.png` for every selection; both treatment cards use the selected patient portrait; `TreatmentResults` renders only that gender's four result photos. Hair-pattern and confidence question illustrations also follow the selected gender. These reference photos come from [the original male page](https://www.drbatras.com/treatments/hair/male-pattern-baldness) and [female page](https://www.drbatras.com/treatments/hair/female-pattern-baldness), not Adglow patient records. Replace with clinic-owned photos before publishing as Adglow outcomes.

## Typography

The whole application uses the locally hosted Nunito variable font (weights 200-1000). `next/font/local` applies it directly to the body; Tailwind `font-sans` uses the same font variable. Headings and answer options use sentence case, with increased paragraph leading for comfortable reading. Work Sans and Inter are no longer loaded. The font license is included in `public/assets/nunito-OFL.txt`.

## Consultation popup

The result-page Book Your Consultation button opens the accessible consultation dialog. Header and result-page Call Now links dial +91 73580 34097 directly and do not open the form. Evaluation Next, Continue, Submit and Previous keep their existing behavior. The dialog is opened only by these CTAs, with no automatic opening timer. A completed profile pre-fills name and phone.

`components/consultation/` contains the provider/trigger, dialog and five-stage artwork. The reference [consultation design](https://www.adgrohairroyapuram.in/) supplied the exact offer image, badges and stage illustrations. The reference image host returned HTTP 429 during verification, so popup images are served from `public/consultation/`. The five original stage illustrations use SVG viewports into a verified local reference-render atlas to avoid the throttled CDN. Outfit is self-hosted only for the popup, with its license in `app/fonts/outfit-OFL.txt`; the rest of the site retains Nunito.

The popup validates name, Indian mobile number, concern, six-digit pincode and stage, then posts to the existing `/api/submissions` endpoint. Concern, pincode, stage and trigger source are included in the saved concern text and structured consultation answers. Success is shown only when at least one configured destination confirms the save (database, Sheets or TeleCRM). Failed/unconfirmed saves offer retry and the existing clinic phone link.

Run `node scripts/verify-consultation.cjs` with Playwright available. Optional environment variables: `PLAYWRIGHT_MODULE`, `CHROMIUM_PATH`, `BASE_URL`. Checks cover desktop/mobile artwork, validation, failed and confirmed saves, loading, close/Escape/backdrop interactions, focus restoration, profile prefill, result CTAs and preservation of all ten evaluation questions. Every submission is mocked; the checks do not create real leads.
