  exports.generateUserRefObj = (data, docs) => {
    return data.reduce((acc, singleData, i) => {
      acc[singleData.username] = docs[i]._id;
      return acc;
    }, {})
  }

 exports.generateArticleRefObj = (data, docs) => {
  return data.reduce((acc, singleData, i) => {
    acc[singleData.title] = docs[i]._id;
    return acc;
  }, {})
}

  exports.formatArticleData = (articleData, userRefObj, topicDocs) => {
    const newArray = articleData.map(data => {
        return {belongs_to: data.topic, 
          created_by: userRefObj[data.created_by], 
          title: data.title, 
          votes: data.votes, 
          body: data.body, 
          created_at: data.created_at}
    })
    return newArray
  }

  exports.formatCommentData = (commentData, articleRefObj, userRefObjForComments) => {
 
      return commentData.map(commentDatum => {
      return {
        ...commentDatum, 
        created_by: userRefObjForComments[commentDatum.created_by],
        belongs_to: articleRefObj[commentDatum.belongs_to]
      }
    })
  }