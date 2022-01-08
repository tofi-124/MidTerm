const bcrypt = require("bcryptjs");

//Checks duplicate email
function getUserByEmail(newUserEmail, users) {
  for (let user in users) {
    if (users[user]["email"] === newUserEmail) {
      return user;
    }
  }
  return undefined;
}

//authentication
function passwordFinder(users, email, password) {
  for (let user in users) {
    if (users[user]["email"] === email) {
      if (bcrypt.compareSync(password, users[user]["password"])) {
        return users[user];
      }
    }
  }
}

module.exports = { getUserByEmail, passwordFinder };