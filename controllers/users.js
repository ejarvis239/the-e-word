const { User } = require('../models/index');

const getUserByUsername = (req, res, next) => {
    const {username} = req.params
    User.find({username: username}, '-_id -__v')
    .then(user => {
      res.status(200).send({user})
    })
    .catch(next)
}

module.exports = { getUserByUsername };
