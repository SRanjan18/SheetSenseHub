export default function UploadFile({ selectedFile, onFileChange }) {
  return (
    <div className="dashboard-form-shell dashboard-form-shell--center">
      <div className="dashboard-upload-panel">
        <div className="dashboard-upload-card">
          <h3>Upload File</h3>
          <p>Select the input file for processing.</p>

          <label className="dashboard-upload-button">
            Choose File
            <input type="file" onChange={onFileChange} />
          </label>

          <div className="dashboard-upload-file-name">
            {selectedFile ? selectedFile.name : 'No file selected'}
          </div>
        </div>
      </div>
    </div>
  );
}
