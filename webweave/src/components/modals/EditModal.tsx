import Modal from "react-modal";
import React, { useState, useEffect } from "react";
import style from "../../assets/style";

interface EditModalProps {
  isOpen: boolean;
  onSave: (newName: string) => void;
  onCancel: () => void;
  initialName: string;
}

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onSave,
  onCancel,
  initialName,
}) => {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSubmit = () => {
    onSave(name);
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
          <h1 className={style.modalH1}>Edit page name</h1>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className={style.modalInput}
          />
          <div className={style.modalButtons}>
            <button className={style.cancelButtonModal} onClick={onCancel}>
              Cancel
            </button>
            <button className={style.saveButtonModal} onClick={handleSubmit}>
              Save
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditModal;
