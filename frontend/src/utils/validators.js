export function validateName(name) {
  if (!name || name.trim().length < 20 || name.trim().length > 60) {
    return 'Name must be between 20 and 60 characters';
  }
  return '';
}

export function validateAddress(address) {
  if (!address || address.trim().length === 0) return 'Address is required';
  if (address.length > 400) return 'Address must not exceed 400 characters';
  return '';
}

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !re.test(email)) return 'Enter a valid email address';
  return '';
}

export function validatePassword(password) {
  const re = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,16}$/;
  if (!password || !re.test(password)) {
    return 'Password must be 8-16 characters with at least 1 uppercase letter and 1 special character';
  }
  return '';
}