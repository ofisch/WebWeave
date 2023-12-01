import React, { useState } from "react";
import Modal from "react-modal";
import style from "../../assets/style";
import { useLocation } from "react-router-dom";
import removeTextEdit from "../../utils/removeTextEdit";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
}

const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const location = useLocation();

  const downloadPage = () => {
    if (inputValue !== null && inputValue !== "") {
      let html;

      if (location.pathname === "/edit") {
        html = removeTextEdit(
          "function getHtmlContent() {",
          localStorage.getItem("html") || ""
        );
      } else if (location.pathname === "/") {
        html = localStorage.getItem("htmlResponse");
      }

      if (html) {
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${inputValue}.html`;
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  };

  const handleSubmit = () => {
    onSubmit(inputValue);
    setInputValue("");

    downloadPage();
    onClose();
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

export default DownloadModal;
