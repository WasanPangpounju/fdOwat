import React from 'react'

function Footer({ isLoginPage }) {
    const footerStyle = {
      position: "fixed",
      bottom: 0,
      left: isLoginPage ? 0 : "13rem",
      width: isLoginPage ? "100vw" : "calc(100vw - 13rem)",
      maxWidth: "100vw",
      background: "#f8f9fa",
      textAlign: "center",
      padding: "10px",
      zIndex: 1000,
      fontFamily: "Sarabun",
      boxSizing: "border-box",
      margin: 0,
      overflow: "hidden",
    };

    return (
        <footer style={footerStyle}>
          © สงวนลิขสิทธิ์ โดย บริษัท โอวาท โปร แอนด์ ควิก จำกัด
        </footer>
    );
}

export default Footer