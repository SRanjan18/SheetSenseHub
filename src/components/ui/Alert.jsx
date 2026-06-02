import './Alert.css';

export default function Alert({ children, type = 'info' }) {
  return <div className={`ui-alert ui-alert--${type}`}>{children}</div>;
}