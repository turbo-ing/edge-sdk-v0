export default function Loading() {
    return (
        <>
          {/* Overlay container: fills the parent, transparent */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "transparent", // No background
              zIndex: 50,
              height: "100%"
            }}
          >
            {/* Centered wrapper */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20
              }}
            >
              {/* Spinning circle, black border */}
              <div
                style={{
                  borderRadius: "9999px", // fully rounded
                  height: "60px",
                  width: "60px",
                  borderTop: "2px solid #999", // black spinner
                  animation: "spin 1s linear infinite",
                }}
              />
              <p className=" text-sm" style={{color: "#999", fontSize:"0.875rem",
    lineHeight: "1.25rem"}}>Loading
              </p>
            </div>
          </div>
    
          {/* Keyframes for spinning */}
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </>
      );
    }