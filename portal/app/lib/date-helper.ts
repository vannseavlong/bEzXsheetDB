import moment from 'moment';

type InputDate = string | number | Date | moment.Moment;

export const formatDate = (date?: InputDate, isFullDate = false): string => {
  if (isFullDate) {
    return moment(date).format('DD MMM YYYY HH:mm');
  }
  return moment(date).format('DD MMM YYYY');
};

export const formatFullDate = (date: InputDate): string => {
  if (!date) return '-';
  return moment(date).format('DD MMM YYYY hh:mm A');
};

export const formatTime = (date: InputDate): string => {
  return moment(date).format('HH:mm A');
};

export const phoneNumber = (phone?: string | null): string => {
  if (!phone) return '';

  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.startsWith('855')) {
    return `+${cleaned}`;
  }

  if (cleaned.startsWith('0')) {
    return `(+855)${cleaned.substring(1)}`;
  }

  return `(+855)${cleaned}`;
};

export const formatDay = (date: InputDate): string => {
  return moment(date).format('dddd');
};

export const formatDatePayload = (date?: InputDate): string => {
  return moment(date).format('YYYY-MM-DD');
};

export const newFormatDate = (date: InputDate): string => {
  return moment(date).format('ddd DD MMM YYYY');
};

export const getDateRange = (
  type:
    | 'TODAY'
    | 'YESTERDAY'
    | 'LAST_7_DAYS'
    | 'THIS_MONTH'
    | 'LAST_MONTH'
    | 'LAST_90_DAYS'
    | string
): string => {
  const today = moment().format('YYYY-MM-DD');

  if (type === 'TODAY') {
    return `${today} - ${today}`;
  }
  if (type === 'YESTERDAY') {
    const firstDay = moment().day('Monday').week(moment().isoWeek()).format('YYYY-MM-DD');
    return `${firstDay} - ${today}`;
  }
  if (type === 'LAST_7_DAYS') {
    const firstDay = moment().startOf('month').format('YYYY-MM-DD');
    return `${firstDay} - ${today}`;
  }
  if (type === 'THIS_MONTH') {
    const firstDay = moment().subtract(2, 'months').startOf('month').format('YYYY-MM-DD');
    return `${firstDay} - ${today}`;
  }
  if (type === 'LAST_MONTH') {
    const firstDay = moment().subtract(3, 'months').startOf('month').format('YYYY-MM-DD');
    return `${firstDay} - ${today}`;
  }
  if (type === 'LAST_90_DAYS') {
    const firstDay = moment().subtract(3, 'months').startOf('month').format('YYYY-MM-DD');
    return `${firstDay} - ${today}`;
  }

  return type;
};

export const getDateString = (
  type:
    | 'TODAY'
    | 'YESTERDAY'
    | 'LAST_7_DAYS'
    | 'THIS_MONTH'
    | 'LAST_MONTH'
    | 'LAST_90_DAYS'
    | string
): string => {
  if (type === 'TODAY') {
    return 'Today';
  }
  if (type === 'YESTERDAY') {
    return 'Yesterday';
  }
  if (type === 'LAST_7_DAYS') {
    return 'Last 7 Days';
  }
  if (type === 'THIS_MONTH') {
    return 'This Month';
  }
  if (type === 'LAST_MONTH') {
    return 'Last Month';
  }
  if (type === 'LAST_90_DAYS') {
    return 'Last 90 Days';
  }

  return type;
};
