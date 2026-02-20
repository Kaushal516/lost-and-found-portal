/**
 * Convert backend FOUND item status
 * to user-friendly labels
 */
export const formatFoundStatus = (status) => {
  if (!status) return "";

  const map = {
    active: "Available",
    "In Process": "In Process",
    resolved: "Returned"
  };

  return map[status] || "";
};

/**
 * Convert backend LOST item status
 * to user-friendly labels
 */
export const formatLostStatus = (status) => {
  if (!status) return "Active";

  const map = {
    active: "Active",
    reported: "Reported Lost",
    resolved: "Returned"
  };

  return map[status] || "Active";
};
