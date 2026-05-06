// Stub socket — real-time updates are not active in admin-portal.
const socket = {
  on: (_event: string, _callback: (...args: unknown[]) => void) => {},
  off: (_event: string, _callback?: (...args: unknown[]) => void) => {},
  emit: (_event: string, ..._args: unknown[]) => {},
  disconnect: () => {}
};

export default socket;
