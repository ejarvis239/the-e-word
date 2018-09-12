const topicRouter = require('express').Router();
const {getTopics } = require('../controllers/topics')
const {getArticleByTopic, addArticle} = require('../controllers/articles')

topicRouter.route('/')
    .get(getTopics)

topicRouter.route('/:topic_slug/articles')
    .get(getArticleByTopic)
    .post(addArticle)

module.exports = topicRouter;