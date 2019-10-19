const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('/index.html');
});

router.get('/autocomplete', (req, res, next) => {
  const searchKeyword = req.query.suggestion;
  const jsonPath = path.join(
    __dirname,
    '..',
    'public',
    'data',
    `${searchKeyword}.json`
  );

  return res.json(JSON.parse(fs.readFileSync(jsonPath)));
});
module.exports = router;
