export const validateUserId = (userId: string): string | null => {
  if (!userId) return "User ID is required";
  if (userId.length < 4) return "User ID must be at least 4 characters";
  if (userId.length > 20) return "User ID is too long";
  if (!/^[a-zA-Z0-9_]+$/.test(userId)) return "User ID can only contain letters, numbers, and underscores";
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name) return "Name is required";
  if (name.length < 2) return "Name is too short";
  return null;
};

export const validateBio = (bio: string): string | null => {
  if (bio && bio.length > 150) return "Bio cannot exceed 150 characters";
  return null;
};

export const validateClass = (className: string): string | null => {
  if (!className) return "Please select a class";
  return null;
};
