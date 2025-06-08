/**
 * Formats a date string to YYYY-MM-DD format
 * @param {string|Date} date - The date to format
 * @returns {string} The formatted date string
 */
export const formatDate = (date) => {
  if (!date) return "";
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "";
    return dateObj.toISOString().split("T")[0];
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

/**
 * Formats a time string to HH:mm format
 * @param {string} time - The time string in HH:mm or HH:mm:ss format
 * @returns {string} The formatted time string
 */
export const formatTime = (time) => {
  if (!time) return "";
  try {
    // If time is already in HH:mm or HH:mm:ss format, just take the first 5 characters
    if (time.includes(":")) {
      return time.slice(0, 5);
    }
    // If it's a full date string, convert it
    const timeObj = new Date(time);
    if (isNaN(timeObj.getTime())) return "";
    return timeObj.toTimeString().slice(0, 5);
  } catch (error) {
    console.error("Error formatting time:", error);
    return "";
  }
};
