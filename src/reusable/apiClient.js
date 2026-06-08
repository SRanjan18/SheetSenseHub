import config from '../config/config';

const buildUrl = (path) => `${config.apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;

const readErrorMessage = async (response) => {
  try {
    const data = await response.json();
    if (Array.isArray(data?.errors) && data.errors.length) return data.errors.join(', ');
    if (data?.message) return data.message;
  } catch {
    // Ignore non-JSON error bodies.
  }

  return `Request failed with status ${response.status}`;
};

export async function apiFetch(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const headers = isFormData
    ? options.headers
    : {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      };

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  if (response.status === 204) return null;

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
