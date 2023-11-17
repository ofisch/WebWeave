import React from "react";
import Modal from "@mui/material/Modal";
import style from "../../assets/style";

interface SaveChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SaveChangesModal: React.FC<SaveChangesModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className={style.modalContainer}>
        <div className={style.modalContent}>
          <h1 className={style.modalH1}>Muutokset tallennettu</h1>
          <div className={style.modalSaveButton}>
            <button onClick={onClose} className={style.saveButtonModal}>
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SaveChangesModal;
