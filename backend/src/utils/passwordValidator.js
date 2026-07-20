/**
 * Validate password strength
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export function validatePasswordStrength(password) {
  const errors = [];

  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Simple password strength check (for registration)
 * - Minimum 8 characters
 * - Should not be common password
 */
export function validatePasswordBasic(password) {
  const errors = [];
  const commonPasswords = [
    "password",
    "12345678",
    "qwerty123",
    "123456789",
    "password123",
    "admin123",
  ];

  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push("Password is too common. Please choose a stronger password.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Check password match
 */
export function validatePasswordMatch(password, confirmPassword) {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: "Passwords do not match",
    };
  }
  return { isValid: true };
}

/**
 * Get password strength meter (0-5)
 */
export function getPasswordStrengthScore(password) {
  let score = 0;

  if (!password) return 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

  return score;
}

export function getPasswordStrengthLabel(score) {
  switch (score) {
    case 0:
    case 1:
      return "Very Weak";
    case 2:
      return "Weak";
    case 3:
      return "Fair";
    case 4:
      return "Strong";
    case 5:
      return "Very Strong";
    default:
      return "Unknown";
  }
}
