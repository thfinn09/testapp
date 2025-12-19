const bcrypt = require('bcrypt');
const db = require('../db/postgres');

exports.loginForm = (req, res) => {
  res.render('auth/login');
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const result = await db.query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  );

  if (result.rowCount === 0) {
    return res.render('auth/login', { error: 'Sai tài khoản' });
  }

  const user = result.rows[0];
  const ok = await bcrypt.compare(password, user.password);

  if (!ok) {
    return res.render('auth/login', { error: 'Sai mật khẩu' });
  }

  req.session.user = {
    id: user.id,
    username: user.username
  };

  res.redirect('/notes');
};

exports.registerForm = (req, res) => {
  res.render('auth/register');
};

exports.register = async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  try {
    await db.query(
      'INSERT INTO users(username, password) VALUES ($1, $2)',
      [username, hash]
    );
    res.redirect('/login');
  } catch {
    res.render('auth/register', { error: 'Username đã tồn tại' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};
