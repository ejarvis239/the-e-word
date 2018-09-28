const { Article, Comment } = require('../models/index');

const getArticleByTopic = (req, res, next) => {
    const { topic_slug } = req.params;
    Article.find({belongs_to: topic_slug})
    .populate('created_by', '-_id -__v')
      .lean()
      .then(articles => {
          return Promise.all([articles, ...articles.map(article => {
            const commentCount = Comment.count({ belongs_to: article._id })
            return commentCount
          })])
        })
        .then(([articles, ...commentCount]) =>
          articles.map((article, i) => {
            return { ...article, comments: commentCount[i] };
          }))
        .then(topicArticles => {
       if (!topicArticles.length) throw {msg: 'topic does not exist', status:404}
       res.status(200).send({ topicArticles })
        })
      .catch(next)
  };

  const getArticles = (req, res, next) => {
      Article.find()
      .populate('created_by', '-__v')
      .lean()
      .then(articles => {
       return Promise.all([articles, ...articles.map(article => {
         const commentCount= Comment.count({belongs_to: article._id})
          return commentCount
        })])
        })
      .then(([articles, ...commentCount]) => {
        return Promise.all ([articles.map((article, index) => {
          return {...article, comments: commentCount[index]}
    })])
    .then(([articles]) => {
      res.status(200).send({articles})
    })
    .catch(next)
    })
  }

  const getArticleById = (req, res, next) => {
    const {article_id} = req.params
    return Promise.all([
    Comment.count({belongs_to: article_id}),
    Article.findById(article_id).populate('created_by', '-__v').lean()
  ])
    .then(([commentCount, article]) => {
      if (!article) return Promise.reject({msg: 'id does not exist', status:404})
        article = {...article, comments: commentCount}
        res.status(200).send({ article })
      })
      .catch(next)
  };

  const addArticle = (req, res, next) => {
    const {topic_slug} = req.params
    const newArticle = req.body
    newArticle.belongs_to = topic_slug
    Article.create(newArticle)
      .then(article1 => {
        const article = {...article1._doc, comments: 0, __v: undefined}
        res.status(201).send({article})
      })
      .catch(next)
  }

  const changeArticleVotes = (req,res, next) => {
    const {article_id} = req.params
    const votes = req.query.vote == 'up' ? 1 : req.query.vote == 'down' ? -1 : 0
    Comment.count({belongs_to: article_id})
    .then(commentCount => {
    Article.findByIdAndUpdate({_id: article_id}, {$set: {votes: votes}}, {new: true})
    .populate('created_by', '-__v').lean()
    .then(article1 => {
      const article = {...article1, comments: commentCount}
      if (!article) throw {msg: 'id does not exist', status:404}
      res.status(200).send({article})
    })
  })
    .catch(next)
  }

  module.exports = { getArticleByTopic, getArticles, getArticleById, addArticle, changeArticleVotes };