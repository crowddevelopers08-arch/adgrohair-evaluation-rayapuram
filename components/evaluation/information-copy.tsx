const hairConcerns = [
  {
    title: "Hair Fall",
    text: "Are you losing more hair than usual or noticing increased shedding?",
  },
  {
    title: "Hair Thinning",
    text: "Has your hair density reduced or is more of your scalp becoming visible?",
  },
  {
    title: "Receding Hairline",
    text: "Are you noticing changes around your temples or hairline?",
  },
  {
    title: "Crown Thinning",
    text: "Is the hair around your crown becoming noticeably thinner?",
  },
  {
    title: "Scalp Concerns",
    text: "Dealing with dandruff, itching, dryness, excess oiliness, or scalp discomfort?",
  },
  {
    title: "Long-Term Hair Concerns",
    text: "Have you been dealing with the same hair problem for months or even years?",
  },
];

export function InformationCopy() {
  return (
    <article className="information-copy text-left">
      <h2 className="ail-head">What&rsquo;s Really Happening With Your Hair?</h2>
      <p>Hair fall doesn&rsquo;t always look the same.</p>
      <p>
        It could start with a few extra strands on your pillow, a receding
        hairline, thinning around the crown, or a scalp that suddenly feels
        different.
      </p>
      <p>
        But when these changes continue, the important question is:{" "}
        <b>What could be contributing to your hair concern?</b>
      </p>
      <p>
        Our Hair Health Evaluation helps you understand your current hair and
        scalp concerns through a simple online assessment. Answer a few
        questions about your hair, scalp, lifestyle, and hair-loss pattern to
        get personalised insights before deciding what to do next.
      </p>

      <h2 className="ail-head mt-8">Start With Understanding Your Hair</h2>
      <p>
        Instead of trying one product after another, begin by understanding what
        you&rsquo;re actually experiencing. The evaluation helps you look at:
      </p>
      <div className="mt-4 grid gap-4 min-[768px]:grid-cols-2">
        {hairConcerns.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-solid border-brand-border bg-white p-4"
          >
            <h3 className="!mb-1 !font-semibold text-brand-dark">{item.title}</h3>
            <p className="!mb-0 text-[16px] leading-[1.6]">{item.text}</p>
          </div>
        ))}
      </div>

      <h2 className="ail-head mt-8">
        Your Hair Concern Is Personal. Your Approach Should Be Too.
      </h2>
      <p>
        There isn&rsquo;t one reason behind every case of hair fall or thinning.
      </p>
      <p>
        That&rsquo;s why understanding your individual hair and scalp concerns
        matters before deciding on a treatment approach.
      </p>
      <p>
        If your evaluation suggests that your concern needs further attention,
        you can take the next step with a hair specialist who can assess your
        condition in greater detail.
      </p>

      <h2 className="ail-head mt-8">Don&rsquo;t Ignore Changes In Your Hair</h2>
      <p>
        Hair fall, thinning, and a changing hairline can be easy to overlook in
        the beginning.
      </p>
      <p>
        If you&rsquo;ve been noticing changes in your hair, take a few minutes
        to understand your current hair concerns.
      </p>
      <div className="mt-4 rounded-xl bg-brand-soft p-5 text-center">
        <p className="!mb-1 text-[22px] font-semibold text-brand">
          Start Your Hair Health Evaluation
        </p>
        <p className="!mb-0">
          Answer a few questions. Understand your hair better. Know your next
          step.
        </p>
      </div>
    </article>
  );
}
