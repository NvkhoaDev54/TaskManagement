const AppError = require('../utils/AppError');

// Validate user registration
exports.validateRegister = (req, res, next) => {
  const { username, fullname, password, email } = req.body;

  if (!username || !fullname || !password || !email) {
    return next(new AppError('All fields are required', 400));
  }

  // Username validation: 3-20 characters, alphanumeric only
  if (!/^[a-zA-Z0-9]{3,20}$/.test(username)) {
    return next(new AppError('Username must be 3-20 alphanumeric characters', 400));
  }

  // Email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return next(new AppError('Invalid email format', 400));
  }

  // Password validation: minimum 6 characters
  if (password.length < 6) {
    return next(new AppError('Password must be at least 6 characters', 400));
  }

  next();
};

// Validate user login
exports.validateLogin = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new AppError('Username and password are required', 400));
  }

  next();
};

// Validate task creation/update
exports.validateTask = (req, res, next) => {
  const { taskname, status, priority } = req.body;

  // Chỉ validate khi có field trong request
  if (taskname !== undefined && (!taskname || taskname.trim() === '')) {
    return next(new AppError('Task name cannot be empty', 400));
  }

  // Validate status nếu có
  const validStatuses = ['Pending', 'In Progress', 'Completed'];
  if (status && !validStatuses.includes(status)) {
    return next(new AppError('Invalid status. Must be: Pending, In Progress, or Completed', 400));
  }

  // Validate priority nếu có
  if (priority !== undefined) {
    const priorityNum = parseInt(priority);
    if (isNaN(priorityNum) || priorityNum < 1 || priorityNum > 5) {
      return next(new AppError('Priority must be a number between 1 and 5', 400));
    }
  }

  next();
};

// Validate group creation/update
exports.validateGroup = (req, res, next) => {
  const { groupName } = req.body;

  if (groupName !== undefined && (!groupName || groupName.trim() === '')) {
    return next(new AppError('Group name cannot be empty', 400));
  }

  next();
};

// Validate user update
exports.validateUserUpdate = (req, res, next) => {
  const { fullname, email, password } = req.body;

  // Email validation nếu có
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return next(new AppError('Invalid email format', 400));
  }

  // Password validation nếu có
  if (password && password.length < 6) {
    return next(new AppError('Password must be at least 6 characters', 400));
  }

  // Fullname validation nếu có
  if (fullname !== undefined && (!fullname || fullname.trim() === '')) {
    return next(new AppError('Full name cannot be empty', 400));
  }

  next();
};