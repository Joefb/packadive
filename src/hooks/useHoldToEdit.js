import { useState, useRef } from "react";

export const useHoldToEdit = (holdDuration = 2000) => {
  const [showModal, setShowModal] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const holdTimeout = useRef(null);

  const startHold = (id) => {
    holdTimeout.current = setTimeout(() => {
      setTargetId(id);
      setShowModal(true);
    }, holdDuration);
  };

  const cancelHold = () => {
    if (holdTimeout.current) {
      clearTimeout(holdTimeout.current);
      holdTimeout.current = null;
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setTargetId(null);
  };

  return {
    showModal,
    targetId,
    startHold,
    cancelHold,
    closeModal,
  };
};
