import './Card.css';

export default function Card({ title, children }) {
  return (
    <div className="ui-card">
      {title && <div className="ui-card__title">{title}</div>}
      <div className="ui-card__content">{children}</div>
    </div>
  );
}