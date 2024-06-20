const HttpError = require("./HttpError");
const ctrlWrapper = require("./ctrlWrapper");
const emailSend = require("./emailSend");
const { emailLetter, passwordLetter } = require("./emailLetter");
const { getUnique } = require("./compareComments");
// const calcPercent = require("./calcPercent");

module.exports = {
  HttpError,
  ctrlWrapper,
  emailSend,
  emailLetter,
  passwordLetter,
  getUnique,
  // calcPercent,
};
