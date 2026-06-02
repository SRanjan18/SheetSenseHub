import './SimpleTable.css';

export default function SimpleTable({ columns = [], data = [] }) {
  return (
    <div className="simple-table-wrapper">
      <table className="simple-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column.key}>{row[column.key]}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length || 1}>No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}