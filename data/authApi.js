const toBackendRole = (role) => role === 'ADMINISTRATOR' ? 'ADMIN' : role;

const toFrontendRole = (role) => role === 'ADMIN' ? 'ADMINISTRATOR' : role;

async function readResponse(response, fallbackMessage) {
  let payload;
  try {
    payload = await response.json();
  } catch (error) {
    throw new Error(`The server returned an unreadable response (HTTP ${response.status}).`);
  }

  if (!response.ok) {
    throw new Error(payload.error || payload.message || fallbackMessage);
  }
  return payload;
}

export async function loginWithBackend(email, password) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify({ email: email.trim().toLowerCase(), password })
  });
  const payload = await readResponse(response, 'Sign in failed.');

  if (!payload.user || !payload.token) {
    throw new Error('The server did not return an authenticated user session.');
  }

  return {
    ...payload.user,
    role: toFrontendRole(payload.user.role),
    token: payload.token,
    avatar: payload.user.name?.trim().substring(0, 2).toUpperCase() || ''
  };
}

export async function registerWithBackend(user) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify({
      name: user.name.trim(),
      email: user.email.trim().toLowerCase(),
      password: user.password,
      role: toBackendRole(user.role),
      department: user.department,
      year: user.semester || user.year || '',
      section: user.section || ''
    })
  });
  return readResponse(response, 'Registration failed.');
}

export async function logoutFromBackend(token) {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    headers: token ? { Authorization: token } : {},
    credentials: 'same-origin'
  });
  await readResponse(response, 'Backend sign-out failed.');
}
