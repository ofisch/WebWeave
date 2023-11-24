import React from "react";
import Modal from "react-modal";
import style from "../../assets/style";

interface ClearModal {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ClearModal: React.FC<ClearModal> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={style.modal}
      overlayClassName={style.modalOverlay}
    >
      <div className={style.modalContainer}>
        <div className={style.modalContent}>
          <h1 className={style.modalH1}>
            {"Are you sure you want to clear the prompt?"}
          </h1>
          <div className={style.modalButtons}>
            <button onClick={onConfirm} className={style.deleteButtonModal}>
              Clear
            </button>
            <button onClick={onClose} className={style.cancelButtonModal}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ClearModal;
