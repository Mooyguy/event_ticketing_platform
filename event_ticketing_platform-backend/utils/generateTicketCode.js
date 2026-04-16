export const generateTicketCode = () => {
  return "TICKET-" + Math.random().toString(36).substring(2, 10).toUpperCase();
};