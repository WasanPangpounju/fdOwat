import React from 'react';
import '../styles/FeatureModal.css';

function FeatureModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="feature-modal-overlay" onClick={onClose}>
            <div className="feature-modal-content" onClick={e => e.stopPropagation()}>
                <div className="feature-modal-header">
                    <i className="fas fa-info-circle modal-icon"></i>
                </div>
                <div className="feature-modal-body">
                    <h2>แจ้งเตือน</h2>
                    <p>ฟีเจอร์นี้ยังไม่เปิดให้ใช้งาน</p>
                    <button className="modal-close-btn" onClick={onClose}>
                        ตกลง
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FeatureModal;