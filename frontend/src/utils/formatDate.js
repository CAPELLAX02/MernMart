export const formatDate = (dateString) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const date = new Date(dateString);

  const localDate = new Date(date.getTime());

  const day = localDate.getDate();
  const month = months[localDate.getMonth()];
  const year = localDate.getFullYear();
  const hours = localDate.getHours();
  const minutes = localDate.getMinutes().toString().padStart(2, '0');

  return `${day} ${month} ${year} - ${hours}:${minutes}`;
};
