const { Comment, Article } = require('../models/index');

const getComments = (req, res, next) => {
  Comment.find()
  .populate('created_by', '-__v')
  .populate('belongs_to', '-__v')
  .then(comments => {
    res.status(200).send({ comments })
    })
    .catch(next)
  }

const getCommentById = (req, res, next) => {
  const {comment_id} = req.params
  Comment.findById(comment_id)
  .populate('created_by', '-__v')
  .populate('belongs_to', '-__v')
  .then(comment => {
    if (!comment) throw {msg: 'comment ID does not exist', status:404}
    res.status(200).send({ comment })
    })
    .catch(next)
  }

const getCommentByArticle = (req, res, next) => {
    const { article_id } = req.params;
    return Promise.all([
      Article.findById(article_id), 
      Comment.find({belongs_to: article_id})
      .populate('created_by', '-__v')
      .populate('belongs_to', '-__v')])
    .then(([article, comments]) => {
      if (!article) throw {msg: 'article ID does not exist', status:404}
      res.status(200).send({ comments })
      })
      .catch(next)
    }

const addComment = (req, res, next) => {
    const {article_id} = req.params
    const newComment = req.body
    newComment.belongs_to = article_id
    Comment.create(newComment)
      .then(comment => {
        return Comment.findById(comment._id)
          .populate('created_by', '-__v')
          .populate('belongs_to', '-__v')
      })
      .then(comment => {
        res.status(201).send({comment})
      })
      .catch(next)
  }

  const changeCommentVotes = (req, res, next) => {
    const {comment_id} = req.params
    const votes = req.query.vote == 'up' ? 1 : req.query.vote == 'down' ? -1 : 0
    Comment.findByIdAndUpdate({_id: comment_id}, {$inc : {votes: votes}}, {new:true})
    .then(comment => {
      if (!comment) throw {msg: 'comment ID does not exist', status:404}
      res.status(200).send({comment})
    })
    .catch(next)
  }

  const deleteComment = (req, res, next) => {
    const {comment_id} = req.params
    Comment.findByIdAndRemove({_id: comment_id})
    .then(() => {
      res.status(200).send({ msg: "Comment successfully deleted!" })
    })
    .catch(next)

}

module.exports = { getComments, getCommentById, getCommentByArticle, addComment, changeCommentVotes, deleteComment};