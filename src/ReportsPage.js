import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const TARGET_ACOS = 30;
const CHART_COLORS = ['#f59e0b', '#fbbf24', '#ea580c', '#d97706', '#fb923c', '#fdba74'];

const ROAS_BY_TYPE = [
  { type: 'Sponsored Products', roas: 3.24 },
  { type: 'Sponsored Brands', roas: 2.89 },
  { type: 'Sponsored Display', roas: 4.12 },
];

const SPEND_BY_CAMPAIGN = [
  { name: 'Brand Defense', value: 4218 },
  { name: 'SP Auto', value: 5891 },
  { name: 'Exact Match', value: 4932 },
  { name: 'Seasonal Push', value: 3442 },
  { name: 'Retargeting', value: 2156 },
  { name: 'Other', value: 4208 },
];

const SUMMARY_METRICS = [
  { metric: 'Ad Spend', current: 24847, previous: 22104, format: 'currency' },
  { metric: 'Revenue', current: 85012, previous: 74230, format: 'currency' },
  { metric: 'ROAS', current: 3.42, previous: 3.18, format: 'multiplier' },
  { metric: 'ACoS', current: 29.2, previous: 31.8, format: 'percent' },
  { metric: 'Impressions', current: 1843200, previous: 1621400, format: 'number' },
  { metric: 'Clicks', current: 28420, previous: 25180, format: 'number' },
  { metric: 'CTR', current: 1.54, previous: 1.55, format: 'percent' },
  { metric: 'CPC', current: 0.87, previous: 0.88, format: 'currencyPrecise' },
  { metric: 'Orders', current: 1248, previous: 1092, format: 'number' },
  { metric: 'Conversion Rate', current: 4.39, previous: 4.34, format: 'percent' },
];

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateDailySeries(days, scale = 1) {
  const data = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const seed = i + days * scale;
    const spend = Math.round((720 + seededRandom(seed) * 480) * scale);
    const revenue = Math.round(spend * (2.8 + seededRandom(seed + 1) * 1.4));
    const acos = parseFloat(((spend / revenue) * 100).toFixed(1));
    data.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      spend,
      revenue,
      acos,
    });
  }
  return data;
}

function formatMetricValue(value, format) {
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(value);
    case 'currencyPrecise':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    case 'multiplier':
      return `${value.toFixed(2)}x`;
    case 'percent':
      return `${value.toFixed(1)}%`;
    case 'number':
      return new Intl.NumberFormat('en-US').format(value);
    default:
      return String(value);
  }
}

function formatTooltipValue(entry) {
  const name = entry.name ?? '';
  const value = entry.value;
  if (name === 'acos' || name.includes('ACoS')) {
    return value + '%';
  }
  if (name.toLowerCase().includes('roas')) {
    return value + 'x';
  }
  if (typeof value === 'number' && value > 1000) {
    return value.toLocaleString();
  }
  return value;
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {formatTooltipValue(entry)}
        </p>
      ))}
    </div>
  );
}

