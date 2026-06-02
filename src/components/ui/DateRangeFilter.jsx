import './DateRangeFilter.css';

export default function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) {
  return (
    <div className="date-range-filter">
      <div className="date-range-filter__field">
        <label>Start Date</label>
        <input type="date" value={startDate} onChange={onStartDateChange} />
      </div>

      <div className="date-range-filter__field">
        <label>End Date</label>
        <input type="date" value={endDate} onChange={onEndDateChange} />
      </div>
    </div>
  );
}