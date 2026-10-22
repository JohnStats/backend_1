const userService = require('@services/userService');

exports.signup = async (req, res, next) => {
  try {
    const result = await userService.signup(req.body);
    // socket.io 알림
    const io = req.app.get('io');
    io.emit('user:joined', { email: result.email });
    res.status(201).json(result);
  } catch (e) { next(e); }
};

exports.login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body);
    res.json(result);
  } catch (e) { next(e); }
};

exports.me = async (req, res, next) => {
  try {
    const result = await userService.getMe(req.user.id);
    res.json(result);
  } catch (e) { next(e); }
};

exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) throw new Error('파일 없음');
    const result = await userService.updateAvatar(req.user.id, `/uploads/${req.file.filename}`);
    res.json(result);
  } catch (e) { next(e); }
};

exports.list = async (req, res) => {
  const userRepo = require('@repositories/userRepository')
  const all = await userRepo.findAll()
  res.json(all)
}