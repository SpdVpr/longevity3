'use client';

import { Supplement } from '../../types';

interface SupplementPlaceholderProps {
  supplement: Supplement;
}

export default function SupplementPlaceholder({ supplement }: SupplementPlaceholderProps) {
  // Generate a consistent color based on the supplement name
  const getColorFromName = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Generate hue in the teal/turquoise range (160-190)
    const h = 160 + (Math.abs(hash) % 30);
    return `hsl(${h}, 70%, 45%)`;
  };

  const backgroundColor = getColorFromName(supplement.name);

  return (
    <div
      className="relative w-full h-full flex items-center justify-center"
      style={{ backgroundColor }}
    >
      <div className="text-white text-center p-4">
        <div className="text-5xl font-bold mb-2">
          {supplement.name.charAt(0)}
        </div>
        <div className="text-xl font-medium">
          {supplement.name}
        </div>
      </div>
    </div>
  );
}
