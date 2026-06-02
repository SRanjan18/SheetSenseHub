import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  Autocomplete,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import BarChartIcon from '@mui/icons-material/BarChart';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const productOptions = [
  { label: 'SB', value: 'SB' },
  { label: 'OCC', value: 'OCC' },
  { label: 'UST:MED:SUB', value: 'UST:MED:SUB' },
  { label: 'UST:MED:MLC', value: 'UST:MED:MLC' },
  { label: 'VO:MED:SUB', value: 'VO:MED:SUB' },
];

const mockPayload = [
  {
    id: 1,
    groupName: 'Acme Health Group',
    opportunityId: 'Opp-001234567',
    documentName: 'Acme_UW_Document_01.pdf',
    productType: 'SB',
    status: 'Success',
    solarisSubmission: 'Yes',
    reasonCode: 'RC-101',
    modifiedBy: 'john.doe',
    createdDate: '2026-05-31T10:30:00',
    modifiedDate: '2026-06-01T12:15:00',
    totalTime: '12m 10s',
  },
  {
    id: 2,
    groupName: 'Northwind Benefits',
    opportunityId: 'Opp-001234568',
    documentName: 'Northwind_Quote_v2.pdf',
    productType: 'OCC',
    status: 'Failure',
    solarisSubmission: 'No',
    reasonCode: 'RC-404',
    modifiedBy: 'jane.smith',
    createdDate: '2026-05-31T11:00:00',
    modifiedDate: '2026-06-01T13:40:00',
    totalTime: '08m 42s',
  },
  {
    id: 3,
    groupName: 'Blue Peak Coverage',
    opportunityId: 'Opp-001234569',
    documentName: 'BluePeak_Enrollment.pdf',
    productType: 'UST:MED:SUB',
    status: 'In Progress',
    solarisSubmission: 'Yes',
    reasonCode: 'RC-222',
    modifiedBy: 'alex.lee',
    createdDate: '2026-05-30T09:10:00',
    modifiedDate: '2026-06-01T09:45:00',
    totalTime: '21m 03s',
  },
  {
    id: 4,
    groupName: 'Summit Care Partners',
    opportunityId: 'Opp-001234570',
    documentName: 'Summit_Proposal_Final.pdf',
    productType: 'VO:MED:SUB',
    status: 'Success',
    solarisSubmission: 'No',
    reasonCode: '',
    modifiedBy: 'mary.jones',
    createdDate: '2026-05-29T15:20:00',
    modifiedDate: '2026-06-01T16:00:00',
    totalTime: '05m 55s',
  },
];

const formatDateTime = (value) => {
  if (!value) return '';
  return dayjs(value).format('MM/DD/YYYY, hh:mm:ss A');
};

const getStatusColor = (status) => {
  const s = String(status || '').toLowerCase();
  if (s === 'success') return '#2e7d32';
  if (s === 'failure') return '#d32f2f';
  if (s === 'in progress') return '#ed6c02';
  return '#616161';
};

