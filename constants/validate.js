const VALIDATE_ERROR_MESSAGE = {
  //profile
  PROFILE_NO_DATA:
    'Please provide at least 1 field to update: username, photo or email',
  //common
  FIELDS_MISSING: 'All fields are required',
  //comment
  COMMENT_BLANK: 'Comment must not be blank',
  DATA_INCORRECT: 'Data is incorrect',
  // email
  EMAIL_INVALID: 'email is invalid',
  REQUIRE_EMAIL: 'email is required',

  // follow
  FOLLOW_SELF: 'You cannot follow yourself',
  FOLLOW_ALREADY: 'You have already followed the user',
  //gender
  GENDER_REQUIRE: 'gender is required',
  GENDER_TYPE_INCORRECT: 'gender should be male or female',

  //likes
  LIKED: 'user has already liked the post',
  UNLIKED: 'user has already unliked the post',

  // password
  PASSWORD_LENGTH: 'password must be at least 8 characters',
  PASSWORD_NOT_MATCH: 'passwords are not match',
  PASSWORD_REQUIRE: 'password is required',
  PASSWORD_INCORRECT: 'password is incorrect',

  // post
  POST_ID_REQUIRED: 'Post ID is required',
  USER_ID_REQUIRED: 'User ID is required',

  //signin

  SIGNIN_FIELDS_INCORRECT: 'email or password is incorrect',

  //upload
  NO_FILE: 'No file was uploaded',

  //user
  USER_NOT_EXIST: 'user does not exists',

  //username
  USERNAME_LENGTH: 'username must not be longer than 8 characters',
  USERNAME_REQUIRE: 'username is required',
};

module.exports = { VALIDATE_ERROR_MESSAGE };
