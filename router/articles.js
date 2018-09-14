const articleRouter = require('express').Router();
const {getArticles, getArticleById, changeArticleVotes } = require('../controllers/articles')
const {getCommentByArticle, addComment} = require('../controllers/comments')

articleRouter.route('/')
    .get(getArticles)

articleRouter.route('/:article_id')
    .get(getArticleById)
    .patch(changeArticleVotes)

articleRouter.route('/:article_id/comments')
    .get(getCommentByArticle)
    .post(addComment)

module.exports = articleRouter;