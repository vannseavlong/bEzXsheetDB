import moment from 'moment';

type InputDate = string | number | Date | moment.Moment;

export const formatDate = (date: InputDate, isFullDate = false): string => {
  if (isFullDate) {
    return moment(date).format('DD MMM YYYY hh:mm A');
  }
  return moment(date).format('DD MMM YYYY');
};

export const formatTime = (date: InputDate): string => {
  return moment(date).format('HH:mm A');
};

export const formatDay = (date: InputDate): string => {
  return moment(date).format('dddd');
};

export const formatDatePayload = (date: InputDate): string => {
  return moment(date).format('YYYY-MM-DD');
};

export const newFormatDate = (date: InputDate): string => {
  return moment(date).format('ddd DD MMM YYYY');
};

export const getDateRange = (
  type: 'Today' | 'This week' | 'This month' | 'Last two months' | 'Last three months' | string
): string => {
  if (type === '') return '';

  const today = moment().format('YYYY-MM-DD');

  if (type === 'Today') {
    return `${today} - ${today}`;
  }
  if (type === 'This week') {
    const firstDay = moment().day('Monday').week(moment().isoWeek()).format('YYYY-MM-DD');
    return `${firstDay} - ${today}`;
  }
  if (type === 'This month') {
    const firstDay = moment().startOf('month').format('YYYY-MM-DD');
    return `${firstDay} - ${today}`;
  }
  if (type === 'Last two months') {
    const firstDay = moment().subtract(2, 'months').startOf('month').format('YYYY-MM-DD');
    return `${firstDay} - ${today}`;
  }
  if (type === 'Last three months') {
    const firstDay = moment().subtract(3, 'months').startOf('month').format('YYYY-MM-DD');
    return `${firstDay} - ${today}`;
  }

  return type;
};
