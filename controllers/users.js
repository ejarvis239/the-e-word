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

const getUsers = (req, res, next) => {
  User.find()
    .then(users => {
      res.status(200).send({ users })
    })
    .catch(next)
};


module.exports = { getUserByUsername, getUsers };
