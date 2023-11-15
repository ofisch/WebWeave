import React from "react";
import Modal from "@mui/material/Modal";
import style from "../../assets/style";

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  pageName: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  open,
  onClose,
  onConfirm,
  pageName,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className={style.modalContainer}>
        <div className={style.modalContent}>
          <h1
            className={style.modalH1}
          >{`Are you sure you want to delete the page "${pageName}"?`}</h1>
          <div className={style.modalButtons}>
            <button onClick={onConfirm} className={style.deleteButtonModal}>
              Delete
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

export default DeleteModal;
