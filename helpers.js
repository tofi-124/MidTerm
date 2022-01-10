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

const loginCheck = function (email, password, db) {
  return db
    .query(`SELECT * FROM users WHERE email = $1;`, [email])
    .then((res) => {
      if (res.rows) {
        return res.rows[0];
      }
      return null;
    })
    .then((user) => {
      if (bcrypt.compareSync(password, user.password)) {
        return user;
      }
      return null;
    });
};


module.exports = { getUserByEmail, passwordFinder, loginCheck };
