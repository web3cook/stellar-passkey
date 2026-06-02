interface SealLogoProps {
  size?: number
  bgColor?: string
  ringColor?: string
  textColor?: string
}

export function SealLogo({
  size = 220,
  bgColor = '#0a1840',
  ringColor = '#ffffff',
  textColor = '#ffffff',
}: SealLogoProps) {
  const cx = 110
  const cy = 110
  const outerR = 107
  const innerR = 77
  const topTextR = 88    // ascenders go outward → baseline closer to center
  const bottomTextR = 96 // ascenders go inward  → baseline closer to outer ring
  const dotR = 92        // decorative dots at band centre
  const imageR = 74

  const topArc = `M ${cx - topTextR},${cy} A ${topTextR},${topTextR} 0 0,1 ${cx + topTextR},${cy}`
  const bottomArc = `M ${cx - bottomTextR},${cy} A ${bottomTextR},${bottomTextR} 0 0,0 ${cx + bottomTextR},${cy}`

  return (
    <svg viewBox="0 0 220 220" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="sealImgClip">
          <circle cx={cx} cy={cy} r={imageR} />
        </clipPath>
        <path id="sealTopArc" d={topArc} />
        <path id="sealBottomArc" d={bottomArc} />
      </defs>

      {/* Outer filled circle */}
      <circle cx={cx} cy={cy} r={outerR} fill={bgColor} />

      {/* Outer decorative dashed ring */}
      <circle cx={cx} cy={cy} r={outerR - 2} fill="none" stroke={ringColor} strokeWidth="0.8" strokeOpacity="0.25" strokeDasharray="4 3" />

      {/* Inner separator ring */}
      <circle cx={cx} cy={cy} r={innerR} fill="none" stroke={ringColor} strokeWidth="1.2" strokeOpacity="0.35" />

      {/* Seal image, clipped to circle */}
      <image
        href="/logo1.jpeg"
        x={cx - imageR}
        y={cy - imageR}
        width={imageR * 2}
        height={imageR * 2}
        clipPath="url(#sealImgClip)"
        preserveAspectRatio="xMidYMid slice"
      />

      {/* Decorative dots at 9 and 3 o'clock (between text arcs) */}
      <circle cx={cx - dotR} cy={cy} r="2.5" fill={textColor} fillOpacity="0.6" />
      <circle cx={cx + dotR} cy={cy} r="2.5" fill={textColor} fillOpacity="0.6" />

      {/* Top arc text: SEALPASS · SMART WALLET */}
      <text
        fill={textColor}
        fontSize="11.5"
        fontWeight="700"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="2.5"
      >
        <textPath href="#sealTopArc" startOffset="50%" textAnchor="middle">
          SEALPASS · SMART WALLET
        </textPath>
      </text>

      {/* Bottom arc text: BUILT ON STELLAR */}
      <text
        fill={textColor}
        fontSize="10"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="2"
        fillOpacity="0.75"
      >
        <textPath href="#sealBottomArc" startOffset="50%" textAnchor="middle">
          · BUILT ON STELLAR ·
        </textPath>
      </text>
    </svg>
  )
}
