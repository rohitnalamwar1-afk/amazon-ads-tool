import { useState } from 'react';

const TABS = [
  { id: 'general', label: 'General' },
  { id: 'amazon', label: 'Amazon Connection' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'billing', label: 'Billing' },
];

const TIMEZONES = [
  'America/New_York (EST)',
  'America/Chicago (CST)',
  'America/Denver (MST)',
  'America/Los_Angeles (PST)',
  'Europe/London (GMT)',
  'Asia/Tokyo (JST)',
];

const INITIAL_NOTIFICATIONS = {
  dailyReport: true,
  weeklySummary: true,
  highAcosAlerts: true,
  budgetLow: false,
  campaignPaused: true,
};

function Toggle({ id, label, description, checked, onChange }) {
  return (
    <div className="toggle-row">
      <div className="toggle-info">
        <label htmlFor={id} className="toggle-label">
          {label}
        </label>
        {description && <p className="toggle-desc">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        className={`toggle-switch ${checked ? 'on' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span className="toggle-thumb" />
      </button>
    </div>
  );
}

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Alex Morgan',
    email: 'alex.morgan@northpeak.com',
    company: 'NorthPeak Retail',
    timezone: TIMEZONES[0],
  });

  const [preferences, setPreferences] = useState({
    dateRange: '30',
    currency: 'USD',
    language: 'en',
  });

  const [amazonCreds, setAmazonCreds] = useState({
    profileId: '',
    clientId: '',
    clientSecret: '',
  });

  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const updateNotification = (key, value) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  const handleConnectAmazon = () => {
    if (!amazonCreds.profileId || !amazonCreds.clientId) {
      alert('Please enter Profile ID and Client ID to connect.');
      return;
    }
    alert('Amazon Ads connection initiated (demo).');
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Settings</h2>
          <p className="page-description">
            Manage your account, integrations, and preferences
          </p>
        </div>
        <button type="button" className="btn-primary" onClick={handleSave}>
          {saved ? 'Saved ✓' : 'Save Changes'}
        </button>
      </div>

      <div className="settings-layout">
        <nav className="settings-tabs" aria-label="Settings sections">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="settings-content">
          {activeTab === 'general' && (
            <div className="settings-panel">
              <section className="settings-section">
                <h3 className="settings-section-title">Profile</h3>
                <div className="settings-form-grid">
                  <div className="form-field">
                    <label htmlFor="profile-name">Name</label>
                    <input
                      id="profile-name"
                      type="text"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="profile-email">Email</label>
                    <input
                      id="profile-email"
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="profile-company">Company Name</label>
                    <input
                      id="profile-company"
                      type="text"
                      value={profile.company}
                      onChange={(e) =>
                        setProfile({ ...profile, company: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="profile-timezone">Timezone</label>
                    <select
                      id="profile-timezone"
                      value={profile.timezone}
                      onChange={(e) =>
                        setProfile({ ...profile, timezone: e.target.value })
                      }
                    >
                      {TIMEZONES.map((tz) => (
                        <option key={tz} value={tz}>
                          {tz}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              <section className="settings-section">
                <h3 className="settings-section-title">Preferences</h3>
                <div className="settings-form-grid">
                  <div className="form-field">
                    <label htmlFor="pref-daterange">Default Date Range</label>
                    <select
                      id="pref-daterange"
                      value={preferences.dateRange}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          dateRange: e.target.value,
                        })
                      }
                    >
                      <option value="7">Last 7 days</option>
                      <option value="30">Last 30 days</option>
                      <option value="90">Last 90 days</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label htmlFor="pref-currency">Currency</label>
                    <select
                      id="pref-currency"
                      value={preferences.currency}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          currency: e.target.value,
                        })
                      }
                    >
                      <option value="USD">USD — US Dollar</option>
                      <option value="EUR">EUR — Euro</option>
                      <option value="GBP">GBP — British Pound</option>
                      <option value="CAD">CAD — Canadian Dollar</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label htmlFor="pref-language">Language</label>
                    <select
                      id="pref-language"
                      value={preferences.language}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          language: e.target.value,
                        })
                      }
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="de">German</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'amazon' && (
            <div className="settings-panel">
              <div className="connect-card">
                <div className="connect-card-header">
                  <span className="connect-icon">◎</span>
                  <div>
                    <h3 className="connect-title">
                      Connect your Amazon Ads Account
                    </h3>
                    <p className="connect-desc">
                      Link your Amazon Advertising API credentials to sync
                      campaigns, keywords, and performance data.
                    </p>
                  </div>
                </div>
                <div className="settings-form-grid connect-form">
                  <div className="form-field">
                    <label htmlFor="amazon-profile-id">Profile ID</label>
                    <input
                      id="amazon-profile-id"
                      type="text"
                      placeholder="e.g. 1234567890"
                      value={amazonCreds.profileId}
                      onChange={(e) =>
                        setAmazonCreds({
                          ...amazonCreds,
                          profileId: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="amazon-client-id">Client ID</label>
                    <input
                      id="amazon-client-id"
                      type="text"
                      placeholder="amzn1.application-oa2-client..."
                      value={amazonCreds.clientId}
                      onChange={(e) =>
                        setAmazonCreds({
                          ...amazonCreds,
                          clientId: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-field form-field-full">
                    <label htmlFor="amazon-client-secret">Client Secret</label>
                    <input
                      id="amazon-client-secret"
                      type="password"
                      placeholder="Enter your client secret"
                      value={amazonCreds.clientSecret}
                      onChange={(e) =>
                        setAmazonCreds({
                          ...amazonCreds,
                          clientSecret: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-connect-amazon"
                  onClick={handleConnectAmazon}
                >
                  Connect Amazon Ads
                </button>
              </div>

              <section className="settings-section connected-section">
                <h3 className="settings-section-title">Connected Accounts</h3>
                <div className="connected-account-card">
                  <div className="connected-account-info">
                    <span className="connected-status-dot" aria-hidden="true" />
                    <div>
                      <p className="connected-name">NorthPeak Retail — US</p>
                      <p className="connected-meta">
                        Profile ID: 8472910365 · Sponsored Ads
                      </p>
                    </div>
                  </div>
                  <span className="connected-status-badge">Connected</span>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-panel">
              <section className="settings-section">
                <h3 className="settings-section-title">Email & Alerts</h3>
                <div className="toggles-list">
                  <Toggle
                    id="toggle-daily"
                    label="Daily Report Email"
                    description="Receive a daily performance summary in your inbox"
                    checked={notifications.dailyReport}
                    onChange={(v) => updateNotification('dailyReport', v)}
                  />
                  <Toggle
                    id="toggle-weekly"
                    label="Weekly Summary"
                    description="Get a comprehensive weekly report every Monday"
                    checked={notifications.weeklySummary}
                    onChange={(v) => updateNotification('weeklySummary', v)}
                  />
                  <Toggle
                    id="toggle-acos"
                    label="High ACoS Alerts"
                    description="Alert when any campaign exceeds your ACoS threshold"
                    checked={notifications.highAcosAlerts}
                    onChange={(v) => updateNotification('highAcosAlerts', v)}
                  />
                  <Toggle
                    id="toggle-budget"
                    label="Budget Running Low"
                    description="Notify when a campaign is at 80% of daily budget"
                    checked={notifications.budgetLow}
                    onChange={(v) => updateNotification('budgetLow', v)}
                  />
                  <Toggle
                    id="toggle-paused"
                    label="Campaign Paused Alert"
                    description="Instant alert when a campaign is paused or ends"
                    checked={notifications.campaignPaused}
                    onChange={(v) => updateNotification('campaignPaused', v)}
                  />
                </div>
              </section>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="settings-panel">
              <div className="plan-card">
                <div className="plan-card-header">
                  <div>
                    <span className="plan-badge">Current Plan</span>
                    <h3 className="plan-name">Pro Plan</h3>
                    <p className="plan-price">$299/month</p>
                  </div>
                  <button type="button" className="btn-upgrade">
                    Upgrade to Enterprise
                  </button>
                </div>
                <div className="usage-stats">
                  <div className="usage-stat">
                    <span className="usage-label">Campaigns Managed</span>
                    <span className="usage-value">24 / 50</span>
                    <div className="usage-bar">
                      <div className="usage-bar-fill" style={{ width: '48%' }} />
                    </div>
                  </div>
                  <div className="usage-stat">
                    <span className="usage-label">Ad Spend Managed</span>
                    <span className="usage-value">$248K / $500K</span>
                    <div className="usage-bar">
                      <div className="usage-bar-fill" style={{ width: '50%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <section className="settings-section">
                <h3 className="settings-section-title">Payment Method</h3>
                <div className="payment-card">
                  <div className="payment-card-visual">
                    <span className="payment-chip" />
                    <span className="payment-network">VISA</span>
                  </div>
                  <div className="payment-details">
                    <p className="payment-number">•••• •••• •••• 4242</p>
                    <p className="payment-meta">
                      <span>Expires 08/27</span>
                      <span>Alex Morgan</span>
                    </p>
                  </div>
                  <button type="button" className="btn-ghost-inline">
                    Update
                  </button>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SettingsPage;
