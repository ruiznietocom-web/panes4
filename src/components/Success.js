import React from "react";

const Success = () => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f0fdf4",
      color: "#16a34a",
      fontFamily: "sans-serif"
    }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>✅ Pedido enviado con éxito</h1>
      <p style={{ marginTop: "1rem", color: "#374151" }}>
        Gracias por tu pedido, pronto nos pondremos en contacto contigo.
      </p>
    </div>
  );
};

export default Success;
