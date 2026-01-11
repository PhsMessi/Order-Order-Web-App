//installed libphonember-ja-save

import parsePhoneNumber from "libphonenumber-js";

export function phonePhValidation(inputPhone) {
  try {
    const phoneNumber = parsePhoneNumber(inputPhone, "PH");
    return phoneNumber && phoneNumber.isValid();
  } catch (err) {
    return false;
  }
}

// format the phone number

export function formatPhoneNumber(inputPhone) {
  try {
    const phoneNumber = parsePhoneNumber(inputPhone, "PH");
    if (phoneNumber && phoneNumber.isValid()) {
      return phoneNumber.formatInternational();
    }
    return null;
  } catch (err) {
    return null;
  }
}
