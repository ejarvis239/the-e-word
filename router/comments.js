const commentRouter = require('express').Router();
const {getComments, getCommentById, changeCommentVotes, deleteComment} = require('../controllers/comments')

commentRouter.route('/')
.get(getComments)

commentRouter.route('/:comment_id')
.get(getCommentById)
.patch(changeCommentVotes)
.delete(deleteComment)

module.exports = commentRouter;