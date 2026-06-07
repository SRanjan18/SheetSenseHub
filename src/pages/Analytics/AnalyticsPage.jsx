import React, { useEffect, useMemo, useState } from 'react';
import './AnalyticsPage.css';
import {
  Box,
  Button,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  Autocomplete,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';

const productOptions = [
  { label: 'SB', value: 'SB' },
  { label: 'OCC', value: 'OCC' },
  { label: 'UST:MED:SUB', value: 'UST:MED:SUB' },
  { label: 'UST:MED:MLC', value: 'UST:MED:MLC' },
  { label: 'VO:MED:SUB', value: 'VO:MED:SUB' },
];

const mockStatusData = [
  { name: 'Success', value: 18, color: '#007000' },
  { name: 'Check', value: 7, color: '#F5B700' },
  { name: 'Critical Check', value: 4, color: '#E40046' },
  { name: 'Processing Failure', value: 2, color: '#020202' },
];
const businessOptions = [
  { label: 'AccountSphere (AS)', value: 'AccountSphere (AS)' },
  { label: 'BillingHub (BH)', value: 'BillingHub (BH)' },
  { label: 'UnderwritePro (UP)', value: 'UnderwritePro (UP)' },
];

const getStatusColor = (status) => {
  const s = String(status || '').toUpperCase();

  if (s === 'COMPLETED') return '#007000';
  if (s === 'FAILED') return '#E40046';
  if (s === 'PROCESSING') return '#F5B700';
  if (s === 'INGESTED') return '#3a31b0';

  return '#616161';
};
const mockReasonCodeData = [
  { reasonCode: 'RC-101', count: 10 },
  { reasonCode: 'RC-404', count: 7 },
  { reasonCode: 'RC-222', count: 5 },
  { reasonCode: 'RC-909', count: 3 },
  { reasonCode: 'RC-712', count: 2 },
];

const mockDailyTxnData = [
  { date: '05/27', count: 2 },
  { date: '05/28', count: 4 },
  { date: '05/29', count: 3 },
  { date: '05/30', count: 7 },
  { date: '05/31', count: 5 },
  { date: '06/01', count: 8 },
];

const mockWeeklyTxnData = [
  { date: 'Week 1', count: 14 },
  { date: 'Week 2', count: 22 },
  { date: 'Week 3', count: 17 },
  { date: 'Week 4', count: 26 },
];

const mockMonthlyTxnData = [
  { date: 'Jan', count: 42 },
  { date: 'Feb', count: 38 },
  { date: 'Mar', count: 51 },
  { date: 'Apr', count: 47 },
  { date: 'May', count: 63 },
  { date: 'Jun', count: 58 },
];

function EmptyPanel({ title, height = '240px', children }) {
  return (
    <section className="analytics-panel" style={{ minHeight: height }}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function EmptyState({ text = 'No data to display.' }) {
  return <div className="analytics-empty-box">{text}</div>;
}

function StatusChart({ data }) {
  if (!data || !data.length) {
    return <EmptyState />;
  }

  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={95}
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function ProductPopularityChart({ data }) {
  if (!data || !data.length) {
    return (
      <div className="analytics-chart-placeholder">
        <div className="analytics-chart-placeholder__y">Reason Code</div>
        <div className="analytics-chart-placeholder__center">No data to display.</div>
        <div className="analytics-chart-placeholder__x">Count</div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 620 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 70, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" label={{ value: 'Count', position: 'insideBottom', offset: -5 }} />
          <YAxis
            type="category"
            dataKey="reasonCode"
            // label={{ value: 'Reason Code', angle: -90, position: 'insideLeft' }}
            width={100}
          />
          <Tooltip />
          <Bar dataKey="count" fill="#3a31b0" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function TransactionChart({ title, data }) {
  if (!data || !data.length) {
    return <EmptyState />;
  }

  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" label={{ value: 'Date', position: 'insideBottom', offset: -5 }} />
          <YAxis allowDecimals={false} label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="count"
            name={title}
            stroke="#6b4eff"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function AnalyticsPage() {
  const yesterday = dayjs().subtract(1, 'day');
  const today = dayjs();

 const [selectedBusiness, setSelectedBusiness] = useState(businessOptions[0]);
const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(yesterday);
  const [endDate, setEndDate] = useState(today);
  const [errors, setErrors] = useState({
  business: '',
  startDate: '',
  endDate: '',
  range: '',
});

  const [selectedTab, setSelectedTab] = useState(0);

  const [statusData, setStatusData] = useState([]);
  const [reasonCodeData, setReasonCodeData] = useState([]);
  const [dailyTxnData, setDailyTxnData] = useState([]);
  const [weeklyTxnData, setWeeklyTxnData] = useState([]);
  const [monthlyTxnData, setMonthlyTxnData] = useState([]);

  const validateForm = () => {
    const nextErrors = {
  business: '',
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

const API_BASE_URL = 'https://sheetsensehubbackend-1.onrender.com';

const callAnalyticsApi = async (endpoint, payload) => {
  const response = await fetch(`${API_BASE_URL}/api/analytics/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`${endpoint} failed`);
  }

  return response.json();
};
const handleSearch = async () => {
  if (!validateForm()) return;

  setLoading(true);

  const payload = {
    business: selectedBusiness.value,
    startDate: startDate.format('YYYY-MM-DD'),
    endDate: endDate.format('YYYY-MM-DD'),
  };

  try {
    const results = await Promise.allSettled([
      callAnalyticsApi('status-summary', payload),
      callAnalyticsApi('product-popularity', payload),
      callAnalyticsApi('daily-transactions', payload),
      callAnalyticsApi('weekly-transactions', payload),
      callAnalyticsApi('monthly-transactions', payload),
    ]);

    const statusSummary =
      results[0].status === 'fulfilled' ? results[0].value : [];

    const productPopularity =
      results[1].status === 'fulfilled' ? results[1].value : [];

    const dailyTransactions =
      results[2].status === 'fulfilled' ? results[2].value : [];

    const weeklyTransactions =
      results[3].status === 'fulfilled' ? results[3].value : [];

    const monthlyTransactions =
      results[4].status === 'fulfilled' ? results[4].value : [];

    setStatusData(
      statusSummary.map((item) => ({
        name: item.name,
        value: item.value,
        color: getStatusColor(item.name),
      }))
    );

    setReasonCodeData(
      productPopularity.map((item) => ({
        reasonCode: item.name,
        count: item.value,
      }))
    );

    setDailyTxnData(
      dailyTransactions.map((item) => ({
        date: item.name,
        count: item.value,
      }))
    );

    setWeeklyTxnData(
      weeklyTransactions.map((item) => ({
        date: item.name,
        count: item.value,
      }))
    );

    setMonthlyTxnData(
      monthlyTransactions.map((item) => ({
        date: item.name,
        count: item.value,
      }))
    );
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    handleSearch();
  }, []);

  const transactionTitle = useMemo(() => {
    if (selectedTab === 0) return 'Daily Transaction Count Chart';
    if (selectedTab === 1) return 'Weekly Transaction Count Chart';
    return 'Monthly Transaction Count Chart';
  }, [selectedTab]);

  const transactionData = useMemo(() => {
    if (selectedTab === 0) return dailyTxnData;
    if (selectedTab === 1) return weeklyTxnData;
    return monthlyTxnData;
  }, [selectedTab, dailyTxnData, weeklyTxnData, monthlyTxnData]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="analytics-page">
        <section className="analytics-filter-bar">
          <div className="analytics-field analytics-field--wide analytics-field--mui">
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
          </div>

          <div className="analytics-field analytics-field--mui">
            <DatePicker
              label="Start Date *"
              value={startDate}
              onChange={setStartDate}
              maxDate={today}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.startDate || !!errors.range,
                  helperText: errors.startDate || 'Date Format: mm/dd/yyyy',
                },
              }}
            />
          </div>

          <div className="analytics-field analytics-field--mui">
            <DatePicker
              label="End Date *"
              value={endDate}
              onChange={setEndDate}
              maxDate={today}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.endDate || !!errors.range,
                  helperText: errors.endDate || errors.range,
                },
              }}
            />
          </div>

          <div className="analytics-actions-top analytics-actions-top--mui">
            <Button
  variant="contained"
  startIcon={<SearchIcon />}
  onClick={handleSearch}
  className="analytics-search-btn-mui"
  disabled={loading}
>
  {loading ? 'Searching...' : 'Search'}
</Button>
          </div>
        </section>

        <EmptyPanel title="Status" height="380px">
          <StatusChart data={statusData} />
        </EmptyPanel>

          <EmptyPanel title="Product Popularity Chart" height="700px">
          <ProductPopularityChart data={reasonCodeData} />
        </EmptyPanel>

        <EmptyPanel title={transactionTitle} height="380px">
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={selectedTab} onChange={(_, value) => setSelectedTab(value)}>
              <Tab label="Daily" />
              <Tab label="Weekly" />
              <Tab label="Monthly" />
            </Tabs>
          </Box>

          <TransactionChart title={transactionTitle} data={transactionData} />
        </EmptyPanel>
      </div>
    </LocalizationProvider>
  );
}