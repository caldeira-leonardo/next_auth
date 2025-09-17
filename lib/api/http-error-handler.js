export function handleHttpError(response) {
  const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
  error.status = response.status;
  error.statusText = response.statusText;
  throw error;
}

export function checkResponseOk(response) {
  if (!response.ok) {
    handleHttpError(response);
  }
  return response;
}
