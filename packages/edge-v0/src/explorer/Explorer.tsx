import { useEffect, useState } from "react";
import { useTurboEdgeV0 } from "../hooks/useTurboEdgeV0";
import TurboIcon from "./assets/TurboIcon";

interface ExplorerProps {
    explorer?: boolean | string;
}

export function Explorer({ explorer = false }: ExplorerProps) {
    const turboEdge = useTurboEdgeV0();
    const [gameId, setGameId] = useState<string | null>(null);
    const [explorerUrl, setExplorerUrl] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false)

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
            if (event.data.type === 'iframe-error') {
                console.error('Iframe Error:', event.data);
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
                    position: "absolute",
                    padding: '5px',
                    borderTopRightRadius: "0.5rem",
                    borderBottomRightRadius: "0.5rem",
                    top: "1.25rem",
                    filter: "drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04)) drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1))",
                    background: "#FFFFFF",
                    zIndex: 9999
                }}
            >
                <TurboIcon size={18} color="#F13938" />
            </button>
            <div
                style={{
                    display: isOpen ? "block" : "none",
                    position: "absolute", top: "0px", left: "0px",
                    zIndex: 9998,
                    background: "white",
                    width: "100%",
                    height: "100%",
                }}
            >
                {
                    iframeError? 
                        <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
                            <strong>Error in iframe:</strong> {iframeError}
                        </div>                    
                    : <iframe
                    src={explorerUrl}
                    title="Turbo Explorer"
                    style={{ width: "100%", height: "100%", border: "none" }}
                    onError={() => {
                        console.error("Failed to load the iframe content.");
                        alert("An error occurred while loading the content. Please try again later.");
                    }}
                ></iframe>
                }
            </div>
        </div>
    );
}
