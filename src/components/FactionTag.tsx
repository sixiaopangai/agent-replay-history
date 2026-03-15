'use client';

interface FactionTagProps {
  label: string;
  color: string;
  bgColor?: string;
  icon?: string;
}

export default function FactionTag({ label, color, bgColor, icon }: FactionTagProps) {
  return (
    <span
      className="tag-ancient"
      style={{
        color,
        borderColor: color,
        background: bgColor || `color-mix(in srgb, ${color} 8%, transparent)`,
      }}
    >
      {icon && <>{icon} </>}{label}
    </span>
  );
}
