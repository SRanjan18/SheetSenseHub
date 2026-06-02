import './PageSection.css';

export default function PageSection({ title, children }) {
  return (
    <section className="page-section">
      {title && <h3 className="page-section__title">{title}</h3>}
      <div>{children}</div>
    </section>
  );
}