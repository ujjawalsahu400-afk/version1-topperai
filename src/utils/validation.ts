export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required";
  if (!emailRegex.test(email)) return "Invalid email format";
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  // Add more complex requirements if needed
  return null;
};

export const validateConfirmPassword = (password: string, confirm: string): string | null => {
  if (!confirm) return "Please confirm your password";
  if (password !== confirm) return "Passwords do not match";
  return null;
};

export const validateUserId = (userId: string): string | null => {
  if (!userId) return "User ID is required";
  if (userId.length < 4) return "User ID must be at least 4 characters";
  if (!/^[a-zA-Z0-9_]+$/.test(userId)) return "User ID can only contain letters, numbers, and underscores";
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name) return "Full name is required";
  if (name.length < 2) return "Name is too short";
  return null;
};
