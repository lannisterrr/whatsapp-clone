export default function formatMessageTime(timeString) {
  if (!timeString) return '';
  const date = new Date(timeString);
  if (Number.isNaN(date.getTime())) return timeString;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
