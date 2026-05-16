//Make the whole app calculate the week’s Monday in the exact same way.
export const getMonday = (d) => {
  const date = new Date(d);
  const day = date.getDay();
  // If today is Sunday (0), we go back 6 days to Monday.
  // Otherwise, we go back (day - 1) days to Monday.
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const formatISO = (date) => {
  return date.toISOString();
};
