// @desc    Get all users
// @route   GET /api/users
// @access  Public (for now)
export const getUsers = async (req, res) => {
  try {
    res.status(200).json({ message: 'Get all users' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a user
// @route   POST /api/users
// @access  Public
export const createUser = async (req, res) => {
  try {
    res.status(201).json({ message: 'Create a new user' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single user
// @route   GET /api/users/:id
// @access  Public
export const getUserById = async (req, res) => {
  try {
    res.status(200).json({ message: `Get user with id ${req.params.id}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Public
export const updateUser = async (req, res) => {
  try {
    res.status(200).json({ message: `Update user with id ${req.params.id}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Public
export const deleteUser = async (req, res) => {
  try {
    res.status(200).json({ message: `Delete user with id ${req.params.id}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
