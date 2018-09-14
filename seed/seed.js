const mongoose = require('mongoose');
const { Article, Comment, Topic, User } = require('../models')
const { generateUserRefObj, formatArticleData, generateArticleRefObj, formatCommentData} = require('../utils')

const seedDB = ({ topicData, userData, articleData, commentData }) => {
  return mongoose.connection.dropDatabase()
    .then(() => {
      return Promise.all([
        Topic.insertMany(topicData),
        User.insertMany(userData)
      ])
    })
    .then(([topicDocs, userDocs]) => {
      const userRefObj = generateUserRefObj(userData, userDocs)
      return Promise.all([
        topicDocs,
        userDocs,
        Article.insertMany(formatArticleData(articleData, userRefObj, topicDocs))
      ])
    })
    .then(([topicDocs, userDocs, articleDocs]) => {
      const userRefObjForComments = generateUserRefObj(userData, userDocs)
      const articleRefObj = generateArticleRefObj(articleData, articleDocs)
      return Promise.all([
        topicDocs,
        userDocs,
        articleDocs,
        Comment.insertMany(formatCommentData(commentData, articleRefObj, userRefObjForComments))
      ])
    })
  }

module.exports = seedDB;