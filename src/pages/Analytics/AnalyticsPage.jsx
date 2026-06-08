import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './AnalyticsPage.css';
import {
  Box,
  Button,
  Tab,
  Tabs,
  TextField,
  Autocomplete,
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
import { fetchAnalytics } from '../../redux/apis/analytics/action';
import { useBusiness } from '../../context/businessContext';
import { ACTIVE_BUSINESSES } from '../../config/businesses';

const businessOptions = ACTIVE_BUSINESSES.map((business) => ({
  label: business,
  value: business,
}));

const getStatusColor = (status) => {
  const s = String(status || '').toUpperCase();

  if (s === 'COMPLETED') return '#168a5a';
  if (s === 'FAILED') return '#b42318';
  if (s === 'PROCESSING') return '#b58a00';
  if (s === 'INGESTED') return '#0e3b34';

  return '#5f6f68';
};

const getBusinessOption = (business) => {
  if (!business) return businessOptions[0];

  return (
    businessOptions.find((option) => option.value === business) || {
      label: business,
      value: business,
    }
  );
};

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
          <Bar dataKey="count" fill="#00856f" radius={[0, 6, 6, 0]} />
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
            stroke="#00856f"
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
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.analytics.loading);
  const { selectedBusiness: activeBusiness } = useBusiness();
  const yesterday = dayjs().subtract(1, 'day');
  const today = dayjs();

 const [selectedBusiness, setSelectedBusiness] = useState(() =>
   getBusinessOption(activeBusiness)
 );
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

const handleSearch = async () => {
  if (!validateForm()) return;

  const payload = {
    business: selectedBusiness.value,
    startDate: startDate.format('YYYY-MM-DD'),
    endDate: endDate.format('YYYY-MM-DD'),
  };

  try {
    const {
      dailyTransactions,
      monthlyTransactions,
      productPopularity,
      statusSummary,
      weeklyTransactions,
    } = await dispatch(fetchAnalytics(payload));

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
  }
};

  useEffect(() => {
    if (!activeBusiness) return;

    const nextBusiness = getBusinessOption(activeBusiness);
    setSelectedBusiness(nextBusiness);

    const autoLoadAnalytics = async () => {
      const payload = {
        business: nextBusiness.value,
        startDate: yesterday.format('YYYY-MM-DD'),
        endDate: today.format('YYYY-MM-DD'),
      };

      try {
        const {
          dailyTransactions,
          monthlyTransactions,
          productPopularity,
          statusSummary,
          weeklyTransactions,
        } = await dispatch(fetchAnalytics(payload));

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
      }
    };

    autoLoadAnalytics();
    // Auto-load analytics on route entry/business change with selected business and yesterday/today.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBusiness, dispatch]);

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
