import './LoadingOverlay.css';

export default function LoadingOverlay({ show = false, text = 'Loading...' }) {
  if (!show) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-overlay__box">
        <div className="loading-overlay__spinner" />
        <p>{text}</p>
      </div>
    </div>
  );
}