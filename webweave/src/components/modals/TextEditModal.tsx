import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import style from "../../assets/style";

interface TextEditModalProps {
  isOpen: boolean;
  initialText: string;
  onSave: (text: string) => void;
  onCancel: () => void;
}

const TextEditModal: React.FC<TextEditModalProps> = ({
  isOpen,
  initialText,
  onSave,
  onCancel,
}) => {
  const [text, setText] = useState(initialText);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleSave = () => {
    onSave(text);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      className={style.modal}
      overlayClassName={style.modalOverlay}
    >
      <div className={style.modalContainer}>
        <div className={style.modalContent}>
          <h1 className={style.modalH1}>Edit text</h1>
          <input
            type="text"
            value={text}
            onChange={handleTextChange}
            className={style.modalInput}
          />
          <div className={style.modalButtons}>
            <button className={style.cancelButtonModal} onClick={handleCancel}>
              Cancel
            </button>
            <button className={style.saveButtonModal} onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TextEditModal;
