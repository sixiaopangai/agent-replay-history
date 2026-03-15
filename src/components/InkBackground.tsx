interface InkCircle {
  position: string; // e.g. 'top-0 right-0'
  size: string;     // e.g. 'w-[400px] h-[400px]'
  color: string;    // e.g. 'rgba(139,26,26,0.06)'
}

interface InkBackgroundProps {
  circles: InkCircle[];
}

export default function InkBackground({ circles }: InkBackgroundProps) {
  return (
    <>
      {circles.map((c, i) => (
        <div
          key={i}
          className={`absolute ${c.position} ${c.size} rounded-full`}
          style={{ background: `radial-gradient(circle, ${c.color} 0%, transparent 60%)` }}
        />
      ))}
    </>
  );
}
