const { Comment } = require('../models/index');

const getCommentByArticle = (req, res, next) => {
    const { article_id } = req.params;
    Comment.find({belongs_to: article_id})
    .populate('created_by', '-_id -__v')
    .populate('belongs_to', '-_id -__v')
      .then(comments => {
        res.status(200).send({ comments })
      })
      .catch(next)

  };

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

module.exports = { getCommentByArticle, addComment, changeCommentVotes, deleteComment};