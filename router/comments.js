const commentRouter = require('express').Router();
const {changeCommentVotes, deleteComment} = require('../controllers/comments')

commentRouter.route('/:comment_id')
.patch(changeCommentVotes)
.delete(deleteComment)

module.exports = commentRouter;