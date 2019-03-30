const supertest = require('supertest');
const app = require('./app');
const security = require('./security');

// Integration tests

test('source route', done => {
  supertest(app)
    .get('/source')
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer ' + security.tokenForTesting)
    .expect('Content-Type', /json/)
    .expect(res => expect(res.text).toContain('Redox Memorial Hospital'))
    .expect(200, done);
});

test('route when no token', done => {
  supertest(app)
    .get('/source')
    .set('Accept', 'application/json')
    .expect(403, done);
});

test('single source route when found', done => {
  supertest(app)
    .get('/source/4e7cb748-9d37-4705-9d16-bd68a80afc39')
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer ' + security.tokenForTesting)
    .expect('Content-Type', /json/)
    .expect(res =>
      expect(res.text).toContain('Chicago University Health System')
    )
    .expect(200, done);
});

test('single source route when not found', done => {
  supertest(app)
    .get('/source/nosuch')
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer ' + security.tokenForTesting)
    .expect(404, done);
});
