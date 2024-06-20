const VALIDATE_ERROR_MESSAGE = {
  //common
  FIELDS_MISSING: 'All fields are required',
  // email
  EMAIL_INVALID: 'email is invalid',
  REQUIRE_EMAIL: 'email is required',
  //username
  USERNAME_LENGTH: 'username must not be longer than 8 characters',
  USERNAME_REQUIRE: 'username is required',
  // password
  PASSWORD_LENGTH: 'password must be at least 8 characters',
  PASSWORD_NOT_MATCH: 'passwords are not match',
  PASSWORD_REQUIRE: 'password is required',
  PASSWORD_INCORRECT: 'password is incorrect',
  //signin
  SIGNIN_FIELDS_INCORRECT: 'email or password is incorrect',
  //change profile
  PROFILE_NO_DATA:
    'Please provide at least 1 field to update: username, photo or email',
};

module.exports = { VALIDATE_ERROR_MESSAGE };
