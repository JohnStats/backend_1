console.log('userService loaded')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepo = require('@repositories/userRepository');
const config = require('@config/index');

exports.signup = async ({ email, password }) => {
  if (!email || !password) throw new Error('이메일, 비번 필수');
  if (password.length < 6) throw new Error('비번 6자 이상');

  const exist = await userRepo.findByEmail(email);
  if (exist) {
    const err = new Error('이미 존재하는 이메일');
    err.status = 409;
    throw err;
  }

  const hashed = await bcrypt.hash(password, config.BCRYPT_SALT);
  const newUser = {
    id: Date.now().toString(),
    email,
    password: hashed,
    avatar: null
  };

  await userRepo.create(newUser);

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES }
  );

  return { id: newUser.id, email: newUser.email, token };
};

exports.login = async ({ email, password }) => {
  const foundUser = await userRepo.findByEmail(email);
  if (!foundUser) {
    const err = new Error('유저 없음');
    err.status = 404;
    throw err;
  }
  const match = await bcrypt.compare(password, foundUser.password);
  if (!match) {
    const err = new Error('비번 불일치');
    err.status = 401;
    throw err;
  }
  const token = jwt.sign(
    { id: foundUser.id, email: foundUser.email },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES }
  );
  return { id: foundUser.id, email: foundUser.email, token };
};

exports.getMe = async (userId) => {
  const foundUser = await userRepo.findById(userId);
  if (!foundUser) throw new Error('유저 없음');
  const { password, ...safeUser } = foundUser;
  return safeUser;
};

exports.updateAvatar = async (userId, filePath) => {
  const foundUser = await userRepo.findById(userId);
  if (!foundUser) throw new Error('유저 없음');
  foundUser.avatar = filePath;
  return { avatar: filePath };
};