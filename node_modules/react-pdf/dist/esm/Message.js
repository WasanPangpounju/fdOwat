import React from 'react';
import PropTypes from 'prop-types';
export default function Message({ children, type }) {
    return React.createElement("div", { className: `react-pdf__message react-pdf__message--${type}` }, children);
}
Message.propTypes = {
    children: PropTypes.node,
    type: PropTypes.oneOf(['error', 'loading', 'no-data']).isRequired,
};
