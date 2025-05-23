const API_BASE = 'http://localhost:1337/api';

async function apiGet(endpoint, token = '') {
  const res = await fetch(`${API_BASE}/${endpoint}`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });
  return res.json();
}
