import React, { useState } from "react";
import Modal from "react-modal";
import style from "../../assets/style";
import { useNavigate } from "react-router";

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
  content: string;
}

const SaveModal: React.FC<SaveModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  content,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit(inputValue);
    setInputValue("");
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
      onClose();
      navigate("/profile");
    }, 2500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={style.modal}
      overlayClassName={style.modalOverlay}
    >
      <div className={style.modalContainer}>
        <div className={style.modalContent}>
          <h1 className={style.modalH1}>Give a name for your website</h1>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className={style.modalInput}
          />
          {showAlert && (
            <p className={style.modalAlert}>Page saved successfully!</p>
          )}
          <div className={style.modalButtons}>
            <button onClick={onClose} className={style.cancelButtonModal}>
              Cancel
            </button>
            <button onClick={handleSubmit} className={style.saveButtonModal}>
              Save
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SaveModal;
