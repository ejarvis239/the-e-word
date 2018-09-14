const apiRouter = require('express').Router();
const topicRouter = require('./topics');
const articleRouter = require('./articles');
const commentRouter = require('./comments');
const userRouter = require('./users');

apiRouter.use('/topics', topicRouter);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/comments', commentRouter);
apiRouter.use('/users', userRouter);

app.get('/', (req, res, next) => {
        res.sendFile({'./README3.md'})
      })

module.exports = apiRouter;