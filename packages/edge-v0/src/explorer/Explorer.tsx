import React, { useEffect, useState, useRef } from "react";
import { useTurboEdgeV0 } from "../hooks/useTurboEdgeV0";
import TurboIcon from "./assets/TurboIcon";
import Loading from "./Loading";
import Error from "./Error";

interface ExplorerProps {
  sessionId?: string;
  gameId?: string;
  baseUrl?: string;
  iconSize?: number;
  iconColor?: string;
  customIcon?: React.ReactNode;
  position?:
    | { top: string; left?: string; right?: never; bottom?: never }
    | { bottom: string; left?: string; right?: never; top?: never }
    | { left: string; top?: string; bottom?: never; right?: never }
    | { right: string; top?: string; bottom?: never; left?: never }
    | string;
  buttonStyle?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  iframeStyle?: React.CSSProperties;
  iframeAttributes?: React.IframeHTMLAttributes<HTMLIFrameElement>;
  onOpen?: () => void;
  onClose?: () => void;
  onIframeError?: (error: string) => void;
  errorStyle?: React.CSSProperties;
  children?: React.ReactNode;
}

export function Explorer({
  sessionId: propSessionId,
  gameId: propGameId,
  baseUrl = "https://explorer.turbo.ing",
  iconSize = 18,
  iconColor = "#F13938",
  customIcon,
  position = { top: "1.25rem", left: "0" },
  buttonStyle = {},
  containerStyle = {},
  iframeStyle = {},
  iframeAttributes = {},
  errorStyle = {},
  onOpen,
  onClose,
  onIframeError,
  children,
}: ExplorerProps) {
  const turboEdge = useTurboEdgeV0();

  const [sessionId, setSessionId] = useState<string | null>(propSessionId || null);
  const [gameId, setGameId] = useState<string | null>(propGameId || null);
  const [iframeUrl, setIframeUrl] = useState<string>("");
  const [iframeError, setIframeError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [splitPosition, setSplitPosition] = useState<number>(50);
  const [dragging, setDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isDragging = useRef(false);

  useEffect(() => {
    setSessionId(propSessionId || turboEdge?.sessionId || null);
  }, [propSessionId, turboEdge?.sessionId]);

  useEffect(() => {
    setGameId(propGameId || turboEdge?.gameId || null);
  }, [propGameId, turboEdge?.gameId]);

  useEffect(() => {
    if (sessionId) {
      setIframeUrl(`${baseUrl}/session/${sessionId}`);
      setIframeError(null);
      setIsLoading(true);
    } else if (gameId) {
      setIframeUrl(`${baseUrl}/game/${gameId}`);
      setIframeError(null);
      setIsLoading(true);
    } else {
      setIframeUrl("");
      setIframeError("No gameId or sessionId detected");
    }
  }, [sessionId, gameId, baseUrl]);

  const handleClick = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) onOpen?.();
    else onClose?.();
  };

  useEffect(() => {
    const handleIframeMessage = (event: MessageEvent) => {
      if (event.data.type === "iframe-message") {
        setIframeError(event.data.message);
        onIframeError?.(event.data.message);
      }
    };

    window.addEventListener("message", handleIframeMessage);
    return () => {
      window.removeEventListener("message", handleIframeMessage);
    };
  }, [onIframeError]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    setDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging.current) {
      const newSplit = (e.clientX / window.innerWidth) * 100;
      setSplitPosition(Math.min(80, Math.max(20, newSplit)));
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    setDragging(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (dragging) {
      document.body.style.userSelect = "none";
    } else {
      document.body.style.userSelect = "";
    }
  }, [dragging]);

  const resolvedPosition = typeof position === "string" ? {} : position;
  const transitionStyle = dragging ? "none" : "flex-basis 0.3s ease";

  return (
    <div>
      <button
        onClick={handleClick}
        style={{
          position: "absolute",
          padding: "5px",
          borderTopRightRadius: "0.5rem",
          borderBottomRightRadius: "0.5rem",
          background: "#FFFFFF",
          zIndex: 9999,
          ...resolvedPosition,
          ...buttonStyle,
        }}
      >
        {customIcon || <TurboIcon size={iconSize} color={iconColor} />}
      </button>

      <div
        style={{
          display: "flex",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 9998,
          width: "100%",
          height: "100%",
          flexDirection: "row",
          ...containerStyle,
        }}
      >
        <div
          style={{
            flexBasis: isOpen ? `${splitPosition}%` : "0%",
            flexGrow: 0,
            flexShrink: 0,
            overflow: "hidden",
            transition: transitionStyle,
            display: "block",
            background: "#FFF",
          }}
        >
          {iframeError ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                textAlign: "center",
                color: "#F13938",
                backgroundColor: "#FFFFFF",
                ...errorStyle,
              }}
            >
              <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem", fontWeight: 500 }}>
                Error Loading Explorer
              </h1>
              <p style={{ fontSize: "1rem" }}>{iframeError}</p>
            </div>
          ) : (
            isOpen && (
              <>
                {isLoading && <Loading />}
                <iframe
                  src={iframeUrl}
                  title="Turbo Explorer"
                  onLoad={() => setIsLoading(false)}
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    pointerEvents: dragging ? "none" : "auto",
                    display: isLoading ? "none" : "block", // Hide iframe while loading
                    ...iframeStyle,
                  }}
                  {...iframeAttributes}
                />
              </>
            )
          )}
        </div>

        {isOpen && (
          <div
            onMouseDown={handleMouseDown}
            style={{
              width: "3px",
              cursor: "col-resize",
              backgroundColor: "#ccc",
              flexShrink: 0,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: "10px",
                height: "28px",
                borderRadius: "8px",
                backgroundColor: "#999",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-evenly",
                boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                padding: "2px",
              }}
            >
              <div
                style={{
                  width: "3px",
                  height: "3px",
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                }}
              />
              <div
                style={{
                  width: "3px",
                  height: "3px",
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                }}
              />
              <div
                style={{
                  width: "3px",
                  height: "3px",
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                }}
              />
            </div>
          </div>
        )}

        <div
          style={{
            flexBasis: isOpen ? `${100 - splitPosition}%` : "100%",
            flexGrow: 0,
            flexShrink: 0,
            overflow: "auto",
            transition: transitionStyle,
            backgroundColor: "transparent",
            color: "inherit",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}