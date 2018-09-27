const commentRouter = require('express').Router();
const {getComments, changeCommentVotes, deleteComment} = require('../controllers/comments')

commentRouter.route('/')
.get(getComments)

commentRouter.route('/:comment_id')
.patch(changeCommentVotes)
.delete(deleteComment)

module.exports = commentRouter;