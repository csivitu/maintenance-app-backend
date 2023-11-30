/**
 * @param days number of days to subtract from current date
 * @returns date that many days before
 */
export const getDate = (days = 0) => {
  const date = getStartDate();
  date.setDate(date.getDate() - days);
  return date;
};

/**
 * @returns date with time set to 23:59:59:999
 */
export const getEndDate = () => {
  const date = new Date();
  date.setHours(23, 59, 59, 999);
  return date;
};

/**
 * @returns date with time set to 00:00:00:000
 */
export const getStartDate = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};
