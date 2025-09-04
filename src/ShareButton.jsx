import { useState } from "react";

export default function ShareButton({ onClick }) {
    const [showCopied, setShowCopied] = useState(false);

    const handleClick = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
        }
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 1200);
        if (onClick) {
            onClick();
        }
    };

    return (
        <div className="share-button-container">
            <button
                className="share-btn"
                onClick={handleClick}
                aria-label="Share this page"
            >
                <span role="img" aria-label="Share">
                    🔗
                </span>
            </button>
            {showCopied && (
                <span className="copied-fade" role="status">
                    Copied!
                </span>
            )}
        </div>
    );
}
