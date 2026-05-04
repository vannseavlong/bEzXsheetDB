type Translate = (key: string) => string;

export const getLocalizedMonthNames = (t: Translate): string[] => [
  t('common.months.jan'),
  t('common.months.feb'),
  t('common.months.mar'),
  t('common.months.apr'),
  t('common.months.may'),
  t('common.months.jun'),
  t('common.months.jul'),
  t('common.months.aug'),
  t('common.months.sep'),
  t('common.months.oct'),
  t('common.months.nov'),
  t('common.months.dec')
];

export const formatDateWithLocalizedMonth = (dateObj: Date, t: Translate): string => {
  const day = dateObj.getDate();
  const month = getLocalizedMonthNames(t)[dateObj.getMonth()];
  const year = dateObj.getFullYear();

  return `${day} ${month} ${year}`;
};

export const formatScheduleDateTime = (
  scheduleDateRaw: string | undefined,
  t: Translate
): string => {
  if (!scheduleDateRaw) return '--';

  const [datePart, timePart, ampm] = scheduleDateRaw.split(' ');
  if (!datePart || !timePart) return '--';

  const [day, month, year] = datePart.split('-');
  if (!day || !month || !year) return '--';

  const [hours, minutes] = timePart.split(':');
  if (!hours || !minutes) return '--';

  const monthIndex = parseInt(month, 10) - 1;
  const monthStr = getLocalizedMonthNames(t)[monthIndex] || '--';

  return `${day}-${monthStr}-${year} ${hours}:${minutes} ${ampm || ''}`.trim();
};
