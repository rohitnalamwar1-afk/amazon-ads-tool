import { useMemo, useState } from 'react';
import { LoginPage, SignupPage } from './AuthPages';
import ReportsPage from './ReportsPage';
import SettingsPage from './SettingsPage';
import './App.css';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '◫' },
  { id: 'campaigns', label: 'Campaigns', icon: '◎' },
  { id: 'keywords', label: 'Keywords', icon: '⌕' },
  { id: 'reports', label: 'Reports', icon: '▤' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
];

const METRICS = [
  {
    label: 'Total Spend',
    value: '$24,847',
    change: '+12.4%',
    trend: 'up',
    sub: 'vs last 30 days',
  },
  {
    label: 'ROAS',
    value: '3.42x',
    change: '+8.1%',
    trend: 'up',
    sub: 'return on ad spend',
  },
  {
    label: 'ACoS',
    value: '29.2%',
    change: '-2.3%',
    trend: 'down',
    sub: 'advertising cost of sale',
  },
  {
    label: 'Active Campaigns',
    value: '18',
    change: '+2',
    trend: 'up',
    sub: 'of 24 total campaigns',
  },
];

const INITIAL_CAMPAIGNS = [
  {
    id: 1,
    name: 'Brand Defense — Core ASINs',
    type: 'Sponsored Products',
    status: 'Active',
    dailyBudget: 150,
    totalSpend: 4218,
    impressions: 248320,
    clicks: 4120,
    ctr: 1.66,
    roas: 4.12,
    acos: 24.3,
  },
  {
    id: 2,
    name: 'Sponsored Products — Auto Targeting',
    type: 'Sponsored Products',
    status: 'Active',
    dailyBudget: 200,
    totalSpend: 5891,
    impressions: 412500,
    clicks: 6842,
    ctr: 1.66,
    roas: 2.87,
    acos: 34.8,
  },
  {
    id: 3,
    name: 'Competitor Conquest — Top 5',
    type: 'Sponsored Products',
    status: 'Paused',
    dailyBudget: 75,
    totalSpend: 1204,
    impressions: 89200,
    clicks: 1180,
    ctr: 1.32,
    roas: 1.94,
    acos: 51.6,
  },
  {
    id: 4,
    name: 'Summer Collection — Seasonal Push',
    type: 'Sponsored Brands',
    status: 'Active',
    dailyBudget: 120,
    totalSpend: 3442,
    impressions: 156800,
    clicks: 2890,
    ctr: 1.84,
    roas: 3.65,
    acos: 27.4,
  },
  {
    id: 5,
    name: 'Retargeting — Cart Abandoners',
    type: 'Sponsored Display',
    status: 'Active',
    dailyBudget: 80,
    totalSpend: 2156,
    impressions: 198400,
    clicks: 3210,
    ctr: 1.62,
    roas: 5.21,
    acos: 19.2,
  },
  {
    id: 6,
    name: 'Broad Match — Discovery',
    type: 'Sponsored Products',
    status: 'Learning',
    dailyBudget: 100,
    totalSpend: 1890,
    impressions: 124600,
    clicks: 1742,
    ctr: 1.4,
    roas: 2.41,
    acos: 41.5,
  },
  {
    id: 7,
    name: 'Store Spotlight — Brand Store',
    type: 'Sponsored Brands',
    status: 'Active',
    dailyBudget: 90,
    totalSpend: 2678,
    impressions: 98400,
    clicks: 1956,
    ctr: 1.99,
    roas: 3.18,
    acos: 31.4,
  },
  {
    id: 8,
    name: 'Video Ads — Product Launch',
    type: 'Sponsored Brands',
    status: 'Paused',
    dailyBudget: 60,
    totalSpend: 892,
    impressions: 45200,
    clicks: 680,
    ctr: 1.5,
    roas: 2.08,
    acos: 48.1,
  },
  {
    id: 9,
    name: 'Remarketing — Views & Purchases',
    type: 'Sponsored Display',
    status: 'Learning',
    dailyBudget: 110,
    totalSpend: 1543,
    impressions: 167200,
    clicks: 2410,
    ctr: 1.44,
    roas: 2.96,
    acos: 33.8,
  },
  {
    id: 10,
    name: 'Exact Match — High Intent Keywords',
    type: 'Sponsored Products',
    status: 'Active',
    dailyBudget: 175,
    totalSpend: 4932,
    impressions: 289100,
    clicks: 5280,
    ctr: 1.83,
    roas: 3.89,
    acos: 25.7,
  },
];

