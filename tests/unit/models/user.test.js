const { describe, it } = require('mocha');
const expect = require('chai').expect;

const { User } = require('../../../src/models');
const {
  InvalidParamKeyError,
  InvalidSortFieldError,
} = require('../../../src/utils');

describe('User', () => {
  let user;
  let userData;

  beforeEach(() => {
    userData = {
      email: 'blessed@example.com',
      password: '1234pass',
      name: {
        first: 'Blessed',
        last: 'Sibanda',
      },
      address: {
        line1: '123 Main Street',
        city: 'Gweru',
        state: 'Midlands',
        country: 'Zimbabwe',
      },
    };
    user = new User(userData);
  });

  it('exists', () => {
    expect(User).to.exist;
  });

  it('is valid if all required parameters are given', () => {
    let error = user.validateSync();
    expect(error).to.be.undefined;
  });

  it('has salt', () => {
    expect(user.salt).to.not.be.undefined;
  });

  it('has a hashedPassword', () => {
    expect(user.hashedPassword).to.not.be.undefined;
  });

  it('has a fullName', () => {
    expect(user.fullName).to.eq('Blessed Sibanda');
    userData.name.middle = 'Bladed';
    const user2 = new User(userData);
    expect(user2.fullName).to.eq('Blessed Bladed Sibanda');
  });

  describe('Email', () => {
    it('is invalid if email missing', () => {
      delete userData.email;
      user = new User(userData);
      let error = user.validateSync();
      expect(error).to.exist;
      expect(error.errors['email'].message).to.eq('Email is required');
    });

    it('is invalid if its not in the correct format', () => {
      const invalidEmails = ['blah.blah', 'bla', 'blah@@'];
      invalidEmails.forEach((email) => {
        userData.email = email;
        user = new User(userData);
        let error = user.validateSync();
        expect(error).to.exist;
        expect(error.errors['email'].message).to.eq('Email address is invalid');
      });
    });
  });

  describe('Picture', () => {
    it("has a default value of ''", () => {
      user = new User(userData);
      expect(user.picture).to.eql('');
    });
  });

  describe('Password', () => {
    it('is invalid if password is missing', () => {
      delete userData.password;
      user = new User(userData);
      let error = user.validateSync();
      expect(error).to.exist;
      expect(error.errors['hashedPassword'].message).to.eq('Password is required');
    });

    it('has a random salt', () => {
      let u1 = new User(userData);
      let u2 = new User(userData);
      expect(u1.salt).to.not.eq(u2.salt);
    });

    it('is invalid if its shorter than 6 characters', () => {
      userData.password = '12345';
      user = new User(userData);
      let error = user.validateSync();
      expect(error).to.exist;
      expect(error.errors['password'].message).to.eq(
        'Password must be at least 6 characters.',
      );
    });
  });

  describe('authenticate', () => {
    it('returns true if password is correct', () => {
      expect(user.authenticate(userData.password)).to.be.true;
    });

    it('returns false if password is incorrect', () => {
      expect(user.authenticate('cat')).to.be.false;
    });
  });

  describe('Name', () => {
    it('is invalid if firstName is missing', () => {
      delete userData.name.first;
      const user2 = new User(userData);
      let error = user2.validateSync();
      expect(error).to.exist;
      expect(error.errors['name.first'].message).to.eq('First Name is required');
    });

    it('is invalid if lastName is missing', () => {
      delete userData.name.last;
      const user2 = new User(userData);
      let error = user2.validateSync();
      expect(error).to.exist;
      expect(error.errors['name.last'].message).to.eq('Last Name is required');
    });
  });

  describe('Role', () => {
    it('has a default of `none`', () => {
      expect(user.role).to.eql('none');
    });

    it('rejects an invalid role', () => {
      user.role = 'unknown';
      let error = user.validateSync();
      expect(error).to.exist;
      expect(error.errors['role'].message).to.eq('unknown is not a valid role');
    });

    it('accepts a valid role', () => {
      ['manager', 'clerk', 'cashier', 'none'].forEach((role) => {
        user.role = role;
        let error = user.validateSync();
        expect(error).to.not.exist;
      });
    });
  });

  describe('Address', () => {
    it('is invalid if address line1 is missing', () => {
      delete userData.address.line1;
      const user2 = new User(userData);
      let error = user2.validateSync();
      expect(error).to.exist;
      expect(error.errors['address.line1'].message).to.eq(
        'Address line1 is required',
      );
    });

    it('is invalid if city is missing', () => {
      delete userData.address.city;
      const user2 = new User(userData);
      let error = user2.validateSync();
      expect(error).to.exist;
      expect(error.errors['address.city'].message).to.eq('City is required');
    });

    it('is invalid if state is missing', () => {
      delete userData.address.state;
      const user2 = new User(userData);
      let error = user2.validateSync();
      expect(error).to.exist;
      expect(error.errors['address.state'].message).to.eq(
        'State/Province is required',
      );
    });

    it('is invalid if country is missing', () => {
      delete userData.address.country;
      const user2 = new User(userData);
      let error = user2.validateSync();
      expect(error).to.exist;
      expect(error.errors['address.country'].message).to.eq('Country is required');
    });
  });

  describe('Phones', () => {
    it('has a default empty phones array', () => {
      expect(user.phones).to.eql([]);
    });

    it('accepts a valid a phone', () => {
      ['mobile', 'work', 'home'].forEach((phoneType) => {
        user.phones.push({ type: phoneType, digits: '12345678' });
        let error = user.validateSync();
        expect(error).to.not.exist;
      });
    });

    it('rejects invalid phone type', () => {
      user.phones.push({ type: 'InvalidPhone', digits: '12345678' });
      let error = user.validateSync();
      expect(error).to.exist;
      expect(error.errors['phones.0.type'].message).to.eq(
        'InvalidPhone is not a valid phone type',
      );
    });

    it('is invalid in phone number digits are missing', () => {
      user.phones.push({ type: 'work' });
      let error = user.validateSync();
      expect(error).to.exist;
      expect(error.errors['phones.0.digits'].message).to.eq(
        'Phone number digits is required',
      );
    });

    it('phone has a default phoneType of `mobile`', () => {
      user.phones.push({ digits: '12345678' });
      let error = user.validateSync();
      expect(error).to.not.exist;
      expect(user.phones[0].type).to.eq('mobile');
    });
  });

  describe('User#normalizeObject()', () => {
    it('normalizes query params', () => {
      let queryParams = {
        firstName: 'Blessed',
        lastName: 'Sibanda',
        email: 'blessed@example.com',
      };
      let expected = {
        email: queryParams['email'],
        'name.first': queryParams['firstName'],
        'name.last': queryParams['lastName'],
      };
      expect(User.normalizeObject(queryParams)).to.eql(expected);
    });

    it('throws "InvalidParamKeyError" error if invalid params are given', () => {
      let queryParams = {
        wrong: 'blah blah',
        foo: 'bar',
      };

      expect(function () {
        User.normalizeObject(queryParams);
      }).to.throw(InvalidParamKeyError);
    });
  });

  describe('User#normalizedFilterParams()', () => {
    it('returns normalized filter params', () => {
      let queryObj = {
        firstName: 'Bl',
        role: 'clerk',
        email: 'gmail',
      };
      let expected = {
        'name.first': { $regex: 'Bl', $options: 'i' },
        role: { $regex: 'clerk', $options: 'i' },
        email: { $regex: 'gmail', $options: 'i' },
      };
      expect(User.normalizedFilterParams(queryObj)).to.eql(expected);
    });

    it('throws "InvalidParamKeyError" error if invalid params are given', () => {
      let queryObj = {
        firstName: 'Bl',
        role: 'clerk',
        foo: 'bar',
        email: 'gmail',
      };

      expect(function () {
        User.normalizedFilterParams(queryObj);
      }).to.throw(InvalidParamKeyError);
    });
  });

  describe('User#normalizedSortFields()', () => {
    it('returns an array of sort fields', () => {
      let sortKey = 'email,middleName,-lastName,-role';
      let expected = [
        ['email', 1],
        ['name.middle', 1],
        ['name.last', -1],
        ['role', -1],
      ];
      expect(User.normalizedSortFields(sortKey)).to.eql(expected);
    });

    it('returns an empty array for an empty sort key', () => {
      let sortKey = '';
      let expected = [];
      expect(User.normalizedSortFields(sortKey)).to.eql(expected);
    });

    it('throws "InvalidSortKeyError" error if invalid params are given', () => {
      let sortKey = 'email,unknown';

      expect(function () {
        User.normalizedSortFields(sortKey);
      }).to.throw(InvalidSortFieldError);
    });
  });
});
