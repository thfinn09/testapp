const db = require('../db/postgres');

// LIST – chỉ lấy note của user đang login
exports.index = async (req, res) => {
  const userId = req.session.user.id;

  const result = await db.query(
    'SELECT * FROM notes WHERE user_id = $1 ORDER BY id',
    [userId]
  );

  res.render('notes/index', { notes: result.rows });
};

// CREATE – gắn user_id, không nhập id
exports.create = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.session.user.id;

  if (!title) {
    const result = await db.query(
      'SELECT * FROM notes WHERE user_id = $1 ORDER BY id',
      [userId]
    );

    return res.render('notes/index', {
      notes: result.rows,
      error: 'Title là bắt buộc'
    });
  }

  await db.query(
    'INSERT INTO notes (title, content, user_id) VALUES ($1, $2, $3)',
    [title, content, userId]
  );

  res.redirect('/notes');
};

// EDIT FORM – chỉ cho sửa note của mình
exports.editForm = async (req, res) => {
  const result = await db.query(
    'SELECT * FROM notes WHERE id = $1 AND user_id = $2',
    [req.params.id, req.session.user.id]
  );

  if (!result.rows.length) {
    return res.send('Không có quyền sửa note này');
  }

  res.render('notes/edit', { note: result.rows[0] });
};

// UPDATE – chặn sửa note người khác
exports.update = async (req, res) => {
  const { title, content } = req.body;

  await db.query(
    'UPDATE notes SET title = $1, content = $2 WHERE id = $3 AND user_id = $4',
    [title, content, req.params.id, req.session.user.id]
  );

  res.redirect('/notes');
};

// DELETE – chỉ xóa note của mình
exports.delete = async (req, res) => {
  await db.query(
    'DELETE FROM notes WHERE id = $1 AND user_id = $2',
    [req.params.id, req.session.user.id]
  );

  res.redirect('/notes');
};
