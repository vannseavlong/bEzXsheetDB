export const getLabel = (dateType: string) => {
  switch (dateType) {
    case 'TODAY':
      return { current: 'Today', prev: 'Yesterday' };
    case 'YESTERDAY':
      return {
        current: 'Yesterday',
        prev: '2 Days Ago'
      };
    case 'LAST_7_DAYS':
      return {
        current: 'Last 7 Days',
        prev: 'Previous 7 Days'
      };
    case 'THIS_MONTH':
      return {
        current: 'This Month',
        prev: 'Last Month'
      };
    case 'LAST_MONTH':
      return {
        current: 'Last Month',
        prev: 'Previous Month'
      };
    case 'LAST_90_DAYS':
      return {
        current: 'Last 90 Days',
        prev: 'Previous 90 Days'
      };
    default:
      return {
        current: 'Today',
        prev: 'Yesterday'
      };
  }
};
