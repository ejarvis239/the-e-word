const { User } = require('../models/index');

const getUserByUsername = (req, res, next) => {
    const {username} = req.params
    User.find({username: username}, '-__v')
    .then(([user]) => {
      if (user.length===0) throw {msg: 'user does not exist', status:404}
      res.status(200).send({user})
    })
    .catch(next)
}

module.exports = { getUserByUsername };
