function YarnLoader({ text = "Loading..." }) {
  return (
    <div className="yarn-loader" role="status" aria-live="polite">
      <svg viewBox="0 0 130 90" width="130" height="90" aria-hidden="true">
        <defs>
          <clipPath id="yarnClip">
            <circle cx="40" cy="45" r="26" />
          </clipPath>
        </defs>
        <g className="yarn-ball">
          <circle cx="40" cy="45" r="26" fill="#d98c8c" />
          <g clipPath="url(#yarnClip)" fill="none" stroke="#a35353" strokeWidth="2" opacity="0.65">
            <path d="M8 30 Q40 55 76 24" />
            <path d="M6 44 Q40 68 78 38" />
            <path d="M10 58 Q42 80 76 52" />
            <path d="M22 16 Q50 40 30 76" />
            <path d="M44 14 Q70 42 46 78" />
          </g>
        </g>
        <path
          className="yarn-thread"
          pathLength="100"
          d="M64 54 C78 66, 90 40, 104 56 S122 72, 126 66"
        />
      </svg>
      <p>{text}</p>
    </div>
  );
}

export default YarnLoader;