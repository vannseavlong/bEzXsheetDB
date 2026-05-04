import { getAvatarFallbackText } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useRef, useState } from 'react';

export default function ColumnUserInfo({ name, image }: { name: string; image: string }) {
  const [isHovered, setIsHovered] = useState(false);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  return (
    <div className="flex flex-row items-center gap-2">
      <div ref={containerRef}>
        <Avatar className="size-14">
          <AvatarImage
            src={image}
            alt={name}
            className="object-cover cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          />
          <AvatarFallback>{getAvatarFallbackText(name)}</AvatarFallback>
        </Avatar>
      </div>
      <div>{name}</div>
      {/* Preview Image */}
      {isHovered && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: mousePosition.x + 20,
            bottom: mousePosition.y,
            transform: 'translateY(-50%)'
          }}
        >
          <div className="relative bg-card border border-border rounded-lg shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
            <img src={image} alt={image} width={300} height={200} className="object-cover" />
          </div>
        </div>
      )}
    </div>
  );
}
