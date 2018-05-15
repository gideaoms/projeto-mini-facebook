const chai = require('chai');
const httpMock = require('node-mocks-http');
const factory = require('../factories');
const authMiddleware = require('../../app/middlewares/auth');
const User = require('../../app/models/user');

const { expect } = chai;

describe('Auth middleware', () => {
  it('should validate the presence of JWT token', async () => {
    const request = httpMock.createRequest();
    const response = httpMock.createResponse();

    await authMiddleware(request, response);

    expect(response.statusCode).to.be.eq(401);
  });

  it('should validate if token is valid', async () => {
    const request = httpMock.createRequest({
      headers: {
        authorization: 'Bearer 123',
      },
    });
    const response = httpMock.createResponse();

    await authMiddleware(request, response);

    expect(response.statusCode).to.be.eq(401);
  });

  it('should pass if token is valid', async () => {
    const user = await factory.create('User');
    const request = await httpMock.createRequest({
      headers: {
        authorization: `Bearer ${user.generateToken()}`,
      },
    });
    const response = httpMock.createResponse();

    await authMiddleware(request, response);

    expect(request).to.include({ user: { id: user.id } });
    expect(true).to.be.eq(true);
  });
});
