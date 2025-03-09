"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const prop_types_1 = __importDefault(require("prop-types"));
function Message({ children, type }) {
    return react_1.default.createElement("div", { className: `react-pdf__message react-pdf__message--${type}` }, children);
}
exports.default = Message;
Message.propTypes = {
    children: prop_types_1.default.node,
    type: prop_types_1.default.oneOf(['error', 'loading', 'no-data']).isRequired,
};
