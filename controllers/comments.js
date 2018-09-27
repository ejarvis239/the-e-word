const { Comment, Article } = require('../models/index');

const getComments = (req, res, next) => {
  Comment.find()
  .populate('created_by', '-_id -__v')
  .populate('belongs_to', '-_id -__v')
  .then(comments => {
    res.status(200).send({ comments })
    })
    .catch(next)
  }

const getCommentByArticle = (req, res, next) => {
    const { article_id } = req.params;
    return Promise.all([
      Article.findById(article_id), 
      Comment.find({belongs_to: article_id}).populate('created_by', '-_id -__v').populate('belongs_to', '-_id -__v')])
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
        res.status(201).send({comment})
      })
      .catch(next)

  }

  const changeCommentVotes = (req, res, next) => {
    const {comment_id} = req.params
    if (req.query.vote == 'up'){
    Comment.findByIdAndUpdate({_id: comment_id}, {$set : {votes: +1}}, {new:true})
    .then(comment => {
      res.status(200).send({comment})
    })
    .catch(next)

  }
  else if (req.query.vote == 'down'){
    Comment.findByIdAndUpdate({_id: comment_id}, {$set: {votes: -1}}, {new:true})
    .then(comment => {
      res.status(200).send({comment})
    })
    .catch(next)

  }
}

  const deleteComment = (req, res, next) => {
    const {comment_id} = req.params
    Comment.findByIdAndRemove({_id: comment_id})
    .then(() => {
      res.status(200).send({ msg: "Comment successfully deleted!" })
    })
    .catch(next)

}

module.exports = { getComments, getCommentByArticle, addComment, changeCommentVotes, deleteComment};