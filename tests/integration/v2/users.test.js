const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../app');
const { connectDb, generateUsers } = require('../../../src/utils');
const { MongoMemoryServer } = require('mongodb-memory-server');
const config = require('../../../config');
const { User } = require('../../../src/models');
const jwt = require('jsonwebtoken');
const expect = require('chai').expect;

const should = chai.should();

chai.use(chaiHttp);

describe('GET /users', () => {
  let mongod;
  before(async () => {
    // This will create an new instance of "MongoMemoryServer" and automatically start it
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    connectDb(uri);
  });

  after(async () => {
    await mongod.stop();
  });

  context('authenticated', () => {
    let users, token;
    let usersArr;
    before(async () => {
      try {
        usersArr = generateUsers(50);
        users = await User.insertMany(usersArr);
        token = 'Bearer ' + jwt.sign({ email: users[0].email }, config.jwtSecret);
      } catch (err) {
        console.error('Error occured: ' + err);
      }
    });

    it('returns a successful response', (done) => {
      chai
        .request(app)
        .get('/v2/users/')
        .set('authorization', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.include.keys('data', 'meta');
          res.body.meta.should.include.keys(
            'page',
            'perPage',
            'totalCount',
            'totalPages',
            'hasNextPage',
            'nextPage',
            'hasPrevPage',
            'prevPage',
            'total',
          );
          let item = res.body.data[0];
          item.should.include.keys(
            '_id',
            'name',
            'address',
            'createdAt',
            'updatedAt',
            'phones',
            'role',
            'level',
            'email',
            'picture',
          );
          res.body.data.should.have.length(User.perPage);
          done();
        });
    });

    it('allows filtering', async () => {
      let nameFilter = 'D';
      let emailFilter = 'gmail';
      let res = await chai
        .request(app)
        .get(`/v2/users/?firstName=${nameFilter}&email=${emailFilter}`)
        .set('authorization', token);
      res.body.should.include.keys('data', 'meta');
      let meta = res.body['meta'];
      let data = res.body['data'];
      expect(meta['page']).to.eql(1);
      let docs = await User.find({
        'name.firstName': { $regex: nameFilter, $options: 'i' },
        email: { $regex: emailFilter, $options: 'i' },
      })
        .select('-hashedPassword -salt -__v')
        .sort('-createdAt');
      expect(meta['total']).to.eql(docs.length);
      expect(data).to.eql(JSON.parse(JSON.stringify(docs)));
      expect(meta['totalPages']).to.eql(Math.ceil(docs.length / User.perPage));
    });

    it('allows sorting', async () => {
      let res = await chai
        .request(app)
        .get(`/v2/users/?sort=lastName`)
        .set('authorization', token);
      res.body.should.include.keys('data', 'meta');
      let result = await User.paginate(
        {},
        {
          select: '-hashedPassword -salt -__v',
          limit: User.perPage,
          page: 1,
          sort: [['name.lastName', 1]],
        },
      );
      let meta = res.body['meta'];
      let data = res.body['data'];
      let docs = result.docs;
      expect(meta['total']).to.eql(docs.length);
      expect(data).to.eql(JSON.parse(JSON.stringify(docs)));
    });
  });

  context('unauthenticated', () => {
    it('returns a 401 unauthorized', (done) => {
      chai
        .request(app)
        .get('/v2/users/')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.error.should.exist;
          done();
        });
    });
  });
});
