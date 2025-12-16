const getRedirectUri = () => {
  if (process.env.REACT_APP_REDIRECT_URI) {
    return process.env.REACT_APP_REDIRECT_URI;
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/`;
  }

  return '';
};

export const AUTH_CONFIG = {
  clientId: process.env.REACT_APP_ANILIST_CLIENT_ID!,
  redirectUri: getRedirectUri(),
  authEndpoint: 'https://anilist.co/api/v2/oauth/authorize',
  proxyEndpoint: process.env.REACT_APP_PROXY_ENDPOINT
    || (process.env.NODE_ENV === 'development'
      ? 'http://localhost:3001/api/token'
      : '/api/token'),
};

export const initiateLogin = () => {
  const params = new URLSearchParams({
    client_id: AUTH_CONFIG.clientId,
    redirect_uri: AUTH_CONFIG.redirectUri,
    response_type: 'code',
  });

  window.location.href = `${AUTH_CONFIG.authEndpoint}?${params.toString()}`;
};

export const exchangeCodeForToken = async (code: string): Promise<string> => {
  const response = await fetch(AUTH_CONFIG.proxyEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });

  const data = await response.json();
  if (data.access_token) {
    localStorage.setItem('anilist_token', data.access_token);
    return data.access_token;
  }

  throw new Error(data.message || 'Failed to exchange code for token');
};

export const getStoredToken = (): string | null => {
  return localStorage.getItem('anilist_token');
};

export const clearToken = () => {
  localStorage.removeItem('anilist_token');
};
