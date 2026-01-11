export function phonePhValidation(inputPhone) {
  // Remove spaces, dashes, parentheses
  const cleaned = inputPhone.replace(/[\s\-\(\)]/g, "");

  console.log("Cleaned phone:", cleaned); // Debug

  // Philippine phone number patterns:
  const patterns = [
    /^\+639\d{9}$/, // +639513637021
    /^09\d{9}$/, // 09513637021 ✅ Your format
    /^9\d{9}$/, // 9513637021
  ];

  const isValid = patterns.some((pattern) => pattern.test(cleaned));
  console.log("Phone valid?", isValid); // Debug

  return isValid;
}

export function formatPhoneNumber(inputPhone) {
  const cleaned = inputPhone.replace(/[\s\-\(\)]/g, "");

  if (!phonePhValidation(cleaned)) {
    return null;
  }

  // Convert to +63 format
  if (cleaned.startsWith("+63")) {
    return cleaned.replace(/(\+63)(\d{3})(\d{3})(\d{4})/, "$1 $2 $3 $4");
  } else if (cleaned.startsWith("09")) {
    return cleaned.replace(/0(\d{3})(\d{3})(\d{4})/, "+63 $1 $2 $3");
  } else if (cleaned.startsWith("9")) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "+63 $1 $2 $3");
  }

  return cleaned;
}
