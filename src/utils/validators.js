const validateName = (name) => {
  if (name === undefined || name === null) {
    return { valid: false, status: 400, message: "Name parameter is required" };
  }
  if (typeof name !== 'string') {
    return { valid: false, status: 422, message: "Name must be a string" };
  }
  const trimmed = name.trim();
  if (trimmed === '') {
    return { valid: false, status: 400, message: "Name parameter cannot be empty" };
  }
  return { valid: true, name: trimmed };
};

module.exports = { validateName };