const INITIAL_KEYWORDS = [
  {
    id: 1,
    keyword: 'wireless earbuds noise cancelling',
    matchType: 'Exact',
    campaign: 'Brand Defense — Core ASINs',
    status: 'Active',
    bid: 1.85,
    impressions: 48200,
    clicks: 892,
    cpc: 1.42,
    spend: 1267,
    roas: 4.85,
    acos: 20.6,
    suggestedAction: 'Keep',
    performance: 'High Performing',
  },
  {
    id: 2,
    keyword: 'bluetooth headphones',
    matchType: 'Phrase',
    campaign: 'Sponsored Products — Auto Targeting',
    status: 'Active',
    bid: 1.45,
    impressions: 62400,
    clicks: 1104,
    cpc: 1.18,
    spend: 1303,
    roas: 3.12,
    acos: 32.1,
    suggestedAction: 'Keep',
    performance: 'High Performing',
  },
  {
    id: 3,
    keyword: 'cheap earbuds',
    matchType: 'Broad',
    campaign: 'Broad Match — Discovery',
    status: 'Active',
    bid: 0.95,
    impressions: 89200,
    clicks: 420,
    cpc: 0.88,
    spend: 370,
    roas: 0.82,
    acos: 121.9,
    suggestedAction: 'Pause',
    performance: 'Wasted Spend',
  },
  {
    id: 4,
    keyword: 'northpeak audio pro',
    matchType: 'Exact',
    campaign: 'Brand Defense — Core ASINs',
    status: 'Active',
    bid: 2.1,
    impressions: 12800,
    clicks: 456,
    cpc: 1.65,
    spend: 752,
    roas: 5.42,
    acos: 18.4,
    suggestedAction: 'Increase Bid',
    performance: 'High Performing',
  },
  {
    id: 5,
    keyword: 'workout earbuds sweatproof',
    matchType: 'Phrase',
    campaign: 'Exact Match — High Intent Keywords',
    status: 'Active',
    bid: 1.6,
    impressions: 35600,
    clicks: 628,
    cpc: 1.35,
    spend: 848,
    roas: 3.78,
    acos: 26.5,
    suggestedAction: 'Keep',
    performance: 'High Performing',
  },
  {
    id: 6,
    keyword: 'earbuds for running',
    matchType: 'Broad',
    campaign: 'Broad Match — Discovery',
    status: 'Active',
    bid: 1.2,
    impressions: 54100,
    clicks: 312,
    cpc: 1.05,
    spend: 328,
    roas: 1.42,
    acos: 70.4,
    suggestedAction: 'Reduce Bid',
    performance: 'Underperforming',
  },
  {
    id: 7,
    keyword: 'competitor brand x earbuds',
    matchType: 'Exact',
    campaign: 'Competitor Conquest — Top 5',
    status: 'Paused',
    bid: 2.45,
    impressions: 18400,
    clicks: 186,
    cpc: 2.12,
    spend: 394,
    roas: 1.18,
    acos: 84.7,
    suggestedAction: 'Pause',
    performance: 'Wasted Spend',
  },
  {
    id: 8,
    keyword: 'true wireless earbuds 2024',
    matchType: 'Phrase',
    campaign: 'Summer Collection — Seasonal Push',
    status: 'Active',
    bid: 1.35,
    impressions: 29800,
    clicks: 512,
    cpc: 1.22,
    spend: 625,
    roas: 2.94,
    acos: 34.0,
    suggestedAction: 'Reduce Bid',
    performance: 'Underperforming',
  },
  {
    id: 9,
    keyword: 'premium sound earbuds',
    matchType: 'Exact',
    campaign: 'Exact Match — High Intent Keywords',
    status: 'Active',
    bid: 1.75,
    impressions: 22100,
    clicks: 398,
    cpc: 1.48,
    spend: 589,
    roas: 4.21,
    acos: 23.8,
    suggestedAction: 'Increase Bid',
    performance: 'High Performing',
  },
  {
    id: 10,
    keyword: 'free shipping earbuds',
    matchType: 'Broad',
    campaign: 'Sponsored Products — Auto Targeting',
    status: 'Active',
    bid: 0.75,
    impressions: 112400,
    clicks: 890,
    cpc: 0.62,
    spend: 552,
    roas: 0.64,
    acos: 156.3,
    suggestedAction: 'Pause',
    performance: 'Wasted Spend',
  },
  {
    id: 11,
    keyword: 'anc earbuds long battery',
    matchType: 'Phrase',
    campaign: 'Brand Defense — Core ASINs',
    status: 'Active',
    bid: 1.55,
    impressions: 41200,
    clicks: 724,
    cpc: 1.31,
    spend: 948,
    roas: 3.56,
    acos: 28.1,
    suggestedAction: 'Keep',
    performance: 'High Performing',
  },
  {
    id: 12,
    keyword: 'earbuds under 50',
    matchType: 'Broad',
    campaign: 'Broad Match — Discovery',
    status: 'Learning',
    bid: 0.85,
    impressions: 67800,
    clicks: 245,
    cpc: 0.79,
    spend: 194,
    roas: 2.08,
    acos: 48.1,
    suggestedAction: 'Reduce Bid',
    performance: 'Underperforming',
  },
];

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(value);
}

