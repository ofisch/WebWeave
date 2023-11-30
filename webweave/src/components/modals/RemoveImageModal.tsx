import React from "react";
import Modal from "@mui/material/Modal";
import style from "../../assets/style";

interface RemoveImageModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  imageName: string;
}

const RemoveImageModal: React.FC<RemoveImageModalProps> = ({
  open,
  onClose,
  onConfirm,
  imageName,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className={style.modalContainer}>
        <div className={style.modalContent}>
          <h1
            className={style.modalH1}
          >{`Are you sure you want to remove the image "${imageName}"?`}</h1>
          <div className={style.modalButtons}>
            <button onClick={onConfirm} className={style.deleteButtonModal}>
              Remove
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

export default RemoveImageModal;
