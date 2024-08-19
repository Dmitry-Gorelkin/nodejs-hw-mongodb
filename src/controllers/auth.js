export const registerUserController = (req, res, next) => {
  const { email } = req.body;

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: 'user: name & email',
  });
};
