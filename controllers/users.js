const { User } = require('../models/index');

const getUserByUsername = (req, res, next) => {
    const {username} = req.params
    User.find({username: username})
    .then(user => {
      res.send({ user })
    })
    .catch(next)
}

module.exports = { getUserByUsername };
