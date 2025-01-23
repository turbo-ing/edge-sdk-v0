import React from "react";
import TurboIcon from "./assets/TurboIcon";

interface ExplorerToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
  customIcon?: React.ReactNode;
  iconSize: number;
  iconColor: string;
  position?:
    | { top: string; left?: string; right?: never; bottom?: never }
    | { bottom: string; left?: string; right?: never; top?: never }
    | { left: string; top?: string; bottom?: never; right?: never }
    | { right: string; top?: string; bottom?: never; left?: never }
    | string;
  buttonStyle?: React.CSSProperties;
}

const ExplorerToggleButton: React.FC<ExplorerToggleButtonProps> = ({
  isOpen,
  onClick,
  customIcon,
  iconSize,
  iconColor,
  position,
  buttonStyle,
}) => {
  // If position is an object, apply it; if it's a string, user handles themselves.
  const resolvedPosition = typeof position === "string" ? {} : position;

  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        padding: "5px",
        borderTopRightRadius: "0.5rem",
        borderBottomRightRadius: "0.5rem",
        background: "#FFFFFF",
        zIndex: 10000,
        filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))",
        ...resolvedPosition,
        ...buttonStyle,
      }}
      aria-expanded={isOpen}
    >
      {customIcon || <TurboIcon size={iconSize} color={iconColor} />}
    </button>
  );
};

export default ExplorerToggleButton;