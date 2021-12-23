const { describe, it } = require('mocha');
const expect = require('chai').expect;
const { formatError } = require('../../src/utils/error-util');
const User = require('../../src/models/user.model');
const { Error, Types } = require('mongoose');

describe('ErrorUtil::formatError', () => {
  describe('Non-Validation errors', () => {
    it('returns error message', () => {
      let error = new Error('some message');
      expect(formatError(error)).to.eql({ message: 'some message' });
    });
  });

  describe('Validation errors', () => {
    let description = 'formats error by field names';

    describe('Case 1', () => {
      it(description, () => {
        let user = new User();
        let error = user.validateSync();
        let expectedResult = {
          message: 'User validation failed',
          errors: {
            hashedPassword: 'Password is required',
            address: {
              country: 'Country is required',
              state: 'State/Province is required',
              city: 'City is required',
              line1: 'Address line1 is required',
            },
            name: {
              lastName: 'Last Name is required',
              firstName: 'First Name is required',
            },
            email: 'Email is required',
          },
        };
        expect(formatError(error)).to.deep.eq(expectedResult);
      });
    });

    describe('Case 2', () => {
      it(description, () => {
        let user = new User({ name: { firstName: 'Blessed' } });
        let error = user.validateSync();
        let expectedResult = {
          message: 'User validation failed',
          errors: {
            hashedPassword: 'Password is required',
            address: {
              country: 'Country is required',
              state: 'State/Province is required',
              city: 'City is required',
              line1: 'Address line1 is required',
            },
            name: {
              lastName: 'Last Name is required',
            },
            email: 'Email is required',
          },
        };
        expect(formatError(error)).to.deep.eq(expectedResult);
      });
    });

    describe('Case 3', () => {
      it(description, () => {
        let user = new User({
          name: { firstName: 'Blessed', lastName: 'Sibanda' },
          email: 'wrong-email',
        });
        let error = user.validateSync();
        let expectedResult = {
          message: 'User validation failed',
          errors: {
            hashedPassword: 'Password is required',
            address: {
              country: 'Country is required',
              state: 'State/Province is required',
              city: 'City is required',
              line1: 'Address line1 is required',
            },

            email: 'Email address is invalid',
          },
        };
        expect(formatError(error)).to.deep.eq(expectedResult);
      });
    });

    describe('Case 4', () => {
      it(description, () => {
        let user = new User({
          name: { firstName: 'Blessed', lastName: 'Sibanda' },
          email: 'blessed@example.com',
          password: '123',
          address: {
            country: 'Zimbabwe',
            state: 'Midlands',
            city: 'Gweru',
            line1: '123 Main Street',
          },
        });
        let error = user.validateSync();
        let expectedResult = {
          message: 'User validation failed',
          errors: {
            password: 'Password must be at least 6 characters.',
          },
        };
        expect(formatError(error)).to.deep.eq(expectedResult);
      });
    });
  });
});
