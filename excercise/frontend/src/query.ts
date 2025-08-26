export const getPlayerName = async () => {
  const response = await fetch('/api/v1/me');
  const data = await response.json();
  return data;
};

export const getThrows = async () => {
  const response = await fetch('/api/v1/throws');
  const data = await response.json();
  return data;
};

export const generateThrow = async () => {
  const response = await fetch('/api/v1/throws', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  return data;
};