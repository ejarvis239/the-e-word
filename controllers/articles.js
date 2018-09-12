const { Article } = require('../models/index');

const getArticleByTopic = (req, res, next) => {
    const { topic_slug } = req.params;
    Article.find({belongs_to: topic_slug})
      .then(articles => {
        res.status(200).send({ articles })
      })
  };

  const getArticles = (req, res, next) => {
    Article.find()
      .then(articles => {
        res.status(200).send({ articles })
      })
  };

  const getArticleById = (req, res, next) => {
    const {article_id} = req.params
    Article.find({_id: article_id})
      .then(articles => {
        res.status(200).send({ articles })
        console.log(articles)
      })
  };

  const addArticle = (req, res, next) => {
    const {topic_slug} = req.params
    const newArticle = req.body
    newArticle.belongs_to = topic_slug
    Article.create(newArticle)
      .then(article => {
        res.status(201).send({article})
      })
  }
  
  module.exports = { getArticleByTopic, getArticles, getArticleById, addArticle };