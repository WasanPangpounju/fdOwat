import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './editwindowcss.css';

// Custom Styles
const customStyles = `
  <style>
    .gps-container {
      background: linear-gradient(135deg, rgb(43,93,142) 0%, rgb(33,73,112) 100%);
      border-radius: 20px;
      padding: 40px;
      color: white;
      box-shadow: 0 10px 40px rgba(43,93,142,0.3);
      margin-bottom: 30px;
      animation: fadeInUp 0.5s ease;
      text-align: center;
    }
    
    .gps-icon {
      font-size: 5rem;
      margin-bottom: 20px;
      animation: pulse 2s ease-in-out infinite;
    }
    
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.1);
        opacity: 0.8;
      }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .location-card {
      background: white;
      border-radius: 15px;
      padding: 30px;
      margin-bottom: 20px;
      box-shadow: 0 5px 20px rgba(43,93,142,0.1);
      animation: fadeInUp 0.5s ease;
      border: 1px solid rgba(43,93,142,0.1);
    }
    
    .coordinate-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    
    .coordinate-item {
      background: rgba(43,93,142,0.05);
      padding: 25px;
      border-radius: 12px;
      border-left: 5px solid rgb(43,93,142);
      transition: all 0.3s ease;
    }
    
    .coordinate-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(43,93,142,0.2);
    }
    
    .coordinate-label {
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .coordinate-value {
      font-size: 1.8rem;
      font-weight: bold;
      color: rgb(43,93,142);
      font-family: 'Courier New', monospace;
    }
    
    .info-section {
      background: white;
      border-radius: 15px;
      padding: 25px;
      margin-bottom: 20px;
      box-shadow: 0 5px 20px rgba(43,93,142,0.1);
      border: 1px solid rgba(43,93,142,0.1);
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 15px;
    }
    
    .info-item {
      background: #F5F5F5;
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid rgb(43,93,142);
    }
    
    .info-label {
      font-size: 0.85rem;
      color: #666;
      margin-bottom: 5px;
    }
    
    .info-value {
      font-size: 1.1rem;
      font-weight: bold;
      color: #333;
    }
    
    .btn-get-location {
      background: rgb(43,93,142);
      color: white;
      border: none;
      padding: 15px 40px;
      border-radius: 10px;
      font-size: 1.1rem;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 5px 15px rgba(43,93,142,0.3);
    }
    
    .btn-get-location:hover {
      background: rgb(33,73,112);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(43,93,142,0.4);
    }
    
    .btn-get-location:active {
      transform: translateY(0);
    }
    
    .btn-get-location:disabled {
      background: #ccc;
      cursor: not-allowed;
      transform: none;
    }
    
    .map-container {
      width: 100%;
      height: 400px;
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 5px 20px rgba(43,93,142,0.2);
      border: 2px solid rgba(43,93,142,0.1);
      margin-top: 20px;
    }
    
    .loading-spinner {
      border: 4px solid rgba(43,93,142,0.1);
      border-radius: 50%;
      border-top: 4px solid rgb(43,93,142);
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
      margin: 20px auto;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .status-badge {
      display: inline-block;
      padding: 8px 20px;
      border-radius: 20px;
      font-weight: bold;
      font-size: 0.9rem;
      margin-top: 10px;
    }
    
    .status-success {
      background: #4CAF50;
      color: white;
    }
    
    .status-error {
      background: #f44336;
      color: white;
    }
    
    .status-loading {
      background: #FF9800;
      color: white;
    }
    
    .copy-btn {
      background: transparent;
      border: 2px solid rgb(43,93,142);
      color: rgb(43,93,142);
      padding: 5px 15px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 0.85rem;
      margin-top: 10px;
      transition: all 0.3s ease;
    }
    
    .copy-btn:hover {
      background: rgb(43,93,142);
      color: white;
    }
    
    .accuracy-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-top: 15px;
      padding: 10px;
      background: rgba(43,93,142,0.05);
      border-radius: 8px;
    }
    
    .accuracy-bar {
      flex: 1;
      height: 8px;
      background: #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
    }
    
    .accuracy-fill {
      height: 100%;
      background: linear-gradient(90deg, #4CAF50, #8BC34A);
      transition: width 0.3s ease;
    }
    
    .camera-section {
      background: white;
      border-radius: 15px;
      padding: 25px;
      margin-bottom: 20px;
      box-shadow: 0 5px 20px rgba(43,93,142,0.1);
      border: 1px solid rgba(43,93,142,0.1);
    }
    
    .camera-container {
      position: relative;
      width: 100%;
      max-width: 640px;
      margin: 20px auto;
      border-radius: 15px;
      overflow: hidden;
      background: #000;
    }
    
    .camera-video {
      width: 100%;
      height: auto;
      display: block;
    }
    
    .camera-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 20px;
      background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
      color: white;
      text-align: center;
    }
    
    .capture-btn {
      background: rgb(43,93,142);
      color: white;
      border: none;
      padding: 15px 40px;
      border-radius: 50px;
      font-size: 1.1rem;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 5px 15px rgba(43,93,142,0.3);
      margin: 10px;
    }
    
    .capture-btn:hover {
      background: rgb(33,73,112);
      transform: scale(1.05);
    }
    
    .capture-btn:active {
      transform: scale(0.95);
    }
    
    .photo-preview {
      position: relative;
      width: 100%;
      max-width: 640px;
      margin: 20px auto;
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 5px 20px rgba(43,93,142,0.2);
    }
    
    .photo-preview img {
      width: 100%;
      height: auto;
      display: block;
    }
    
    .photo-actions {
      display: flex;
      gap: 10px;
      justify-content: center;
      margin-top: 20px;
      flex-wrap: wrap;
    }
    
    .btn-secondary {
      background: #6c757d;
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .btn-secondary:hover {
      background: #5a6268;
    }
    
    .btn-success {
      background: #28a745;
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .btn-success:hover {
      background: #218838;
    }
    
    .btn-danger {
      background: #dc3545;
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .btn-danger:hover {
      background: #c82333;
    }
    
    .watermark-preview {
      position: absolute;
      bottom: 10px;
      left: 10px;
      right: 10px;
      background: rgba(0,0,0,0.7);
      color: white;
      padding: 15px;
      border-radius: 8px;
      font-size: 0.9rem;
      backdrop-filter: blur(5px);
    }
    
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 20px;
    }
    
    .gallery-item {
      position: relative;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 3px 10px rgba(0,0,0,0.2);
      cursor: pointer;
      transition: transform 0.3s ease;
    }
    
    .gallery-item:hover {
      transform: scale(1.05);
    }
    
    .gallery-item img {
      width: 100%;
      height: 150px;
      object-fit: cover;
    }
    
    .gallery-item-delete {
      position: absolute;
      top: 5px;
      right: 5px;
      background: rgba(220,53,69,0.9);
      color: white;
      border: none;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }
    
    .gallery-item-delete:hover {
      background: #c82333;
      transform: scale(1.1);
    }
  </style>
`;

