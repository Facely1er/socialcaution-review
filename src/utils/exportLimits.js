/**
 * Export limit checking utilities
 * Phase 1: Export limits for free tier
 */

export function getExportLimit(userTier, exportType) {
  const limits = {
    free: {
      pdf: 1,
      excel: 0,
      json: 0,
    },
    premium: {
      pdf: -1, // Unlimited
      excel: -1,
      json: -1,
    },
    family: {
      pdf: -1,
      excel: -1,
      json: -1,
    },
  };

  return limits[userTier]?.[exportType] ?? 0;
}

export function canExport(userTier, exportType, currentCount) {
  const limit = getExportLimit(userTier, exportType);
  if (limit === -1) return true;
  return currentCount < limit;
}

export function getExportCount(userTier, exportType) {
  const key = `export_count_${exportType}_${new Date().getMonth()}_${new Date().getFullYear()}`;
  return parseInt(localStorage.getItem(key) || '0', 10);
}

export function incrementExportCount(userTier, exportType) {
  const key = `export_count_${exportType}_${new Date().getMonth()}_${new Date().getFullYear()}`;
  const current = getExportCount(userTier, exportType);
  localStorage.setItem(key, (current + 1).toString());
}

export function resetExportCounts() {
  // Clear all export count keys (useful for testing or admin)
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('export_count_')) {
      localStorage.removeItem(key);
    }
  });
}

