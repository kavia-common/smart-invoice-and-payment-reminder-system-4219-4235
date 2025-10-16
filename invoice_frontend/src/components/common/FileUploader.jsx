export default function FileUploader({ onChange, accept }) {
  return (
    <label className="uploader">
      <input type="file" accept={accept} style={{ display: 'none' }} onChange={onChange} />
      <span className="uploader-btn">Upload File</span>
    </label>
  );
}
