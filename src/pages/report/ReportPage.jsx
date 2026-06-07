import React, { useMemo, useState } from 'react';
import {Box,Button,Chip,Container,Paper,Stack,TextField,Typography,Autocomplete,} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import BarChartIcon from '@mui/icons-material/BarChart';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const businessOptions = [
  { label: 'AccountSphere (AS)', value: 'AccountSphere (AS)' },
  { label: 'BillingHub (BH)', value: 'BillingHub (BH)' },
  { label: 'UnderwritePro (UP)', value: 'UnderwritePro (UP)' },
];
const API_BASE_URL = 'https://sheetsensehubbackend-1.onrender.com';

const formatDateTime = (value) => {
  if (!value) return '';
  return dayjs(value).format('MM/DD/YYYY, hh:mm:ss A');
};

const getStatusColor = (status) => {
  const s = String(status || '').toUpperCase();

  if (s === 'COMPLETED') return '#007000';
  if (s === 'FAILED') return '#E40046';
  if (s === 'PROCESSING') return '#F5B700';
  if (s === 'INGESTED') return '#3a31b0';

  return '#616161';
};

export default function ReportPage() {
  const yesterday = dayjs().subtract(1, 'day');
  const today = dayjs();
const [selectedBusiness, setSelectedBusiness] = useState(businessOptions[0]);
const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(yesterday);
  const [endDate, setEndDate] = useState(today);
  const [rows, setRows] = useState([]);
  const [errors, setErrors] = useState({
  business: '',
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

   if (!selectedBusiness) {
  nextErrors.business = 'Business is required';
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

const handleSearch = async () => {
  if (!validateForm()) return;

  setLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/api/ingestions/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        business: selectedBusiness.value,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch report data');
    }

    const data = await response.json();
    console.log('Mapping item:', data);
    const mappedRows = data.map((item, index) => ({
  
      id: item.txnUuid || index + 1,
      txnUuid: item.txnUuid,
      organization: item.organizationName || item.organization || '',
      requestId: item.requestId || '',
      business: item.businessName || item.business || '',
      status: item.status,
      outputFileName: item.outputFileName || '',
      createdDate: item.createdAt,
      category: item.products.map((cat) => cat.category),
      profile: item.products.map((cat) => cat.profile),
      downloadUrl: item.outputFileName
        ? `${API_BASE_URL}/api/files/download/${item.outputFileName}`
        : '',
    }));

    setRows(mappedRows);
  } catch (error) {
    console.error(error);
    setRows([]);
  } finally {
    setLoading(false);
  }
};

  const handleDownloadCsv = () => {
    const headers = [
      'Client Organization',
      'Request ID',
      'Document Name',
      'Business Process',
      'Status',
      'Solaris Submission',
      'Reason Code',
      'Modified By',
      'Created Date',
      'Modified Date',
      'Total Time',
    ];

    const csvRows = rows.map((row) => [
      row.organization,
      row.requestId,
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
    { field: 'txnUuid', headerName: 'Transaction ID', flex: 1.5, minWidth: 220 },
    { field: 'organization', headerName: 'Organization', flex: 1.2, minWidth: 180 },
    { field: 'requestId', headerName: 'Request ID', flex: 1, minWidth: 150 },
    { field: 'business', headerName: 'Business', flex: 1.2, minWidth: 180 },
    { field: 'category', headerName: 'Category', flex: 1, minWidth: 140 },
    { field: 'profile', headerName: 'Profile', flex: 1, minWidth: 130 },
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
    { field: 'outputFileName', headerName: 'Output File', flex: 1.8, minWidth: 260 },
    {
      field: 'createdDate',
      headerName: 'Created Date',
      flex: 1.3,
      minWidth: 180,
      valueFormatter: (value) => formatDateTime(String(value || '')),
    },
    {
      field: 'download',
      headerName: 'Download',
      flex: 0.8,
      minWidth: 130,
      renderCell: (params) =>
        params.row.downloadUrl ? (
          <Button
            size="small"
            startIcon={<DownloadIcon />}
            onClick={() => window.open(params.row.downloadUrl, '_blank')}
          >
            File
          </Button>
        ) : (
          '-'
        ),
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
  options={businessOptions}
  value={selectedBusiness}
  onChange={(_, value) => setSelectedBusiness(value)}
  getOptionLabel={(option) => option.label}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Business *"
      error={!!errors.business}
      helperText={errors.business}
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
                 loading={loading}
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