import './TextInput.css';

export default function TextInput({
  label,
  value,
  onChange,
  placeholder = '',
  name,
}) {
  return (
    <div className="ui-input-group">
      {label && <label className="ui-input-label">{label}</label>}
      <input
        className="ui-input"
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}