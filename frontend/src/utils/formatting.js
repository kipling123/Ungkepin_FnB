/**
 * Format number as Indonesian Rupiah currency
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export const formatRp = (amount) => {
  return `Rp ${Number(amount).toLocaleString('id-ID')}`;
};

/**
 * Format time in MM:SS format
 * @param {number} seconds - Total seconds
 * @returns {string} Formatted time string
 */
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Validate full name
 * @param {string} fullName - The name to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateFullName = (fullName) => {
  if (!fullName.trim()) {
    return 'Nama lengkap wajib diisi';
  }
  if (fullName.trim().length < 3) {
    return 'Nama minimal 3 karakter';
  }
  return null;
};

/**
 * Validate WhatsApp number
 * @param {string} whatsapp - The number to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateWhatsapp = (whatsapp) => {
  if (!whatsapp.trim()) {
    return 'Nomor WhatsApp wajib diisi';
  }
  if (!/^\d{9,15}$/.test(whatsapp.replace(/\D/g, ''))) {
    return 'Nomor WhatsApp tidak valid';
  }
  return null;
};

/**
 * Validate address
 * @param {string} address - The address to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateAddress = (address) => {
  if (!address.trim()) {
    return 'Detail lokasi wajib diisi';
  }
  if (address.trim().length < 5) {
    return 'Detail lokasi minimal 5 karakter';
  }
  return null;
};
