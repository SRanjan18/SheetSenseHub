import { Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import './AppTable.css';

function SimpleAppTable({ columns = [], data = [], emptyText = 'No data available' }) {
  return (
    <div className="app-table-wrapper">
      <table className="app-table">
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
              <tr key={row.id ?? index}>
                {columns.map((column) => (
                  <td key={column.key}>{row[column.key]}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length || 1}>{emptyText}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function DefaultNoRowsOverlay({ title, description }) {
  return (
    <Stack height="100%" alignItems="center" justifyContent="center">
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      {description ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {description}
        </Typography>
      ) : null}
    </Stack>
  );
}

export default function AppTable({
  columns = [],
  data = [],
  disableRowSelectionOnClick = true,
  emptyDescription = '',
  emptyTitle = 'No data available',
  height,
  initialState,
  loading = false,
  pageSizeOptions,
  sx,
  variant = 'simple',
}) {
  if (variant === 'dataGrid') {
    return (
      <BoxLike height={height}>
        <DataGrid
          rows={data}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick={disableRowSelectionOnClick}
          pageSizeOptions={pageSizeOptions}
          initialState={initialState}
          sx={sx}
          slots={{
            noRowsOverlay: () => (
              <DefaultNoRowsOverlay title={emptyTitle} description={emptyDescription} />
            ),
          }}
        />
      </BoxLike>
    );
  }

  return <SimpleAppTable columns={columns} data={data} emptyText={emptyTitle} />;
}

function BoxLike({ children, height }) {
  return (
    <div className="app-table-data-grid" style={{ height, width: '100%' }}>
      {children}
    </div>
  );
}
