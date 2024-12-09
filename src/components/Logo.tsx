import React from "react";
import { RiTerminalBoxFill } from "react-icons/ri";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl",
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <RiTerminalBoxFill
        className={`${sizes[size]} text-neon-green animate-pulse`}
      />
      <span
        className={`font-pixel ${sizes[size]} text-neon-green animate-text-glow`}
      >
        RETRO.FEED
      </span>
    </div>
  );
};

export default Logo;
