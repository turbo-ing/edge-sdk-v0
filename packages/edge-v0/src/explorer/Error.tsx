interface ErrorProps {
    title: string
    message: string
}

export default function Error({title, message}: ErrorProps) {
    return(
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
        //   ...errorStyle,
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem", fontWeight: 500 }}>
          {title}
        </h1>
        <p style={{ fontSize: "1rem" }}>{message}</p>
      </div>
    )
}