/**
 * Convert backend FOUND item status
 * to user-friendly labels (Translated)
 */
export const formatFoundStatus = (status, t) => {
  if (!status) return "";
  if (!t) return status;

  const map = {
    active: t('search.active'),
    "In Process": t('item.claimed'),
    resolved: t('item.resolved')
  };

  return map[status] || status;
};

/**
 * Convert backend LOST item status
 * to user-friendly labels (Translated)
 */
export const formatLostStatus = (status, t) => {
  if (!status) return t ? t('search.active') : "Active";
  if (!t) return status;

  const map = {
    active: t('search.active'),
    reported: t('search.lostReportsTitle'),
    resolved: t('item.resolved')
  };

  return map[status] || status;
};
