const sqlite3 = require('sqlite3').verbose();

let db;

function open() {
  // TODO: Do not hardcode path
  // TODO: Change mode to read/write
  return new Promise(
    (resolve, reject) =>
      (db = new sqlite3.Database(
        '/Users/bsorensen/take-home/db.sqlite',
        sqlite3.OPEN_READONLY,
        err => (err ? reject(err) : resolve())
      ))
  );
}

function close() {
  if (db) {
    db.close();
    db = null;
  }
}

function query(sql, params = {}) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
  });
}

function getSources() {
  return query('SELECT id, name FROM source WHERE deleted_at IS NULL;');
}

// Promise resolves to null if not found.
// Not ideal, but easier to handle than rejecting.
function getSource(id) {
  return query(
    'SELECT id, name, environment, encoding, created_at, updated_at FROM source WHERE id = $id AND deleted_at IS NULL;',
    {
      $id: id
    }
  ).then(resultSet => (resultSet.length > 0 ? resultSet[0] : null));
}

module.exports = {
  open,
  close,
  getSources,
  getSource
};
