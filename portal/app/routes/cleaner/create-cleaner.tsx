import { ACTIONS, MODULES } from '@/lib/permission';
import NewCleaner from './new-cleaner';

export const handle = {
  module: MODULES.CLEANER,
  action: ACTIONS.ADD
};

export default NewCleaner;
