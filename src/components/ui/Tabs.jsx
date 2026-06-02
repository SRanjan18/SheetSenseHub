import './Tabs.css';

export default function Tabs({ tabs = [], activeTab, onChange }) {
  return (
    <div className="ui-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`ui-tab ${activeTab === tab.value ? 'ui-tab--active' : ''}`}
          onClick={() => onChange(tab.value)}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}