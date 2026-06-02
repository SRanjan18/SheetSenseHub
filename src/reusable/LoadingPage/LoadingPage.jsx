import './LoadingPage.css';

export default function LoadingPage({
  message = 'Please wait, we are logging you in',
  overlay = false,
  transparent = false,
}) {
  return (
    <div
      className={`loading-page ${overlay ? 'loading-page--overlay' : ''} ${
        transparent ? 'loading-page--transparent' : ''
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="loading-page__content">
        <div className="loading-page__spinner" />
        <h1>{message}</h1>
      </div>
    </div>
  );
}