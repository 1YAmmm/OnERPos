const BASE_URL = '/api/employees';

const headers = (token = null) => ({
  'Content-Type': 'application/json',
  ...(token && { Authorization: `Bearer ${token}` }),
});

const handleResponse = async (res) => {
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    if (!res.ok)
      throw new Error(data.error || `Request failed (${res.status})`);
    return data;
  } catch {
    throw new Error(
      `Server returned non-JSON (${res.status}): ${text.slice(0, 100)}`
    );
  }
};

export const employeeRepository = {
  async register({
    email,
    password,
    fullName,
    position,
    hourlyRate,
    hireDate,
    ownerId,
    token,
  }) {
    const res = await fetch(`${BASE_URL}/register-employee`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify({
        email,
        password,
        fullName,
        position,
        hourlyRate,
        hireDate,
        ownerId,
      }),
    });
    return handleResponse(res);
  },

  async getAll(token) {
    const res = await fetch(BASE_URL, {
      headers: headers(token),
    });
    const data = await handleResponse(res);
    return data.employees;
  },

  async update({
    id,
    fullName,
    position,
    hourlyRate,
    hireDate,
    status,
    token,
  }) {
    const res = await fetch(`${BASE_URL}/update-employee`, {
      method: 'PATCH',
      headers: headers(token),
      body: JSON.stringify({
        id,
        fullName,
        position,
        hourlyRate,
        hireDate,
        status,
      }),
    });
    return handleResponse(res);
  },

  async delete(id, token) {
    const res = await fetch(`${BASE_URL}/delete-employee`, {
      method: 'DELETE',
      headers: headers(token),
      body: JSON.stringify({ id }),
    });
    return handleResponse(res);
  },
};
