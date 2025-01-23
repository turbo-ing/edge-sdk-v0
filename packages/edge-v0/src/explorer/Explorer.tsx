import React, { useEffect, useState, useRef } from "react";
import { ExplorerProps } from "./types";
import { useTurboEdgeV0 } from "../hooks/useTurboEdgeV0";

import ResizeHandle from "./ResizeHandle";
import IframeContainer from "./IframeContainer";
import ToggleButton from "./ToggleButton";

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

  const [sessionId, setSessionId] = useState<string | null>(
    propSessionId || null
  );
  const [gameId, setGameId] = useState<string | null>(propGameId || null);
  const [iframeUrl, setIframeUrl] = useState<string>("");
  const [iframeError, setIframeError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [splitPosition, setSplitPosition] = useState<number>(50); // as a %
  const [dragging, setDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isDraggingRef = useRef(false);

  // Determine if we have children
  const hasChildren = React.Children.count(children) > 0;

  // Sync sessionId with external changes / turboEdge
  useEffect(() => {
    setSessionId(propSessionId || turboEdge?.sessionId || null);
  }, [propSessionId, turboEdge?.sessionId]);

  // Sync gameId with external changes / turboEdge
  useEffect(() => {
    setGameId(propGameId || turboEdge?.gameId || null);
  }, [propGameId, turboEdge?.gameId]);

  // Determine iframe URL based on sessionId or gameId
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

  // Toggle open/close
  const handleToggleClick = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) onOpen?.();
    else onClose?.();
  };

  // Listen for iframe messages that might trigger errors
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

  // Draggable split logic (only relevant if we have children)
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hasChildren) return;
    e.preventDefault();
    isDraggingRef.current = true;
    setDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!hasChildren) return;
    if (isDraggingRef.current) {
      const newSplit = (e.clientX / window.innerWidth) * 100;
      // clamp to between [20%,80%]
      setSplitPosition(Math.min(80, Math.max(20, newSplit)));
    }
  };

  const handleMouseUp = () => {
    if (!hasChildren) return;
    isDraggingRef.current = false;
    setDragging(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [hasChildren]);

  // Disable text selection while dragging
  useEffect(() => {
    document.body.style.userSelect = dragging ? "none" : "";
  }, [dragging]);

  // We only transition if not dragging
  const transitionStyle = dragging ? "none" : "flex-basis 0.3s ease";

  return (
    <>
      {/* Toggle Button is always rendered */}
      <ToggleButton
        isOpen={isOpen}
        onClick={handleToggleClick}
        customIcon={customIcon}
        iconSize={iconSize}
        iconColor={iconColor}
        buttonStyle={buttonStyle}
        position={position}
      />

      {hasChildren ? (
        // Render the original split layout if we do have children
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            minWidth: "100%",
            minHeight: "100dvh",
            maxHeight: "100dvh",
            overflow: "hidden",
            ...containerStyle,
          }}
        >
          {/* Left (Iframe) Panel */}
          <div
            style={{
              flexBasis: isOpen ? `${splitPosition}%` : "0%",
              flexGrow: 0,
              flexShrink: 0,
              overflow: "auto",
              transition: transitionStyle,
              background: "#FFF",
            }}
          >
            {isOpen && (
              <IframeContainer
                iframeUrl={iframeUrl}
                iframeError={iframeError}
                isDragging={dragging}
                iframeStyle={iframeStyle}
                iframeAttributes={iframeAttributes}
                errorStyle={errorStyle}
              />
            )}
          </div>

          {/* Resize Handle */}
          <ResizeHandle onMouseDown={handleMouseDown} isOpen={isOpen} />

          {/* Right Panel (Children) */}
          <div
            style={{
              flex: 1,
              overflow: "auto",
              transition: transitionStyle,
              backgroundColor: "transparent",
              color: "inherit",
            }}
          >
            {children}
          </div>
        </div>
      ) : (
        // If no children, create a fixed overlay so it doesn't push content
        isOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100dvh",
              background: "#FFF",
              overflow: "auto",
              zIndex: 9998, // ensure it's on top of everything
              ...containerStyle,
            }}
          >
            <IframeContainer
              iframeUrl={iframeUrl}
              iframeError={iframeError}
              isDragging={dragging}
              iframeStyle={iframeStyle}
              iframeAttributes={iframeAttributes}
              errorStyle={errorStyle}
            />
          </div>
        )
      )}
    </>
  );
}