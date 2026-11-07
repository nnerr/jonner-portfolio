// How SmishX judges a link, drawn as a numbered ink diagram. The steps come
// straight from the thesis (chapter 1.3 to 1.7).

const labelText = { fontFamily: "var(--font-jost), sans-serif", fontWeight: 500 };

function StackDiagram() {
  return (
    <svg
      viewBox="0 0 420 108"
      className="mt-3 w-full max-w-[420px]"
      role="img"
      aria-label="Random Forest and XGBoost both feed a Logistic Regression model, which gives the verdict."
    >
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0L10 5L0 10z" fill="var(--ink)" />
        </marker>
      </defs>
      <g fill="var(--paper-deep)" stroke="var(--ink)" strokeWidth={1.5}>
        <rect x={4} y={8} width={128} height={34} />
        <rect x={4} y={66} width={128} height={34} />
        <rect x={196} y={37} width={150} height={34} />
      </g>
      <g fill="none" stroke="var(--ink)" strokeWidth={1.5} markerEnd="url(#arrow)">
        <path d="M134 25C166 25 166 50 192 50" />
        <path d="M134 83C166 83 166 58 192 58" />
        <path d="M348 54H412" />
      </g>
      <g fontSize={16} textAnchor="middle" fill="var(--ink)" style={labelText}>
        <text x={68} y={30}>Random Forest</text>
        <text x={68} y={88}>XGBoost</text>
        <text x={271} y={59}>Logistic Regression</text>
      </g>
      <text x={382} y={44} fontSize={14} textAnchor="middle" fill="var(--seal)" style={labelText}>
        verdict
      </text>
    </svg>
  );
}

const steps = [
  {
    title: "A text arrives",
    body: "The Android app, written in Kotlin, reads each incoming SMS and pulls out any link.",
  },
  {
    title: "Unshorten the link",
    body: "The model's API server expands shortened URLs so it judges the real destination.",
  },
  {
    title: "Read the URL",
    body: "It extracts 80 features: entropy and character diversity, long ID strings, the domain, subdomain, path and query, plus TF-IDF over the URL's text.",
  },
  {
    title: "A stacked vote",
    body: "Random Forest and XGBoost each judge the URL, and a Logistic Regression model combines their answers.",
    diagram: true,
  },
  {
    title: "The verdict",
    body: "The app marks the link legitimate or phishing, shows details about it, and can block it from opening.",
  },
];

export function SmishxPipeline() {
  return (
    <figure className="mt-2">
      <ol className="pipeline">
        {steps.map((step) => (
          <li key={step.title}>
            <p className="font-label text-[1.15rem] leading-tight">{step.title}</p>
            <p className="mt-1 text-[1rem] leading-relaxed text-ink-soft">{step.body}</p>
            {step.diagram && <StackDiagram />}
          </li>
        ))}
      </ol>
      <figcaption className="mt-3 text-[0.92rem] italic text-ink-soft">
        How SmishX checks a link, from the text message to the verdict.
      </figcaption>
    </figure>
  );
}
