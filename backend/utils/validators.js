// Centralized validation helpers, used by both signup and admin "add user" flows.

const NAME_MIN = 20;
const NAME_MAX = 60;
const ADDRESS_MAX = 400;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 8-16 chars, at least one uppercase letter and one special character
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,16}$/;

function validateName(name) {
  if (typeof name !== 'string') return 'Name is required';
  const trimmed = name.trim();
  if (trimmed.length < NAME_MIN || trimmed.length > NAME_MAX) {
    return `Name must be between ${NAME_MIN} and ${NAME_MAX} characters`;
  }
  return null;
}

function validateAddress(address) {
  if (typeof address !== 'string' || address.trim().length === 0) {
    return 'Address is required';
  }
  if (address.length > ADDRESS_MAX) {
    return `Address must not exceed ${ADDRESS_MAX} characters`;
  }
  return null;
}

function validateEmail(email) {
  if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    return 'A valid email is required';
  }
  return null;
}

function validatePassword(password) {
  if (typeof password !== 'string' || !PASSWORD_REGEX.test(password)) {
    return 'Password must be 8-16 characters and include at least one uppercase letter and one special character';
  }
  return null;
}

function validateRating(rating) {
  const num = Number(rating);
  if (!Number.isInteger(num) || num < 1 || num > 5) {
    return 'Rating must be an integer between 1 and 5';
  }
  return null;
}

// Runs the relevant validators and returns { valid, errors } where errors is a
// field -> message map (only for fields that were passed in).
function validateUserFields({ name, email, password, address }) {
  const errors = {};
  if (name !== undefined) {
    const e = validateName(name);
    if (e) errors.name = e;
  }
  if (email !== undefined) {
    const e = validateEmail(email);
    if (e) errors.email = e;
  }
  if (password !== undefined) {
    const e = validatePassword(password);
    if (e) errors.password = e;
  }
  if (address !== undefined) {
    const e = validateAddress(address);
    if (e) errors.address = e;
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

module.exports = {
  validateName,
  validateAddress,
  validateEmail,
  validatePassword,
  validateRating,
  validateUserFields,
};