export default function ReportPage() {
  const yesterday = dayjs().subtract(1, 'day');
  const today = dayjs();

  const [selectedProducts, setSelectedProducts] = useState([productOptions[0]]);
  const [startDate, setStartDate] = useState(yesterday);
  const [endDate, setEndDate] = useState(today);
  const [rows, setRows] = useState([]);
  const [errors, setErrors] = useState({
    productType: '',
    startDate: '',
    endDate: '',
    range: '',
  });

  const validateForm = () => {
    const nextErrors = {
      productType: '',
      startDate: '',
      endDate: '',
      range: '',
    };

    if (!selectedProducts.length) {
      nextErrors.productType = 'Product Type is required';
    }

    if (!startDate) {
      nextErrors.startDate = 'Start Date is required';
    }

    if (!endDate) {
      nextErrors.endDate = 'End Date is required';
    }

    if (startDate && endDate && startDate.isAfter(endDate, 'day')) {
      nextErrors.range = 'Start Date cannot be after End Date';
    }

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleSearch = () => {
    if (!validateForm()) return;

    const selectedValues = selectedProducts.map((item) => item.value);

    const filtered = mockPayload.filter((row) => {
      const matchesProduct = selectedValues.includes(row.productType);

      const created = dayjs(row.createdDate);
      const matchesStart =
        !startDate ||
        created.isAfter(startDate.startOf('day')) ||
        created.isSame(startDate.startOf('day'));
      const matchesEnd =
        !endDate ||
        created.isBefore(endDate.endOf('day')) ||
        created.isSame(endDate.endOf('day'));

      return matchesProduct && matchesStart && matchesEnd;
    });

    setRows(filtered);
  };

  const handleDownloadCsv = () => {
    const headers = [
      'Group Name',
      'Opportunity ID',
      'Document Name',
      'Product Type',
      'Status',
      'Solaris Submission',
      'Reason Code',
      'Modified By',
      'Created Date',
      'Modified Date',
      'Total Time',
    ];

    const csvRows = rows.map((row) => [
      row.groupName,
      row.opportunityId,
      row.documentName,
      row.productType,
      row.status,
      row.solarisSubmission,
      row.reasonCode,
      row.modifiedBy,
      formatDateTime(row.createdDate),
      formatDateTime(row.modifiedDate),
      row.totalTime,
    ]);

    const csvContent = [headers, ...csvRows]
      .map((r) =>
        r.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')
      )
      .join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `report_${dayjs().format('YYYY-MM-DD_HH-mm')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = useMemo(
    () => [
      { field: 'groupName', headerName: 'Group Name', flex: 1.4, minWidth: 180 },
      {
        field: 'opportunityId',
        headerName: 'Opportunity ID',
        flex: 1.2,
        minWidth: 160,
      },
      {
        field: 'documentName',
        headerName: 'Document Name',
        flex: 1.5,
        minWidth: 200,
      },
      {
        field: 'productType',
        headerName: 'Product Type',
        flex: 1,
        minWidth: 140,
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        minWidth: 130,
        renderCell: (params) => (
          <Chip
            size="small"
            label={params.value}
            sx={{
              backgroundColor: `${getStatusColor(params.value)}15`,
              color: getStatusColor(params.value),
              fontWeight: 600,
            }}
          />
        ),
      },
      {
        field: 'solarisSubmission',
        headerName: 'Solaris Submission',
        flex: 1.1,
        minWidth: 170,
      },
      {
        field: 'reasonCode',
        headerName: 'Reason Code',
        flex: 1,
        minWidth: 140,
      },
      {
        field: 'modifiedBy',
        headerName: 'Modified By',
        flex: 1,
        minWidth: 140,
      },
      {
        field: 'createdDate',
        headerName: 'Created Date',
        flex: 1.3,
        minWidth: 180,
        valueFormatter: (value) => formatDateTime(String(value || '')),
      },
      {
        field: 'modifiedDate',
        headerName: 'Modified Date',
        flex: 1.3,
        minWidth: 180,
        valueFormatter: (value) => formatDateTime(String(value || '')),
      },
      {
        field: 'totalTime',
        headerName: 'Total Time',
        flex: 1,
        minWidth: 120,
      },
    ],
    []
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#fff' }}>
        <Box
          sx={{
            background:
              'linear-gradient(90deg, #3487c7 0%, #1d3f91 45%, #3a31b0 100%)',
            minHeight: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: '#fff',
              fontWeight: 700,
              fontFamily: 'Georgia, serif',
            }}
          >
            Report
          </Typography>
        </Box>

        <Container maxWidth={false} sx={{ px: 2, py: 2 }}>
          <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f5f5f5' }}>
            <Stack
              direction={{ xs: 'column', lg: 'row' }}
              spacing={2}
              alignItems={{ xs: 'stretch', lg: 'flex-start' }}
            >
              <Box sx={{ minWidth: 320, flex: 1.6 }}>
                <Autocomplete
                  multiple
                  options={productOptions}
                  value={selectedProducts}
                  onChange={(_, value) => setSelectedProducts(value)}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Product Type *"
                      error={!!errors.productType}
                      helperText={errors.productType}
                    />
                  )}
                />
              </Box>

              <Box sx={{ minWidth: 220 }}>
                <DatePicker
                  label="Start Date *"
                  value={startDate}
                  onChange={setStartDate}
                  maxDate={today}
                  slotProps={{
                    textField: {
                      error: !!errors.startDate || !!errors.range,
                      helperText: errors.startDate || 'Date Format: mm/dd/yyyy',
                    },
                  }}
                />
              </Box>

              <Box sx={{ minWidth: 220 }}>
                <DatePicker
                  label="End Date *"
                  value={endDate}
                  onChange={setEndDate}
                  maxDate={today}
                  slotProps={{
                    textField: {
                      error: !!errors.endDate || !!errors.range,
                      helperText: errors.endDate || errors.range,
                    },
                  }}
                />
              </Box>

              <Stack direction="row" spacing={1} sx={{ pt: { lg: 1 } }}>
                <Button
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={handleSearch}
                  sx={{
                    borderRadius: 999,
                    px: 3,
                    minHeight: 48,
                    textTransform: 'none',
                    fontWeight: 700,
                  }}
                >
                  Search
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<BarChartIcon />}
                  sx={{ minHeight: 48, textTransform: 'none' }}
                >
                  Analytics
                </Button>
              </Stack>
            </Stack>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'stretch', md: 'center' }}
              spacing={2}
              sx={{ mb: 2 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Report Results
              </Typography>

              <Stack direction="row" spacing={1}>
                <Button variant="outlined">Filter Dataset</Button>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadCsv}
                  disabled={!rows.length}
                >
                  Download
                </Button>
              </Stack>
            </Stack>

            <Box sx={{ height: 540, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10, 25, 50]}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 5, page: 0 },
                  },
                }}
                sx={{
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f5f5f5',
                    fontWeight: 700,
                  },
                }}
                slots={{
                  noRowsOverlay: () => (
                    <Stack height="100%" alignItems="center" justifyContent="center">
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        No Matching Records
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        No results found
                      </Typography>
                    </Stack>
                  ),
                }}
              />
            </Box>
          </Paper>
        </Container>
      </Box>
    </LocalizationProvider>
  );
}