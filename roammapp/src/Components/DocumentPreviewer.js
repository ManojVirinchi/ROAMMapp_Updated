import React, { useState } from "react";
import "./css/Document_Previewer_css.css"; // Import the CSS file for styling

const DocumentPreviewer = ({ documentPath, documentName }) => {
  const [showPreview, setShowPreview] = useState(false);

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = documentPath; // Path to the document passed as prop
    link.download = documentName; // Name of the file passed as prop
    link.click();
  };

  return (
    <div>
      {!showPreview && (
        <span
        onClick={() => setShowPreview(true)}
        className="clickable-document-name"
      >
        {documentName}
      </span>
      )}
      
      {showPreview && (
        <div className="overlay">
          <div className="preview-container">
            <iframe
              src={documentPath} // Path to the document passed as prop
              width="100%"
              height="500px"
              title="Document Preview"
            ></iframe>
            <div className="buttons">
              {/* <button onClick={handleDownload}>Download</button> */}
              <button onClick={handleClosePreview}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentPreviewer;
