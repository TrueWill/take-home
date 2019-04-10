const sqlite3 = require('sqlite3').verbose();
const uuidv4 = require('uuid/v4');

let db;

function open() {
  // TODO: Move hardcoded path to configuration
  return new Promise(
    (resolve, reject) =>
      (db = new sqlite3.Database(
        '/Users/bsorensen/take-home/db.sqlite',
        sqlite3.OPEN_READWRITE,
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

// Arguably should be checking deleted_at against current date as well.

function getSources() {
  return query(
    `SELECT id, name
    FROM source
    WHERE deleted_at IS NULL
    ORDER BY name;`
  );
}

// Promise resolves to null if not found.
// Not ideal, but easier to handle than rejecting.
function getSource(id) {
  return query(
    `SELECT id, name, environment, encoding, created_at, updated_at
    FROM source
    WHERE id = $id
      AND deleted_at IS NULL;`,
    {
      $id: id
    }
  ).then(resultSet => (resultSet.length > 0 ? resultSet[0] : null));
}

function getMessagesForSource(sourceId) {
  return query(
    `SELECT id, message, status, created_at, updated_at
    FROM message
    WHERE source_id = $sourceId
      AND deleted_at IS NULL
    ORDER BY created_at, id;`,
    {
      $sourceId: sourceId
    }
  );
}

const pageSize = 30;

function getMessagesForSourcePaginated(sourceId, page) {
  return query(
    `SELECT id, message, status, created_at, updated_at
    FROM message
    WHERE source_id = $sourceId
      AND deleted_at IS NULL
    ORDER BY id
    LIMIT $pageSize
    OFFSET $offset;`,
    {
      $sourceId: sourceId,
      $offset: page - 1,
      $pageSize: pageSize
    }
  );
}

function getMessagesForSourceWithStatus(sourceId, status) {
  return query(
    `SELECT id, message, status, created_at, updated_at
    FROM message
    WHERE source_id = $sourceId
      AND status = $status
      AND deleted_at IS NULL
    ORDER BY created_at, id;`,
    {
      $sourceId: sourceId,
      $status: status
    }
  );
}

function getMessageStatusCountsForSource(sourceId) {
  return query(
    `SELECT status, COUNT(id) AS count
    FROM message
    WHERE source_id = $sourceId
      AND deleted_at IS NULL
    GROUP BY status
    ORDER BY status;`,
    {
      $sourceId: sourceId
    }
  );
}

function getMessages() {
  return query(
    `SELECT id, source_id, message, status, created_at, updated_at
    FROM message
    WHERE deleted_at IS NULL
    ORDER BY created_at, id;`
  );
}

// Promise resolves to null if not found.
function getMessage(messageId) {
  return query(
    `SELECT id, source_id, message, status, created_at, updated_at
    FROM message
    WHERE id = $messageId
      AND deleted_at IS NULL;`,
    {
      $messageId: messageId
    }
  ).then(resultSet => (resultSet.length > 0 ? resultSet[0] : null));
}

function createSource(name, environment, encoding) {
  const id = uuidv4();

  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO source
      (id, name, environment, encoding)
      VALUES
      ($id, $name, $environment, $encoding);`,
      {
        $id: id,
        $name: name,
        $environment: environment,
        $encoding: encoding
      },
      err => (err ? reject(err) : resolve(id))
    );
  });
}

function updateSource(id, values) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE source
      SET name = $name, environment = $environment, encoding = $encoding, updated_at = datetime('now')
      WHERE id = $id;`,
      {
        $id: id,
        $name: values.name,
        $environment: values.environment,
        $encoding: values.encoding
      },
      err => (err ? reject(err) : resolve())
    );
  });
}

// Soft delete.
// Currently NOT implementing cascading delete on related messages.
function deleteSource(id) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE source
      SET deleted_at = datetime('now')
      WHERE id = $id;`,
      {
        $id: id
      },
      err => (err ? reject(err) : resolve())
    );
  });
}

// For tests
function undeleteSource(id) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE source
      SET deleted_at = NULL
      WHERE id = $id;`,
      {
        $id: id
      },
      err => (err ? reject(err) : resolve())
    );
  });
}

// For tests
function hardDeleteSource(id) {
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM source WHERE id = $id;',
      {
        $id: id
      },
      err => (err ? reject(err) : resolve())
    );
  });
}

module.exports = {
  open,
  close,
  getSources,
  getSource,
  getMessagesForSource,
  getMessagesForSourceWithStatus,
  getMessagesForSourcePaginated,
  getMessageStatusCountsForSource,
  getMessages,
  getMessage,
  createSource,
  updateSource,
  deleteSource,
  undeleteSource,
  hardDeleteSource
};
