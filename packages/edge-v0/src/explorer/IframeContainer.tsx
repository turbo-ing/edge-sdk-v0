import React, { useEffect, useRef, useState } from "react";
import Loading from "./Loading";
import Error from "./Error";

interface IframeContainerProps {
  iframeUrl: string;
  iframeError: string | null;
  isDragging: boolean;
  iframeStyle?: React.CSSProperties;
  iframeAttributes?: React.IframeHTMLAttributes<HTMLIFrameElement>;
  errorStyle?: React.CSSProperties;
}

const IframeContainer: React.FC<IframeContainerProps> = ({
  iframeUrl,
  iframeError,
  isDragging,
  iframeStyle,
  iframeAttributes,
  errorStyle,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading,setIsLoading] = useState(true)

  useEffect(() => {
    // If there's no iframe or no URL, just return
    if (!iframeRef.current || !iframeUrl) return;

    const iframeElement = iframeRef.current;

    const handleLoad = () => {
      setIsLoading(false);
    };

    // Attach the load event listener
    iframeElement.addEventListener("load", handleLoad);

    // Cleanup function: remove event listener on unmount or changes
    return () => {
      iframeElement.removeEventListener("load", handleLoad);
    };
  }, [iframeUrl, setIsLoading]);

  if (iframeError) {
    return (
      <Error
        title="There was an Error"
        message={iframeError}
      />
    );
  }

  if (!iframeUrl) {
    return (
      <Error
        title="No URL"
        message="No gameId or sessionId detected."
      />
    );
  }

  return (
    <>
      {isLoading && <Loading />}
      <iframe
        ref={iframeRef}
        src={iframeUrl}
        title="Turbo Explorer"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          pointerEvents: isDragging ? "none" : "auto",
          display: isLoading ? "none" : "block",
          ...iframeStyle,
        }}
        {...iframeAttributes}
      />
    </>
  );
};

export default IframeContainer;