function GPSLocation() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  useEffect(() => {
    document.title = 'ตำแหน่ง GPS';
    
    // เพิ่ม custom styles
    const styleElement = document.createElement('div');
    styleElement.innerHTML = customStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, []);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('เบราว์เซอร์ของคุณไม่รองรับ Geolocation');
      setStatus('error');
      Swal.fire({
        icon: 'error',
        title: 'ไม่รองรับ',
        text: 'เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง GPS',
        confirmButtonColor: 'rgb(43,93,142)'
      });
      return;
    }

    setLoading(true);
    setStatus('loading');
    setError(null);

    const options = {
      enableHighAccuracy: true, // ใช้ GPS ความแม่นยำสูง
      timeout: 10000, // รอสูงสุด 10 วินาที
      maximumAge: 0 // ไม่ใช้ข้อมูลเก่า
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: new Date(position.timestamp).toLocaleString('th-TH')
        };

        setLocation(locationData);
        setLoading(false);
        setStatus('success');

        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ!',
          html: `
            <div style="text-align: left; padding: 10px;">
              <p><strong>ตำแหน่งของคุณ:</strong></p>
              <p>Latitude: ${locationData.latitude.toFixed(6)}</p>
              <p>Longitude: ${locationData.longitude.toFixed(6)}</p>
              <p>ความแม่นยำ: ${locationData.accuracy.toFixed(2)} เมตร</p>
            </div>
          `,
          confirmButtonColor: 'rgb(43,93,142)'
        });
      },
      (error) => {
        let errorMessage = 'ไม่สามารถรับตำแหน่งได้';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'คุณปฏิเสธการอนุญาตให้เข้าถึงตำแหน่ง';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'ข้อมูลตำแหน่งไม่พร้อมใช้งาน';
            break;
          case error.TIMEOUT:
            errorMessage = 'หมดเวลาในการรับตำแหน่ง กรุณาลองใหม่';
            break;
          default:
            errorMessage = 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
        }

        setError(errorMessage);
        setLoading(false);
        setStatus('error');

        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: errorMessage,
          confirmButtonColor: '#f44336'
        });
      },
      options
    );
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      Swal.fire({
        icon: 'success',
        title: 'คัดลอกแล้ว!',
        text: `คัดลอก ${label} เรียบร้อยแล้ว`,
        timer: 1500,
        showConfirmButton: false
      });
    });
  };

  const openInGoogleMaps = () => {
    if (location) {
      const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
      window.open(url, '_blank');
    }
  };

  const getAccuracyLevel = (accuracy) => {
    if (accuracy < 10) return { level: 'ดีเยี่ยม', percent: 100, color: '#4CAF50' };
    if (accuracy < 50) return { level: 'ดี', percent: 80, color: '#8BC34A' };
    if (accuracy < 100) return { level: 'ปานกลาง', percent: 60, color: '#FFC107' };
    if (accuracy < 500) return { level: 'พอใช้', percent: 40, color: '#FF9800' };
    return { level: 'ต่ำ', percent: 20, color: '#f44336' };
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: translateX(-50%) scale(1);
          }
          50% {
            transform: translateX(-50%) scale(1.05);
          }
        }
      `}</style>
      
      <div className="hold-transition sidebar-mini editlaout">
      <div className="wrapper">
        <div className="content-wrapper">
          
          {/* Breadcrumb */}
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <i className="fas fa-home"></i> <Link to="/">หน้าหลัก</Link>
            </li>
            <li className="breadcrumb-item active">ตำแหน่ง GPS</li>
          </ol>

          {/* Header */}
          <div className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <h1 className="m-0">
                  <i className="fas fa-map-marker-alt"></i> ตำแหน่ง GPS
                </h1>
              </div>
            </div>
          </div>

          {/* Main content */}
          <section className="content">
            <div className="container-fluid">
              
              {/* GPS Card */}
              <div className="gps-container">
                <div className="gps-icon">
                  <i className="fas fa-location-arrow"></i>
                </div>
                <h2 style={{ marginBottom: '10px' }}>ระบุตำแหน่งปัจจุบัน</h2>
                <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '20px' }}>
                  คลิกปุ่มด้านล่างเพื่อรับตำแหน่ง GPS ของคุณ
                </p>
                <button 
                  className="btn-get-location"
                  onClick={getLocation}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-circle-notch fa-spin"></i> กำลังระบุตำแหน่ง...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-crosshairs"></i> รับตำแหน่ง GPS
                    </>
                  )}
                </button>

                {status === 'loading' && (
                  <span className="status-badge status-loading">
                    <i className="fas fa-spinner fa-spin"></i> กำลังดำเนินการ
                  </span>
                )}
                {status === 'success' && (
                  <span className="status-badge status-success">
                    <i className="fas fa-check-circle"></i> สำเร็จ
                  </span>
                )}
                {status === 'error' && (
                  <span className="status-badge status-error">
                    <i className="fas fa-times-circle"></i> ผิดพลาด
                  </span>
                )}
              </div>

              {/* Coordinates Display */}
              {location && (
                <>
                  <div className="location-card">
                    <h3 style={{ color: 'rgb(43,93,142)', marginBottom: '20px' }}>
                      <i className="fas fa-map-pin"></i> พิกัดตำแหน่ง
                    </h3>
                    
                    <div className="coordinate-grid">
                      <div className="coordinate-item">
                        <div className="coordinate-label">
                          <i className="fas fa-arrows-alt-v"></i> Latitude (ละติจูด)
                        </div>
                        <div className="coordinate-value">
                          {location.latitude.toFixed(8)}°
                        </div>
                        <button 
                          className="copy-btn"
                          onClick={() => copyToClipboard(location.latitude, 'Latitude')}
                        >
                          <i className="fas fa-copy"></i> คัดลอก
                        </button>
                      </div>

                      <div className="coordinate-item">
                        <div className="coordinate-label">
                          <i className="fas fa-arrows-alt-h"></i> Longitude (ลองจิจูด)
                        </div>
                        <div className="coordinate-value">
                          {location.longitude.toFixed(8)}°
                        </div>
                        <button 
                          className="copy-btn"
                          onClick={() => copyToClipboard(location.longitude, 'Longitude')}
                        >
                          <i className="fas fa-copy"></i> คัดลอก
                        </button>
                      </div>
                    </div>

                    {/* Accuracy Indicator */}
                    {location.accuracy && (
                      <div className="accuracy-indicator">
                        <i className="fas fa-bullseye" style={{ color: 'rgb(43,93,142)' }}></i>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                              ความแม่นยำ: {getAccuracyLevel(location.accuracy).level}
                            </span>
                            <span style={{ fontSize: '0.9rem', color: '#666' }}>
                              ±{location.accuracy.toFixed(2)} เมตร
                            </span>
                          </div>
                          <div className="accuracy-bar">
                            <div 
                              className="accuracy-fill" 
                              style={{ 
                                width: `${getAccuracyLevel(location.accuracy).percent}%`,
                                background: getAccuracyLevel(location.accuracy).color
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                      <button 
                        className="btn btn-primary"
                        onClick={openInGoogleMaps}
                        style={{ 
                          background: 'rgb(43,93,142)', 
                          border: 'none',
                          padding: '10px 30px',
                          borderRadius: '8px',
                          fontSize: '1rem'
                        }}
                      >
                        <i className="fas fa-map-marked-alt"></i> เปิดใน Google Maps
                      </button>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="info-section">
                    <h4 style={{ color: 'rgb(43,93,142)', marginBottom: '15px' }}>
                      <i className="fas fa-info-circle"></i> ข้อมูลเพิ่มเติม
                    </h4>
                    <div className="info-grid">
                      {location.altitude !== null && (
                        <div className="info-item">
                          <div className="info-label">ความสูง</div>
                          <div className="info-value">
                            {location.altitude ? `${location.altitude.toFixed(2)} เมตร` : 'ไม่ระบุ'}
                          </div>
                        </div>
                      )}
                      
                      {location.speed !== null && (
                        <div className="info-item">
                          <div className="info-label">ความเร็ว</div>
                          <div className="info-value">
                            {location.speed ? `${(location.speed * 3.6).toFixed(2)} กม./ชม.` : '0 กม./ชม.'}
                          </div>
                        </div>
                      )}
                      
                      {location.heading !== null && (
                        <div className="info-item">
                          <div className="info-label">ทิศทาง</div>
                          <div className="info-value">
                            {location.heading ? `${location.heading.toFixed(2)}°` : 'ไม่ระบุ'}
                          </div>
                        </div>
                      )}
                      
                      <div className="info-item">
                        <div className="info-label">เวลาที่บันทึก</div>
                        <div className="info-value" style={{ fontSize: '0.9rem' }}>
                          {location.timestamp}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Google Maps iframe */}
                  <div className="info-section">
                    <h4 style={{ color: 'rgb(43,93,142)', marginBottom: '15px' }}>
                      <i className="fas fa-map"></i> แผนที่
                    </h4>
                    <div className="map-container">
                      <iframe
                        title="Google Maps"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ border: 0 }}
                        src={`https://www.google.com/maps?q=${location.latitude},${location.longitude}&output=embed&z=15`}
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                </>
              )}

            </div>
          </section>

        </div>
      </div>
    </div>
    </>
  );
}

export default GPSLocation;
