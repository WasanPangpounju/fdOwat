import React from 'react'

function Footer() {
    return (
        <footer style={{
          position: "fixed",
          bottom: 0,
          left: "13rem",
          width: "calc(100% - 13rem)",
          background: "#f8f9fa",
          textAlign: "center",
          padding: "10px",
          zIndex: 1000,
        }}>
          © สงวนลิขสิทธิ์ โดย บริษัท โอวาท โปร แอนด์ ควิก จำกัด
        </footer>
      );
}

export default Footer