import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';

const customQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don’t retry on axios cancel
        if (axios.isCancel(error)) return false;
        // return failureCount < 3; // Optional: limit retries on real errors
        return failureCount < 1;
      }
    }
  }
});

export default customQueryClient;
