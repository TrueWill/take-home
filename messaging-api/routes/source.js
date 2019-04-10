const express = require('express');
const repository = require('../persistence/repository');
const errorHandler = require('../errorHandler');
const security = require('../security');

const router = express.Router();

router.get('/', function(req, res) {
  repository
    .getSources()
    .then(sources => res.status(200).json(sources))
    .catch(err => errorHandler(err, res));
});

router.get('/:id', (req, res) => {
  const id = req.params.id;

  repository
    .getSource(id)
    .then(source =>
      source ? res.status(200).json(source) : res.sendStatus(404)
    )
    .catch(err => errorHandler(err, res));
});

// Optional ?status=value or ?page=N
router.get('/:id/message', (req, res) => {
  const id = req.params.id;
  const status = req.query.status;
  const page = req.query.page;

  let queryPromise;

  if (page) {
    queryPromise = repository.getMessagesForSourcePaginated(id, page);
  } else {
    queryPromise = status
      ? repository.getMessagesForSourceWithStatus(id, status)
      : repository.getMessagesForSource(id);
  }

  queryPromise
    .then(messages => {
      res.status(200).json(messages);
    })
    .catch(err => errorHandler(err, res));
});

router.get('/:id/message/status', (req, res) => {
  const id = req.params.id;

  repository
    .getMessageStatusCountsForSource(id)
    .then(counts => res.status(200).json(counts))
    .catch(err => errorHandler(err, res));
});

// Add source
router.post('/', (req, res) => {
  const source = req.body;

  repository
    .createSource(source.name, source.environment, source.encoding)
    .then(id => {
      res.location('/source/' + id);
      res.status(201).send();
    })
    .catch(err => errorHandler(err, res));
});

// Update source
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const source = req.body;

  repository
    .updateSource(id, source)
    .then(() => {
      res.status(204).send();
    })
    .catch(err => errorHandler(err, res));
});

// Delete source (soft, not cascading)
// Requires administrative role
router.delete('/:id', (req, res) => {
  const id = req.params.id;

  if (!security.isAuthorizedForAdministration(req)) {
    res.sendStatus(403);
    return;
  }

  repository
    .deleteSource(id)
    .then(() => {
      res.status(204).send();
    })
    .catch(err => errorHandler(err, res));
});

module.exports = router;