function ReportsPage() {
  const [dateRange, setDateRange] = useState('30');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const days = useMemo(() => {
    if (dateRange === '7') return 7;
    if (dateRange === '90') return 90;
    if (dateRange === 'custom' && customStart && customEnd) {
      const start = new Date(customStart);
      const end = new Date(customEnd);
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      return Math.min(Math.max(diff, 7), 90);
    }
    return 30;
  }, [dateRange, customStart, customEnd]);

  const scale = dateRange === '7' ? 0.35 : dateRange === '90' ? 1.15 : 1;

  const dailyData = useMemo(
    () => generateDailySeries(Math.min(days, 30), scale),
    [days, scale]
  );

  const acosData = useMemo(
    () => generateDailySeries(Math.min(days, 30), scale).map(({ date, acos }) => ({ date, acos })),
    [days, scale]
  );

  const handleExport = (type) => {
    alert(`Export ${type} — report for ${days}-day period would download here.`);
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Reports</h2>
          <p className="page-description">
            Performance analytics and period-over-period insights
          </p>
        </div>
        <div className="page-actions">
          <button
            type="button"
            className="btn-export btn-export-pdf"
            onClick={() => handleExport('PDF')}
          >
            Export PDF
          </button>
          <button
            type="button"
            className="btn-export btn-export-csv"
            onClick={() => handleExport('CSV')}
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="reports-toolbar">
        <label className="date-range-label" htmlFor="date-range">
          Date Range
        </label>
        <select
          id="date-range"
          className="filter-select date-range-select"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="custom">Custom</option>
        </select>
        {dateRange === 'custom' && (
          <div className="custom-date-range">
            <input
              type="date"
              className="date-input"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              aria-label="Start date"
            />
            <span className="date-separator">to</span>
            <input
              type="date"
              className="date-input"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              aria-label="End date"
            />
          </div>
        )}
        <span className="reports-period-hint">
          Showing {Math.min(days, 30)} days of daily data
        </span>
      </div>

      <div className="charts-grid">
        <article className="chart-card chart-card-wide">
          <h3 className="chart-title">Daily Spend vs Revenue</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dailyData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3142" />
              <XAxis dataKey="date" tick={{ fill: '#8b93a8', fontSize: 11 }} interval="preserveStartEnd" />
              <YAxis tick={{ fill: '#8b93a8', fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ color: '#8b93a8' }} />
              <Line
                type="monotone"
                dataKey="spend"
                name="Spend"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#fbbf24' }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#34d399"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#34d399' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </article>

        <article className="chart-card">
          <h3 className="chart-title">ROAS by Campaign Type</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={ROAS_BY_TYPE} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3142" vertical={false} />
              <XAxis
                dataKey="type"
                tick={{ fill: '#8b93a8', fontSize: 10 }}
                interval={0}
                angle={-12}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fill: '#8b93a8', fontSize: 11 }} domain={[0, 5]} tickFormatter={(v) => `${v}x`} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="roas" name="ROAS" radius={[6, 6, 0, 0]}>
                {ROAS_BY_TYPE.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </article>

        <article className="chart-card">
          <h3 className="chart-title">Spend by Campaign</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={SPEND_BY_CAMPAIGN}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={2}
              >
                {SPEND_BY_CAMPAIGN.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                wrapperStyle={{ color: '#8b93a8', fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </article>

        <article className="chart-card chart-card-wide">
          <h3 className="chart-title">ACoS Trend (Target: {TARGET_ACOS}%)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={acosData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3142" />
              <XAxis dataKey="date" tick={{ fill: '#8b93a8', fontSize: 11 }} interval="preserveStartEnd" />
              <YAxis tick={{ fill: '#8b93a8', fontSize: 11 }} domain={[15, 45]} tickFormatter={(v) => `${v}%`} />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine
                y={TARGET_ACOS}
                stroke="#60a5fa"
                strokeDasharray="6 4"
                label={{
                  value: `Target ${TARGET_ACOS}%`,
                  fill: '#60a5fa',
                  fontSize: 11,
                  position: 'insideTopRight',
                }}
              />
              <Line
                type="monotone"
                dataKey="acos"
                name="ACoS"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: '#fbbf24' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </article>
      </div>

      <section className="campaigns-section reports-summary-section">
        <div className="section-header">
          <h3 className="section-title">Period Comparison</h3>
          <span className="section-subtitle">This period vs previous period</span>
        </div>
        <div className="table-wrapper">
          <table className="campaigns-table reports-comparison-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>This Period</th>
                <th>Last Period</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              {SUMMARY_METRICS.map((row) => {
                const isLowerBetter =
                  row.metric === 'ACoS' || row.metric === 'CPC';
                const pctChange =
                  row.previous === 0
                    ? 0
                    : ((row.current - row.previous) / row.previous) * 100;
                const improved = isLowerBetter
                  ? row.current < row.previous
                  : row.current > row.previous;
                const changeLabel =
                  row.format === 'multiplier'
                    ? `${row.current >= row.previous ? '+' : ''}${(row.current - row.previous).toFixed(2)}x`
                    : `${pctChange >= 0 ? '+' : ''}${pctChange.toFixed(1)}%`;

                return (
                  <tr key={row.metric} className="clickable-row">
                    <td className="metric-name-cell">{row.metric}</td>
                    <td className="period-current">
                      {formatMetricValue(row.current, row.format)}
                    </td>
                    <td>{formatMetricValue(row.previous, row.format)}</td>
                    <td
                      className={
                        improved ? 'change-positive' : 'change-negative'
                      }
                    >
                      {changeLabel}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export default ReportsPage;
