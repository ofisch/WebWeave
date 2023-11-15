import React, { useState } from "react";
import Modal from "react-modal";
import style from "../../assets/style";

Modal.setAppElement("#root");

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
}

const SaveModal: React.FC<SaveModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit(inputValue);
    setInputValue("");
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
