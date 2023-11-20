import React from "react";
import Modal from "@mui/material/Modal";
import style from "../../assets/style";
import { useNavigate } from "react-router";

interface NotSignedInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotSignedInModal: React.FC<NotSignedInModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className={style.modalContainer}>
        <div className={style.modalContent}>
          <h1 className={style.modalH1}>
            Kirjaudu sisään tallentaaksesi sivun!
          </h1>
          <div className={style.modalButtons}>
            <button onClick={onClose} className={style.cancelButtonModal}>
              Close
            </button>
            <button
              onClick={() => navigate("/login")}
              className={style.saveButtonModal}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default NotSignedInModal;
