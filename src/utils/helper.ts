export const getDate = (days = 0) => {
  const date = getStartDate();
  date.setDate(date.getDate() - days);
  return date;
};

export const getEndDate = () => {
  const date = new Date();
  date.setHours(23, 59, 59, 999);
  return date;
};

export const getStartDate = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};
