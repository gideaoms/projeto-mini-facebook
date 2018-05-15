const factoryGirl = require('factory-girl');
const faker = require('faker');
const User = require('../app/models/user');

const { factory } = factoryGirl;

factory.setAdapter(new factoryGirl.MongooseAdapter());

/**
 * User
 */
factory.define('User', User, {
  name: faker.name.findName(),
  email: factory.seq('User.email', n => `user_${n}@email.com`),
  password: faker.internet.password(),
});

module.exports = factory;
