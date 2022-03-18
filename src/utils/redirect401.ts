export function redirect401(status: number) {
  if (status === 401) window.location.href = '/login';
}
