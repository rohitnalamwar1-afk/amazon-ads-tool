require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

const AUTH_URL = 'https://www.amazon.in/ap/oa';
const TOKEN_URL = 'https://api.amazon.com/auth/o2/token';
const API_BASE = 'https://advertising-api-eu.amazon.com';

const tokenStore = {
  accessToken: null,
  refreshToken: process.env.AMAZON_REFRESH_TOKEN || null,
  expiresAt: null,
};

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());

function getRedirectUri() {
  return 'http://localhost:5000/api/auth/callback';
}

function requireEnv(...keys) {
  const missing = keys.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    const error = new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
    error.statusCode = 500;
    throw error;
  }
}

function sendError(res, error, fallbackMessage = 'Internal server error') {
  const status = error.response?.status || error.statusCode || 500;
  const message =
    error.response?.data?.message ||
    error.response?.data?.error_description ||
    error.response?.data?.details ||
    error.message ||
    fallbackMessage;

  console.error(`[${status}]`, message, error.response?.data || '');

  return res.status(status).json({
    success: false,
    error: typeof message === 'string' ? message : fallbackMessage,
    details: error.response?.data || undefined,
  });
}

async function exchangeToken(params) {
  const body = new URLSearchParams(params);
  const { data } = await axios.post(TOKEN_URL, body.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
  });
  return data;
}

function saveTokens(data) {
  tokenStore.accessToken = data.access_token;
  if (data.refresh_token) {
    tokenStore.refreshToken = data.refresh_token;
  }
  tokenStore.expiresAt = Date.now() + (data.expires_in || 3600) * 1000;
  return data;
}

async function refreshAccessToken() {
  requireEnv('AMAZON_CLIENT_ID', 'AMAZON_CLIENT_SECRET');

  const refreshToken =
    tokenStore.refreshToken || process.env.AMAZON_REFRESH_TOKEN;

  if (!refreshToken) {
    const error = new Error(
      'No refresh token available. Complete OAuth flow or set AMAZON_REFRESH_TOKEN.'
    );
    error.statusCode = 401;
    throw error;
  }

  const data = await exchangeToken({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: process.env.AMAZON_CLIENT_ID,
    client_secret: process.env.AMAZON_CLIENT_SECRET,
  });

  return saveTokens(data);
}

async function getValidAccessToken() {
  const bufferMs = 60 * 1000;
  const isExpired =
    !tokenStore.accessToken ||
    !tokenStore.expiresAt ||
    Date.now() >= tokenStore.expiresAt - bufferMs;

  if (isExpired) {
    await refreshAccessToken();
  }

  return tokenStore.accessToken;
}

async function amazonAdsRequest(method, path, options = {}) {
  requireEnv('AMAZON_CLIENT_ID');

  const accessToken = await getValidAccessToken();
  const profileId = options.profileId || process.env.AMAZON_PROFILE_ID;

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Amazon-Advertising-API-ClientId': process.env.AMAZON_CLIENT_ID,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (profileId) {
    headers['Amazon-Advertising-API-Scope'] = String(profileId);
  }

  const config = {
    method,
    url: `${API_BASE}${path}`,
    headers,
    params: options.params,
    data: options.data,
  };

  const { data } = await axios(config);
  return data;
}

// ——— Routes ———

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/auth/url', (_req, res) => {
  try {
    requireEnv('AMAZON_CLIENT_ID');

    const redirectUri = getRedirectUri();
    const params = new URLSearchParams();
    params.set('client_id', process.env.AMAZON_CLIENT_ID);
    params.set('scope', 'cpc_advertising:campaign_management');
    params.set('response_type', 'code');
    params.set('redirect_uri', redirectUri);

    res.json({
      success: true,
      url: `${AUTH_URL}?${params.toString()}`,
      redirectUri,
    });
  } catch (error) {
    sendError(res, error, 'Failed to generate authorization URL');
  }
});

app.get('/api/auth/callback', async (req, res) => {
  const frontendBase = 'http://localhost:3000';

  try {
    const { code, error: oauthError, error_description: oauthDesc } = req.query;

    if (oauthError) {
      const message = encodeURIComponent(oauthDesc || oauthError);
      return res.redirect(`${frontendBase}/?auth=error&message=${message}`);
    }

    if (!code) {
      const message = encodeURIComponent('Authorization code is required');
      return res.redirect(`${frontendBase}/?auth=error&message=${message}`);
    }

    requireEnv('AMAZON_CLIENT_ID', 'AMAZON_CLIENT_SECRET');

    const data = await exchangeToken({
      grant_type: 'authorization_code',
      code: String(code),
      redirect_uri: getRedirectUri(),
      client_id: process.env.AMAZON_CLIENT_ID,
      client_secret: process.env.AMAZON_CLIENT_SECRET,
    });

    saveTokens(data);

    console.log('Amazon OAuth refresh_token:', data.refresh_token || tokenStore.refreshToken);

    return res.redirect(`${frontendBase}/?auth=success`);
  } catch (error) {
    console.error('OAuth token exchange failed:', error.response?.data || error);
    const message = encodeURIComponent(
      error.response?.data?.error_description ||
        error.response?.data?.error ||
        error.message ||
        'Token exchange failed'
    );
    return res.redirect(`${frontendBase}/?auth=error&message=${message}`);
  }
});

