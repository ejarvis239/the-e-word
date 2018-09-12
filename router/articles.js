const articleRouter = require('express').Router();
const {getArticles, getArticleById } = require('../controllers/articles')
const {getCommentByArticle, addComment} = require('../controllers/comments')

articleRouter.route('/')
    .get(getArticles)

articleRouter.route('/:article_id')
    .get(getArticleById)

articleRouter.route('/:article_id/comments')
    .get(getCommentByArticle)
    .post(addComment)

module.exports = articleRouter;