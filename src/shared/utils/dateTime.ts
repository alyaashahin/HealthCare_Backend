
export const formatTime = (date: Date): string =>
  date.toISOString().substring(11, 16);