app.post('/api/auth/refresh', async (_req, res) => {
  try {
    const data = await refreshAccessToken();
    res.json({
      success: true,
      expiresIn: data.expires_in,
      expiresAt: tokenStore.expiresAt,
      hasRefreshToken: Boolean(tokenStore.refreshToken),
    });
  } catch (error) {
    sendError(res, error, 'Failed to refresh access token');
  }
});

app.get('/api/profiles', async (_req, res) => {
  try {
    const profiles = await amazonAdsRequest('GET', '/v2/profiles');
    res.json({ success: true, profiles });
  } catch (error) {
    sendError(res, error, 'Failed to fetch Amazon Ads profiles');
  }
});

app.get('/api/campaigns', async (req, res) => {
  try {
    const profileId = req.query.profileId || process.env.AMAZON_PROFILE_ID;

    if (!profileId) {
      return res.status(400).json({
        success: false,
        error: 'profileId query param or AMAZON_PROFILE_ID env is required',
      });
    }

    requireEnv('AMAZON_CLIENT_ID', 'AMAZON_CLIENT_SECRET');

    const tokenData = await refreshAccessToken();
    const accessToken = tokenData.access_token;
    console.log('Access token:', accessToken ? accessToken.substring(0, 50) : 'NULL');
    const { data: campaigns } = await axios.get(`${API_BASE}/sp/campaigns`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Amazon-Advertising-API-ClientId': process.env.AMAZON_CLIENT_ID,
        'Amazon-Advertising-API-Scope': String(profileId),
        Accept: 'application/json',
      },
    });

    res.json({
      success: true,
      profileId: String(profileId),
      count: Array.isArray(campaigns) ? campaigns.length : 0,
      campaigns,
    });
  } catch (error) {
    sendError(res, error, 'Failed to fetch campaigns');
  }
});

app.get('/api/keywords', async (req, res) => {
  try {
    const profileId = req.query.profileId || process.env.AMAZON_PROFILE_ID;

    if (!profileId) {
      return res.status(400).json({
        success: false,
        error: 'profileId query param or AMAZON_PROFILE_ID env is required',
      });
    }

    const keywords = await amazonAdsRequest('GET', '/v2/sp/keywords', {
      profileId,
    });

    res.json({
      success: true,
      profileId: String(profileId),
      count: Array.isArray(keywords) ? keywords.length : 0,
      keywords,
    });
  } catch (error) {
    sendError(res, error, 'Failed to fetch keywords');
  }
});

app.get('/api/reports/summary', async (req, res) => {
  try {
    const profileId = req.query.profileId || process.env.AMAZON_PROFILE_ID;

    if (!profileId) {
      return res.status(400).json({
        success: false,
        error: 'profileId query param or AMAZON_PROFILE_ID env is required',
      });
    }

    let campaigns = [];
    let keywords = [];

    try {
      campaigns = await amazonAdsRequest('GET', '/v2/sp/campaigns', { profileId });
    } catch {
      campaigns = [];
    }

    try {
      keywords = await amazonAdsRequest('GET', '/v2/sp/keywords', { profileId });
    } catch {
      keywords = [];
    }

    const campaignList = Array.isArray(campaigns) ? campaigns : [];
    const keywordList = Array.isArray(keywords) ? keywords : [];

    const activeCampaigns = campaignList.filter(
      (c) => (c.state || c.status || '').toLowerCase() === 'enabled'
    ).length;

    const totalDailyBudget = campaignList.reduce((sum, c) => {
      const budget = c.budget?.budget ?? c.dailyBudget ?? c.budget ?? 0;
      return sum + Number(budget);
    }, 0);

    const summary = {
      profileId: String(profileId),
      period: req.query.period || 'last_30_days',
      metrics: {
        totalCampaigns: campaignList.length,
        activeCampaigns,
        totalKeywords: keywordList.length,
        totalDailyBudget,
        currency: 'INR',
        note:
          'Spend, ROAS, and ACoS require the Amazon Ads Reporting API. Connect reporting for full metrics.',
      },
      campaigns: campaignList.slice(0, 10),
      generatedAt: new Date().toISOString(),
    };

    res.json({ success: true, summary });
  } catch (error) {
    sendError(res, error, 'Failed to generate performance summary');
  }
});

app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

app.use((err, _req, res, _next) => {
  sendError(res, err);
});

app.listen(PORT, () => {
  console.log(`AdFlow API server running on http://localhost:${PORT}`);
  console.log(`India API base: ${API_BASE}`);
  console.log(`CORS origin: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});
