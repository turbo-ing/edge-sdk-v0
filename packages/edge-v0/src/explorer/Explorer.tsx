import { useEffect, useState } from "react";
import { useTurboEdgeV0 } from "../hooks/useTurboEdgeV0";
import TurboIcon from "./assets/TurboIcon";

interface ExplorerProps {
    iconSize?: number;
    position?: 
        | { top: string; left?: string; right?: never; bottom?: never }
        | { bottom: string; left?: string; right?: never; top?: never }
        | { left: string; top?: string; bottom?: never; right?: never }
        | { right: string; top?: string; bottom?: never; left?: never };
}

export function Explorer({ iconSize = 18, position = { top: "1.25rem", left: "0" } }: ExplorerProps) {
    const turboEdge = useTurboEdgeV0();
    const [gameId, setGameId] = useState<string | null>(null);
    const [explorerUrl, setExplorerUrl] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(true)

    useEffect(() => {
        if (turboEdge?.gameId) {
            setGameId(turboEdge.gameId);
            setExplorerUrl(`https://explorer.turbo.ing/game/${turboEdge.gameId}`);
            // setExplorerUrl(`http://localhost:3000/game/${turboEdge.gameId}`);
        }
    }, [turboEdge?.gameId]);

    const handleClick = () => {
        setIsOpen(!isOpen)
    }

    const [iframeError, setIframeError] = useState<string | null>(null);

    useEffect(() => {
        const handleIframeMessage = (event: MessageEvent) => {
          if (event.data.type === 'iframe-message') {
            setIframeError(event.data.message);
          }
        };
      
        window.addEventListener('message', handleIframeMessage);
      
        return () => {
          window.removeEventListener('message', handleIframeMessage);
        };
      }, []);

    return (
        <div>
            <button
                onClick={handleClick}
                style={{
                    ...position,
                    position: "absolute",
                    padding: '5px',
                    borderTopRightRadius: "0.5rem",
                    borderBottomRightRadius: "0.5rem",
                    filter: "drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04)) drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1))",
                    background: "#FFFFFF",
                    zIndex: 9999
                }}
            >
                <TurboIcon size={iconSize} color="#F13938" />
            </button>
            <div
                style={{
                    display: isOpen ? "block" : "none",
                    position: "absolute", 
                    top: "0px", left: "0px",
                    zIndex: 9998,
                    background: "white",
                    width: "100%",
                    height: "100%",
                }}
            >
                {
                    iframeError? 
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            textAlign: "center",
                            color: "#F13938",
                            backgroundColor: "#FFEBEB",
                        }}
                    >
                        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Error</h1>
                        <p style={{ fontSize: "1rem" }}>{iframeError}</p>
                    </div>               
                    : <iframe
                    src={explorerUrl}
                    title="Turbo Explorer"
                    style={{ width: "100%", height: "100%", border: "none" }}
                ></iframe>
                }
            </div>
        </div>
    );
}
