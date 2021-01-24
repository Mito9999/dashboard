import React from "react";
import ReactDOM from "react-dom";

const MODAL_STYLES = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#FFF",
    padding: "50px",
    zIndex: 1000,
};

const OVERLAY_STYLES = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 1000,
};

const X_STYLES = {
    color: "red",
    cursor: "pointer",
    display: "flex",
};

export default function AddModal({ children, open, close }) {
    return ReactDOM.createPortal(
        <>
            {open && (
                <>
                    <div style={OVERLAY_STYLES} />
                    <div className="modal" style={MODAL_STYLES}>
                        <span style={X_STYLES} onClick={close}>
                            (X)
                        </span>
                        <div>{children}</div>
                    </div>
                </>
            )}
        </>,
        document.getElementById("portal")
    );
}