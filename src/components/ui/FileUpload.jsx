import './FileUpload.css';

export default function FileUpload({ onChange, accept = '.csv,.txt,.pdf' }) {
  return (
    <div className="file-upload">
      <label className="file-upload__label">
        <span>Select File</span>
        <input
          className="file-upload__input"
          type="file"
          accept={accept}
          onChange={onChange}
        />
      </label>
    </div>
  );
}