process.env.NODE_ENV = 'test';
const data = require('../seed/testData/index.js')
const seedDB = require('../seed/seed.js');
const mongoose = require('mongoose');
const { expect } = require('chai');
const app = require('../app.js');
const request = require('supertest')(app);

describe('/api', () => {
  let topics, users, articles, comments;
  beforeEach(function() {
   return seedDB(data)
   .then((docs) => {
     [topics, users, articles, comments] = docs
   })
  });
  after(() => mongoose.disconnect())

    describe("/*", () => {
      it('GET any other path returns status 404 and message Page not found', () => {
      return request 
      .get("/hello")
      .expect(404)
      .then(res => { 
        expect(res.body.msg).to.equal('Page not found');
      })
    })
  })
    describe('/topics', () => {
        it('GET returns object with topic array and returns a 200 status', () => {
          return request
            .get('/api/topics/')
            .expect(200)
            .then(res => {
              expect(res.body.topics).to.have.length(2);
              expect(res.body.topics).to.be.an("array");
              expect(res.body.topics[0]).to.include.keys(
                "_id",
                "title",
                "slug",
                "__v")
            });
        })
      })
      describe('/topics/:topic_slug/articles', () => {
        it("GET returns all articles for a certain topic", () => {
          return request
          .get("/api/topics/mitch/articles")
          .expect(200)
          .then(res => {
            expect(res.body.topicArticles).to.be.an("array")
            expect(res.body.topicArticles).to.have.length(2);
            expect(res.body.topicArticles[0]).to.haveOwnProperty("comments")
          })
        })
        it("GET returns a status 404 when an invalid topic is requested", () => {
          return request
          .get("/api/topics/pokemon/articles")
          .expect(404)
          .then(res => { 
            expect(res.body.msg).to.equal("topic does not exist")
          })
        })
        it('POST adds new article to the topic and returns a 201 status', () => {
            return request
              .post('/api/topics/mitch/articles')
              .send({ title: 'mitch', body: 'mitch', belongs_to: 'mitch', created_by: users[0]._id})
              .expect(201)
              .then(res => { 
                expect(res.body.article.title).to.equal('mitch');
                expect(res.body.article.comments).to.equal(0);
                expect(res.body.article).to.include.keys(
                  "votes",
                  "_id",
                  "comments",
                  "title",
                  "body",
                  "belongs_to",
                  "created_by"
                )
              });
          });
        it('POST returns a 400 status and error message when the new post is empty', () => {
          return request
            .post('/api/topics/mitch/articles')
            .send({  })
            .expect(400)
            .then(res => { 
              expect(res.body.msg).to.equal('articles validation failed: created_by: Path `created_by` is required., body: Path `body` is required., title: Path `title` is required.');
            });
        });   
        it('POST returns a 400 status and error message when there is a missing required field in the new post', () => {
          return request
            .post('/api/topics/mitch/articles')
            .send({title: 'mitch', body: 'mitch'})
            .expect(400)
            .then(res => { 
              expect(res.body.msg).to.equal('articles validation failed: created_by: Path `created_by` is required.');
            });
        });   
      });   
    describe('/articles/', () => {
      it('GET returns object with article array and returns a 200 status', () => {
        return request
          .get('/api/articles/')
          .expect(200)
          .then(res => { 
            expect(res.body.articles[0].comments).to.equal(2);
            expect(res.body.articles[0]).to.haveOwnProperty("comments");
            expect(res.body.articles[0]).to.include.keys(
              "title",
              "body",
              "belongs_to",
              "created_by",
              "votes",
              "created_at",
              "_id",
              "comments"
            )
          });
      })
    })
    describe('/articles/:article_id', () => {
      it('GET returns object with article by id and returns a 200 status', () => {
        return request
          .get(`/api/articles/${articles[0]._id}`)
          .expect(200)
          .then(res => { 
            expect(res.body.article.comments).to.equal(2);
            expect(res.body.article).to.include.keys(
              "title",
              "body",
              "belongs_to",
              "created_by",
              "votes",
              "created_at",
              "_id",
              "comments"
            )
          });
      })
      it('GET an article id that doesnt exist returns an error message and a 404 status', () => {
        return request
          .get(`/api/articles/${mongoose.Types.ObjectId()}`)
          .expect(404)
          .then(res => { 
            expect(res.body.msg).to.equal('id does not exist');
          });
      })
    })
    describe('/articles/:article_id/comments', () => {
        it('GET returns comments for article by id and returns a 200 status', () => {
          return request
            .get(`/api/articles/${articles[0]._id}/comments`)
            .expect(200)
            .then(res => {
              expect(res.body.comments[0].body).to.equal('Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — on you it works.');
              expect(res.body.comments[0]).to.include.keys("votes", "created_at", "_id", "body", "belongs_to", "created_by", "__v")
              expect(res.body.comments.length).to.equal(2)
            });
        })
        it('GET comments for an article id that doesnt exist returns an error message and a 404 status', () => {
          return request
            .get(`/api/articles/${mongoose.Types.ObjectId()}/comments`)
            .expect(404)
            .then(res => { 
              expect(res.body.msg).to.equal('article ID does not exist');
            });
        })
      })
      it('POST adds new comment and returns a 201 status', () => {
        return request
          .post(`/api/articles/${articles[0]._id}/comments`)
          .send({ body: 'eevee is my favourite pokemon', belongs_to: articles[0]._id, created_by: users[0]._id})
          .expect(201)
          .then(res => {
            expect(res.body.comment.body).to.equal('eevee is my favourite pokemon');         
          });
      });
    it('POST returns a 400 status and error message when the new object is empty', () => {
      return request
        .post(`/api/articles/${articles[0]._id}/comments`)
        .send({  })
        .expect(400)
        .then(res => { 
          expect(res.body.msg).to.equal('comments validation failed: created_by: Path `created_by` is required., body: Path `body` is required.');
        });
      });
    describe('/api/articles/:article_id?vote=', () => {
      it('PATCH Increment the votes of an article by one', () => {
        return request
          .patch(`/api/articles/${articles[0]._id}?vote=up`)
          .expect(200)
          .then(res => {
            expect(res.body.article.votes).to.equal(1);
            expect(res.body.article).to.haveOwnProperty("comments")
          });
      })
      it('PATCH votes for article that doesnt exist returns an error message and a 404 status', () => {
        return request
          .get(`/api/articles/${mongoose.Types.ObjectId()}?vote=up`)
          .expect(404)
          .then(res => { 
            expect(res.body.msg).to.equal('id does not exist');
          });
      })
      it('PATCH decrements the votes of an article by one', () => {
        return request
        .patch(`/api/articles/${articles[0]._id}?vote=down`)
        .expect(200)
          .then(res => {
            expect(res.body.article.votes).to.equal(-1);
            expect(res.body.article).to.haveOwnProperty("comments")
          });
      })
      it('PATCH votes for article that doesnt exist returns an error message and a 404 status', () => {
        return request
          .get(`/api/articles/${mongoose.Types.ObjectId()}?vote=down`)
          .expect(404)
          .then(res => { 
            expect(res.body.msg).to.equal('id does not exist');
          });
      })
    })
    describe('/api/comments', () => {
      it('GET returns all comments for all articles', () => {
        return request
          .get('/api/comments')
          .expect(200)
          .then(res => {
            expect(res.body.comments.length).to.equal(8);
            expect(res.body.comments[0]).to.haveOwnProperty("belongs_to")
            expect(res.body.comments[0]).to.haveOwnProperty("created_by")
          });
      })
    })
    describe('/api/comments/:comment_id', () => {
      it('GET returns comment by comment ID', () => {
        return request
          .get(`/api/comments/${comments[0]._id}`)
          .expect(200)
          .then(res => {
            expect(res.body.comment).to.haveOwnProperty("belongs_to")
            expect(res.body.comment).to.haveOwnProperty("created_by")
          });
      })
      it('GET a comment for a comment ID that doesnt exist returns an error message and a 404 status', () => {
        return request
          .get(`/api/comments/${mongoose.Types.ObjectId()}`)
          .expect(404)
          .then(res => { 
            expect(res.body.msg).to.equal('comment ID does not exist');
          });
      })
    })
    describe('/api/comments/:comment_id?vote=', () => {
        it('PATCH Increment the votes of a comment by one', () => {
          return request
            .patch(`/api/comments/${comments[0]._id}?vote=up`)
            .expect(200)
            .then(res => {
              expect(res.body.comment.votes).to.equal(1);
            });
        })
        it('PATCH a comment for a comment ID that doesnt exist returns an error message and a 404 status', () => {
          return request
            .get(`/api/comments/${mongoose.Types.ObjectId()}?vote=up`)
            .expect(404)
            .then(res => { 
              expect(res.body.msg).to.equal('comment ID does not exist');
            });
        })
        it('PATCH decrements the votes of a comment by one', () => {
          return request
            .patch(`/api/comments/${comments[0]._id}?vote=down`)
            .expect(200)
            .then(res => {
              expect(res.body.comment.votes).to.equal(-1);
            });
        })
        it('PATCH a comment for a comment ID that doesnt exist returns an error message and a 404 status', () => {
          return request
            .get(`/api/comments/${mongoose.Types.ObjectId()}?vote=down`)
            .expect(404)
            .then(res => { 
              expect(res.body.msg).to.equal('comment ID does not exist');
            });
        })
        it('DELETE deletes the specified comment and returns a status 200', () => {
            return request.delete(`/api/comments/${comments[0]._id}`)
              .expect(200)
              .then(res => {
                expect(res.body.msg).to.equal('Comment successfully deleted!')
              })
      })
      describe('/users/:username', () => {
        it('GET Returns a JSON object with the profile data for the specified user', () => {
          return request
            .get('/api/users/butter_bridge')
            .expect(200)
            .then(res => { 
              expect(res.body.user[0]).to.include.keys('username', 'name', 'avatar_url');
            });
        })
        it('GET user that doesnt exist returns an error message and a 404 status', () => {
          return request
            .get(`/api/users/${mongoose.Types.ObjectId()}`)
            .expect(404)
            .then(res => { 
              expect(res.body.msg).to.equal('user does not exist');
            });
        })
      })
  });
})