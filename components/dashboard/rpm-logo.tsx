export function RpmLogo({ size = 32 }: { size?: number }) {
  return (
    <svg aria-hidden="true" height={size} viewBox="0 0 32 32" width={size}>
      <rect fill="currentColor" height="32" rx="8" width="32" />
      <path
        d="M6.75 17.25h4.45l2.5-6.75 3.7 12.7 2.7-5.95h3.1"
        fill="none"
        stroke="var(--accent)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
      <circle cx="25.15" cy="17.25" fill="var(--accent)" r="1.7" />
    </svg>
  );
}
