const { User } = require('../models/index');

const getUserByUsername = (req, res, next) => {
    const {username} = req.params
    User.findById(username)
    .then(user => {
      console.log(user)
      res.status(200).send({user})
    })
    .catch(next)
}

module.exports = { getUserByUsername };
