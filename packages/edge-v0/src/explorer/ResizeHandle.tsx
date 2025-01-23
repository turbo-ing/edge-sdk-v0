interface ExplorerResizeHandleProps {
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
    isOpen: boolean;
  }
  
  const ExplorerResizeHandle: React.FC<ExplorerResizeHandleProps> = ({
    onMouseDown,
    isOpen,
  }) => {
    if (!isOpen) {
      // If not open, don't render anything
      return null;
    }
  
    return (
      <div
        onMouseDown={onMouseDown}
        style={{
          width: "3px",
          cursor: "col-resize",
          backgroundColor: "#ccc",
          flexShrink: 0,
          position: "relative",
        }}
      >
        {/* A small grip indicator inside the handle */}
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
          {[1, 2, 3].map((dot) => (
            <div
              key={dot}
              style={{
                width: "3px",
                height: "3px",
                borderRadius: "50%",
                backgroundColor: "#fff",
              }}
            />
          ))}
        </div>
      </div>
    );
  };
  
  export default ExplorerResizeHandle;