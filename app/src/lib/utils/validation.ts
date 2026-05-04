export type ValidationResult = {
  isValid: boolean;
  error?: string;
};

export const validatePhoneNumber = (phone: string): ValidationResult => {
  if (!phone || !phone.trim()) {
    return { isValid: false, error: 'phoneRequired' };
  }
  const cleanedPhone = phone.replace(/\s/g, '');
  if (!/^\+?\d{8,15}$/.test(cleanedPhone)) {
    return { isValid: false, error: 'phoneInvalid' };
  }
  return { isValid: true };
};

export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  if (!value || !value.trim()) {
    return { isValid: false, error: `${fieldName}Required` };
  }
  return { isValid: true };
};

export const validateName = (name: string): ValidationResult => {
  if (!name || !name.trim()) {
    return { isValid: false, error: 'nameRequired' };
  }
  if (name.trim().length < 2) {
    return { isValid: false, error: 'nameTooShort' };
  }
  if (name.trim().length > 50) {
    return { isValid: false, error: 'nameTooLong' };
  }
  if (!/^[a-zA-ZÀ-ỹ\s'-]+$/.test(name.trim())) {
    return { isValid: false, error: 'nameInvalid' };
  }
  return { isValid: true };
};

export const validateEmail = (email: string): ValidationResult => {
  if (!email || !email.trim()) {
    return { isValid: true };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'emailInvalid' };
  }
  return { isValid: true };
};
