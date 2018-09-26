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
      .then(articles => {
       return Promise.all([articles, ...articles.map(article => {
         const commentCount= Comment.count({belongs_to: article._id})
          return commentCount
        })])
        })
      .then(([articles, ...commentCount]) => {
        return Promise.all ([articles.map((article, index) => {
          return {
            ...article._doc,
            comments: commentCount[index]
      }
    })])
    .then(([newArticleArray]) => {
      res.status(200).send(newArticleArray)
    })
    .catch(next)
    })
  }

  const getArticleById = (req, res, next) => {
    const {article_id} = req.params
    Comment.count({belongs_to: article_id})
    .then(commentCount => {
    Article.findById(article_id)
    .populate('created_by', '-__v')
      .then(article1 => {
        const article = {...article1._doc, commentCount: commentCount}
        if (!article) throw {msg: 'id does not exist', status:404}
        res.status(200).send({ article })
      })
    })
      .catch(next)
  };

  const addArticle = (req, res, next) => {
    const {topic_slug} = req.params
    const newArticle = req.body
    newArticle.belongs_to = topic_slug
    Article.create(newArticle)
      .then(article => {
        res.status(201).send({article})
      })
      .catch(next)
  }

  const changeArticleVotes = (req,res, next) => {
    const {article_id} = req.params

    if (req.query.vote === 'up'){
    Article.findByIdAndUpdate({_id: article_id}, {$set: {votes: +1}}, {new: true})
    .then(article => {
      res.status(200).send({article})
    })
    .catch(next)
  }
    if (req.query.vote === 'down'){
    Article.findByIdAndUpdate({_id: article_id}, {$set: {votes: -1}}, {new: true})
    .then(article => {
      res.status(200).send({article})
    })
    .catch(next)
  }
}
  
  module.exports = { getArticleByTopic, getArticles, getArticleById, addArticle, changeArticleVotes };