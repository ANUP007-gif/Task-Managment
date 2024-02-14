const fs = require('fs');

module.exports = (err, req, res, next) => {
  if (req.transaction) {
    req.transaction.rollback();
  }

    console.log('Logging💥💥💥 ERROR', err);
  

  if (req.files?.questions && req.files.questions[0]?.path) {
    fs.unlinkSync(req.files.questions[0].path);
  }
  if (req.files?.image && req.files.image[0]?.path) {
    fs.unlinkSync(req.files.image[0].path);
  }

  if (req.timer) {
    clearTimeout(req.timer);
  }


  err.statusCode = err.statusCode || 500;
  let msg = err.errors && err.errors[0]?.message;

  if (err?.original?.errno === 1451) {
    msg = `${err.table} can't be deleted because of ${err.index.split('_')[0]} dependency.`;
  } else if (err?.original?.errno === 1452) {
    msg = `${err.fields} does not exists.`;
  } else if (err?.original?.errno === 1062) {
    const str = Object.keys(err.fields)[0].split('_').join(' ');
    msg = `${str[0].toUpperCase()}${str.slice(1)} must be unique.`;
  }

  res.status(err.statusCode).json({
    status: 'error',
    message: msg || err.message || err.error.description,
  });
};
