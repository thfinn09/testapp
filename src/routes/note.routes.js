const express = require('express');
const router = express.Router();
const note = require('../controllers/note.controller');
const { requireLogin } = require('../middlewares/auth.middlewares');

router.get('/', requireLogin, note.index);
router.post('/create', requireLogin, note.create);
router.get('/edit/:id', requireLogin, note.editForm);
router.post('/edit/:id', requireLogin, note.update);
router.get('/delete/:id', requireLogin, note.delete);

module.exports = router;