function formatCurrencyPrecise(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function StatusBadge({ status }) {
  const slug = status.toLowerCase();
  return <span className={`status-badge status-${slug}`}>{status}</span>;
}

function TypeBadge({ type }) {
  const slug = type.toLowerCase().replace(/\s+/g, '-');
  return <span className={`type-badge type-${slug}`}>{type}</span>;
}

function MatchTypeBadge({ matchType }) {
  const slug = matchType.toLowerCase();
  return <span className={`match-badge match-${slug}`}>{matchType}</span>;
}

function ActionBadge({ action }) {
  const slug = action.toLowerCase().replace(/\s+/g, '-');
  return <span className={`action-badge action-${slug}`}>{action}</span>;
}

function DashboardPage({ campaigns, onViewCampaigns }) {
  const preview = campaigns.slice(0, 6);

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Dashboard</h2>
          <p className="page-description">
            Overview of your Amazon advertising performance
          </p>
        </div>
        <div className="page-actions">
          <select className="date-select" defaultValue="30" aria-label="Date range">
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <button type="button" className="btn-primary">
            Export Report
          </button>
        </div>
      </div>

      <section className="metrics-grid">
        {METRICS.map((metric) => (
          <article key={metric.label} className="metric-card">
            <p className="metric-label">{metric.label}</p>
            <p className="metric-value">{metric.value}</p>
            <div className="metric-footer">
              <span
                className={`metric-change ${
                  metric.trend === 'up' ? 'positive' : 'negative'
                }`}
              >
                {metric.change}
              </span>
              <span className="metric-sub">{metric.sub}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="campaigns-section">
        <div className="section-header">
          <h3 className="section-title">Campaign Performance</h3>
          <button type="button" className="btn-ghost" onClick={onViewCampaigns}>
            View all campaigns →
          </button>
        </div>
        <div className="table-wrapper">
          <table className="campaigns-table">
            <thead>
              <tr>
                <th>Campaign Name</th>
                <th>Status</th>
                <th>Budget</th>
                <th>Spend</th>
                <th>ROAS</th>
                <th>ACoS</th>
              </tr>
            </thead>
            <tbody>
              {preview.map((campaign) => (
                <tr key={campaign.id} className="clickable-row">
                  <td className="campaign-name">{campaign.name}</td>
                  <td>
                    <StatusBadge status={campaign.status} />
                  </td>
                  <td>{formatCurrency(campaign.dailyBudget)}/day</td>
                  <td className="spend-cell">{formatCurrency(campaign.totalSpend)}</td>
                  <td className="roas-cell">{campaign.roas.toFixed(2)}x</td>
                  <td className="acos-cell">{campaign.acos.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function CampaignsPage({ campaigns, setCampaigns }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedId, setSelectedId] = useState(null);

  const filtered = useMemo(() => {
    return campaigns.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'All' || c.status === statusFilter;
      const matchesType = typeFilter === 'All' || c.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [campaigns, search, statusFilter, typeFilter]);

  const summary = useMemo(() => {
    const totalBudget = filtered.reduce((sum, c) => sum + c.dailyBudget, 0);
    const totalSpend = filtered.reduce((sum, c) => sum + c.totalSpend, 0);
    const avgRoas =
      filtered.length > 0
        ? filtered.reduce((sum, c) => sum + c.roas, 0) / filtered.length
        : 0;
    return { count: filtered.length, totalBudget, totalSpend, avgRoas };
  }, [filtered]);

  const togglePause = (id, e) => {
    e.stopPropagation();
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const nextStatus = c.status === 'Paused' ? 'Active' : 'Paused';
        return { ...c, status: nextStatus };
      })
    );
  };

  const handleEdit = (id, e) => {
    e.stopPropagation();
    setSelectedId(id);
    alert(`Edit campaign: ${campaigns.find((c) => c.id === id)?.name}`);
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Campaigns</h2>
          <p className="page-description">
            Manage and optimize your Amazon advertising campaigns
          </p>
        </div>
        <button type="button" className="btn-create">
          + Create Campaign
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <span className="search-icon" aria-hidden="true">
            ⌕
          </span>
          <input
            type="search"
            className="search-input"
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search campaigns"
          />
        </div>
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Paused">Paused</option>
          <option value="Learning">Learning</option>
        </select>
        <select
          className="filter-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          aria-label="Filter by type"
        >
          <option value="All">All Types</option>
          <option value="Sponsored Products">Sponsored Products</option>
          <option value="Sponsored Brands">Sponsored Brands</option>
          <option value="Sponsored Display">Sponsored Display</option>
        </select>
        {(search || statusFilter !== 'All' || typeFilter !== 'All') && (
          <button
            type="button"
            className="btn-clear-filters"
            onClick={() => {
              setSearch('');
              setStatusFilter('All');
              setTypeFilter('All');
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="summary-bar">
        <div className="summary-item">
          <span className="summary-label">Total Campaigns</span>
          <span className="summary-value">{summary.count}</span>
        </div>
        <div className="summary-divider" />
        <div className="summary-item">
          <span className="summary-label">Total Budget</span>
          <span className="summary-value">
            {formatCurrency(summary.totalBudget)}/day
          </span>
        </div>
        <div className="summary-divider" />
        <div className="summary-item">
          <span className="summary-label">Total Spend</span>
          <span className="summary-value">{formatCurrency(summary.totalSpend)}</span>
        </div>
        <div className="summary-divider" />
        <div className="summary-item">
          <span className="summary-label">Avg ROAS</span>
          <span className="summary-value summary-roas">
            {summary.avgRoas.toFixed(2)}x
          </span>
        </div>
      </div>

      <section className="campaigns-section campaigns-page-table">
        <div className="table-wrapper">
          <table className="campaigns-table campaigns-table-detailed">
            <thead>
              <tr>
                <th>Campaign Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Daily Budget</th>
                <th>Total Spend</th>
                <th>Impressions</th>
                <th>Clicks</th>
                <th>CTR</th>
                <th>ROAS</th>
                <th>ACoS</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="empty-state">
                    No campaigns match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((campaign) => (
                  <tr
                    key={campaign.id}
                    className={`clickable-row ${
                      selectedId === campaign.id ? 'row-selected' : ''
                    }`}
                    onClick={() => setSelectedId(campaign.id)}
                  >
                    <td className="campaign-name">{campaign.name}</td>
                    <td>
                      <TypeBadge type={campaign.type} />
                    </td>
                    <td>
                      <StatusBadge status={campaign.status} />
                    </td>
                    <td>{formatCurrency(campaign.dailyBudget)}</td>
                    <td className="spend-cell">
                      {formatCurrency(campaign.totalSpend)}
                    </td>
                    <td>{formatNumber(campaign.impressions)}</td>
                    <td>{formatNumber(campaign.clicks)}</td>
                    <td>{campaign.ctr.toFixed(2)}%</td>
                    <td className="roas-cell">{campaign.roas.toFixed(2)}x</td>
                    <td className="acos-cell">{campaign.acos.toFixed(1)}%</td>
                    <td className="actions-cell" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="btn-action btn-pause"
                        onClick={(e) => togglePause(campaign.id, e)}
                      >
                        {campaign.status === 'Paused' ? 'Resume' : 'Pause'}
                      </button>
                      <button
                        type="button"
                        className="btn-action btn-edit"
                        onClick={(e) => handleEdit(campaign.id, e)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function KeywordsPage({ keywords }) {
  const [search, setSearch] = useState('');
  const [matchFilter, setMatchFilter] = useState('All');
  const [performanceFilter, setPerformanceFilter] = useState('All');
  const [selectedId, setSelectedId] = useState(null);

  const filtered = useMemo(() => {
    return keywords.filter((kw) => {
      const matchesSearch = kw.keyword
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesMatch =
        matchFilter === 'All' || kw.matchType === matchFilter;
      const matchesPerformance =
        performanceFilter === 'All' || kw.performance === performanceFilter;
      return matchesSearch && matchesMatch && matchesPerformance;
    });
  }, [keywords, search, matchFilter, performanceFilter]);

  const summary = useMemo(() => {
    const totalSpend = filtered.reduce((sum, kw) => sum + kw.spend, 0);
    const avgCpc =
      filtered.length > 0
        ? filtered.reduce((sum, kw) => sum + kw.cpc, 0) / filtered.length
        : 0;
    const avgAcos =
      filtered.length > 0
        ? filtered.reduce((sum, kw) => sum + kw.acos, 0) / filtered.length
        : 0;
    return { count: filtered.length, totalSpend, avgCpc, avgAcos };
  }, [filtered]);

  const hasFilters =
    search || matchFilter !== 'All' || performanceFilter !== 'All';

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Keywords</h2>
          <p className="page-description">
            Analyze keyword performance and optimize bids
          </p>
        </div>
        <button type="button" className="btn-add-keywords">
          + Add Keywords
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <span className="search-icon" aria-hidden="true">
            ⌕
          </span>
          <input
            type="search"
            className="search-input"
            placeholder="Search keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search keywords"
          />
        </div>
        <select
          className="filter-select"
          value={matchFilter}
          onChange={(e) => setMatchFilter(e.target.value)}
          aria-label="Filter by match type"
        >
          <option value="All">All Match Types</option>
          <option value="Exact">Exact</option>
          <option value="Phrase">Phrase</option>
          <option value="Broad">Broad</option>
        </select>
        <select
          className="filter-select"
          value={performanceFilter}
          onChange={(e) => setPerformanceFilter(e.target.value)}
          aria-label="Filter by performance"
        >
          <option value="All">All Performance</option>
          <option value="High Performing">High Performing</option>
          <option value="Underperforming">Underperforming</option>
          <option value="Wasted Spend">Wasted Spend</option>
        </select>
        {hasFilters && (
          <button
            type="button"
            className="btn-clear-filters"
            onClick={() => {
              setSearch('');
              setMatchFilter('All');
              setPerformanceFilter('All');
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="summary-bar">
        <div className="summary-item">
          <span className="summary-label">Total Keywords</span>
          <span className="summary-value">{summary.count}</span>
        </div>
        <div className="summary-divider" />
        <div className="summary-item">
          <span className="summary-label">Total Spend</span>
          <span className="summary-value">
            {formatCurrency(summary.totalSpend)}
          </span>
        </div>
        <div className="summary-divider" />
        <div className="summary-item">
          <span className="summary-label">Avg CPC</span>
          <span className="summary-value">
            {formatCurrencyPrecise(summary.avgCpc)}
          </span>
        </div>
        <div className="summary-divider" />
        <div className="summary-item">
          <span className="summary-label">Avg ACoS</span>
          <span className="summary-value">{summary.avgAcos.toFixed(1)}%</span>
        </div>
      </div>

      <section className="campaigns-section keywords-page-table">
        <div className="table-wrapper">
          <table className="campaigns-table keywords-table-detailed">
            <thead>
              <tr>
                <th>Keyword</th>
                <th>Match Type</th>
                <th>Campaign</th>
                <th>Status</th>
                <th>Bid</th>
                <th>Impressions</th>
                <th>Clicks</th>
                <th>CPC</th>
                <th>Spend</th>
                <th>ROAS</th>
                <th>ACoS</th>
                <th>Suggested Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={12} className="empty-state">
                    No keywords match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((kw) => (
                  <tr
                    key={kw.id}
                    className={`clickable-row ${
                      selectedId === kw.id ? 'row-selected' : ''
                    }`}
                    onClick={() => setSelectedId(kw.id)}
                  >
                    <td className="keyword-cell">{kw.keyword}</td>
                    <td>
                      <MatchTypeBadge matchType={kw.matchType} />
                    </td>
                    <td className="campaign-ref">{kw.campaign}</td>
                    <td>
                      <StatusBadge status={kw.status} />
                    </td>
                    <td>{formatCurrencyPrecise(kw.bid)}</td>
                    <td>{formatNumber(kw.impressions)}</td>
                    <td>{formatNumber(kw.clicks)}</td>
                    <td>{formatCurrencyPrecise(kw.cpc)}</td>
                    <td className="spend-cell">{formatCurrency(kw.spend)}</td>
                    <td className="roas-cell">{kw.roas.toFixed(2)}x</td>
                    <td className="acos-cell">{kw.acos.toFixed(1)}%</td>
                    <td>
                      <ActionBadge action={kw.suggestedAction} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState('login');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [brandMenuOpen, setBrandMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [keywords] = useState(INITIAL_KEYWORDS);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [loadingBrands, setLoadingBrands] = useState(false);

  const fetchBrands = async () => {
    setLoadingBrands(true);
    try {
      const res = await fetch('http://localhost:5000/api/profiles');
      const data = await res.json();
      if (data.success && data.profiles) {
        setBrands(data.profiles);
        setSelectedBrand(data.profiles[0]);
      }
    } catch (err) {
      console.log('API not available, using sample data');
      const sampleBrands = [
        { profileId: '1', accountInfo: { name: 'Superbottoms', type: 'seller' } },
        { profileId: '2', accountInfo: { name: 'Dorje Teas', type: 'seller' } },
        { profileId: '3', accountInfo: { name: 'One Little Farm', type: 'seller' } },
      ];
      setBrands(sampleBrands);
      setSelectedBrand(sampleBrands[0]);
    } finally {
      setLoadingBrands(false);
    }
  };

  const handleSignIn = () => {
    setIsAuthenticated(true);
    fetchBrands();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthView('login');
    setUserMenuOpen(false);
    setActiveNav('dashboard');
    setBrands([]);
    setSelectedBrand(null);
  };

  if (!isAuthenticated) {
    if (authView === 'signup') {
      return (
        <SignupPage
          onSignUp={handleSignIn}
          onGoToLogin={() => setAuthView('login')}
        />
      );
    }
    return (
      <LoginPage
        onSignIn={handleSignIn}
        onGoToSignup={() => setAuthView('signup')}
      />
    );
  }

  const renderPage = () => {
    switch (activeNav) {
      case 'dashboard':
        return (
          <DashboardPage
            campaigns={campaigns}
            onViewCampaigns={() => setActiveNav('campaigns')}
          />
        );
      case 'campaigns':
        return (
          <CampaignsPage campaigns={campaigns} setCampaigns={setCampaigns} />
        );
      case 'keywords':
        return <KeywordsPage keywords={keywords} />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return null;
    }
  };

  return (
    <div className="adflow-app">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">▲</span>
          <span className="brand-text">AdFlow</span>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
              onClick={() => setActiveNav(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <p className="sidebar-footer-label">Account</p>
          <p className="sidebar-footer-value">
            {selectedBrand ? selectedBrand.accountInfo.name : 'NorthPeak Retail'}
          </p>
        </div>
      </aside>

      <div className="main-wrapper">
        <header className="topbar">
          <div className="topbar-left">
            <h1 className="topbar-title">AdFlow</h1>
            <span className="topbar-subtitle">Amazon Ads Management</span>
          </div>
          <div className="topbar-right">

            {/* Brand Switcher */}
            <div className="brand-switcher-wrapper">
              <button
                type="button"
                className="brand-switcher-btn"
                onClick={() => setBrandMenuOpen((o) => !o)}
              >
                <span className="brand-switcher-icon">🏪</span>
                <span className="brand-switcher-name">
                  {loadingBrands
                    ? 'Loading...'
                    : selectedBrand
                    ? selectedBrand.accountInfo.name
                    : 'Select Brand'}
                </span>
                <span className="brand-switcher-arrow">▾</span>
              </button>
              {brandMenuOpen && (
                <>
                  <div
                    className="user-menu-backdrop"
                    onClick={() => setBrandMenuOpen(false)}
                    aria-hidden="true"
                  />
                  <div className="brand-dropdown">
                    <p className="brand-dropdown-label">Switch Brand</p>
                    {brands.map((brand) => (
                      <button
                        key={brand.profileId}
                        type="button"
                        className={`brand-dropdown-item ${
                          selectedBrand?.profileId === brand.profileId
                            ? 'active'
                            : ''
                        }`}
                        onClick={() => {
                          setSelectedBrand(brand);
                          setBrandMenuOpen(false);
                        }}
                      >
                        <span className="brand-item-name">
                          {brand.accountInfo.name}
                        </span>
                        <span className={`brand-item-type type-${brand.accountInfo.type}`}>
                          {brand.accountInfo.type}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button type="button" className="topbar-btn" aria-label="Notifications">
              <span className="topbar-btn-icon">🔔</span>
            </button>
            <div className="user-menu-wrapper">
              <button
                type="button"
                className="user-menu"
                onClick={() => setUserMenuOpen((open) => !open)}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                <div className="user-info">
                  <span className="user-name">Alex Morgan</span>
                  <span className="user-role">Account Manager</span>
                </div>
                <div className="user-avatar" title="Alex Morgan">
                  AM
                </div>
              </button>
              {userMenuOpen && (
                <>
                  <div
                    className="user-menu-backdrop"
                    onClick={() => setUserMenuOpen(false)}
                    aria-hidden="true"
                  />
                  <div className="user-dropdown">
                    <button
                      type="button"
                      className="user-dropdown-item"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="dashboard">{renderPage()}</main>
      </div>
    </div>
  );
}

export default App;
