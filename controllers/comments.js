const { Comment } = require('../models/index');

const getCommentByArticle = (req, res, next) => {
    const { article_id } = req.params;
    Comment.find({belongs_to: article_id})
      .then(comments => {
        res.status(200).send({ comments })
      })
  };

const addComment = (req, res, next) => {
    const {article_id} = req.params
    const newComment = req.body
    newComment.belongs_to = article_id
    Comment.create(newComment)
      .then(comment => {
        res.status(201).send({comment})
      })
  }

module.exports = { getCommentByArticle, addComment };