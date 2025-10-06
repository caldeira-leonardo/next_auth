import { useState, useEffect, useRef } from "react";

const Toastr = ({
  type = "info",
  title = "",
  message = "",
  duration = 5000,
  showCloseButton = true,
  onClose = () => {},
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const timeoutRef = useRef(null);
  const toastRef = useRef(null);

  const typeConfig = {
    success: {
      icon: "ti ti-check-circle",
      bgClass: "bg-success-subtle",
      textClass: "text-success",
      borderClass: "border-success",
    },
    error: {
      icon: "ti ti-x-circle",
      bgClass: "bg-danger-subtle",
      textClass: "text-danger",
      borderClass: "border-danger",
    },
    warning: {
      icon: "ti ti-alert-triangle",
      bgClass: "bg-warning-subtle",
      textClass: "text-warning",
      borderClass: "border-warning",
    },
    info: {
      icon: "ti ti-info-circle",
      bgClass: "bg-info-subtle",
      textClass: "text-info",
      borderClass: "border-info",
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (duration > 0) {
      timeoutRef.current = setTimeout(() => {
        handleClose();
      }, duration);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (duration > 0) {
      timeoutRef.current = setTimeout(() => {
        handleClose();
      }, duration);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      ref={toastRef}
      className={`

        toast
        toast-${type}
        ${isLeaving ? "toastr-leaving" : "toastr-entering"}
        ${className}
      `}
      style={{
        transform: isLeaving ? "translateX(100%)" : "translateX(0)",
        opacity: isLeaving ? 0 : 1,
        transition: "all 0.3s ease-in-out",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showCloseButton && (
        <button
          type="button"
          className="toast-close-button"
          onClick={handleClose}
          aria-label="Fechar"
        >
          ×
        </button>
      )}

      {title && <div className="toast-title">{title}</div>}
      {message && <div className="toast-message">{message}</div>}
    </div>
  );
};

export default Toastr;
