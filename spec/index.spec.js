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
        it.only("GET returns all articles for a certain topic", () => {
          return request
          .get("/api/topics/mitch/articles")
          .expect(200)
          .then(res => { console.log(res.body)
            expect(res.body.topicArticles).to.be.an("array")
            expect(res.body.topicArticles).to.have.length(2);
          })
        })
        it("GET returns a status 400 when an invalid topic is requested", () => {
          return request
          .get("/api/topics/pokemon/articles")
          .expect(404)
          .then(res => { 
            console.log(res.body)
          })
        })


        it('POST adds new article to the topic and returns a 201 status', () => {
            return request
              .post('/api/topics/mitch/articles')
              .send({ title: 'mitch', body: 'mitch', belongs_to: 'mitch', created_by: users[0]._id})
              .expect(201)
              .then(res => {
                expect(res.body.article.title).to.equal('mitch');
                expect(res.body.article).to.include.keys(
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
            expect(res.body[0].comments).to.equal(2);
          });
      })
    })
    describe('/articles/:article_id', () => {
      it('GET returns object with article by id and returns a 200 status', () => {
        return request
          .get(`/api/articles/${articles[0]._id}`)
          .expect(200)
          .then(res => {
            expect(res.body.article.commentCount).to.equal(2);
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
            });
        })
      })
      it('POST adds new comment and returns a 201 status', () => {
        return request
          .post(`/api/articles/${articles[0]._id}/comments`)
          .send({ body: 'eevee is my favourite pokemon', belongs_to: articles[0]._id, created_by: users[0]._id})
          .expect(201)
          .then(res => {
            console.log(res.body)
            expect(res.body.comment.body).to.equal('eevee is my favourite pokemon');         
          });
      });
    it('POST returns a 400 status and error message when the new object is empty', () => {
      return request
        .post(`/api/articles/${articles[0]._id}/comments`)
        .send({  })
        .expect(400)
        .then(res => { console.log(res.body)
          expect(res.body.msg).to.equal('comments validation failed: created_by: Path `created_by` is required., body: Path `body` is required.');
        });
      });
    describe('/api/articles/:article_id?vote=', () => {
      it('PATCH Increment the votes of an article by one', () => {
        return request
          .patch(`/api/articles/${articles[0]._id}?vote=up`)
          .expect(200)
          .then(res => {
            console.log(res.body)
            expect(res.body.article.votes).to.equal(1);
          });
      })
      it('PATCH decrements the votes of an article by one', () => {
        return request
        .patch(`/api/articles/${articles[0]._id}?vote=down`)
        .expect(200)
          .then(res => {
            console.log(res.body)
            expect(res.body.article.votes).to.equal(1);
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
        it('PATCH decrements the votes of a comment by one', () => {
          return request
            .patch(`/api/comments/${comments[0]._id}?vote=down`)
            .expect(200)
            .then(res => {
              expect(res.body.comment.votes).to.equal(-1);
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
            .get('/api/users/username')
            .expect(200)
            .then(res => {
              console.log(res.body)
              // expect(res.body).to.equal('');
            });
        })
      })
  });
})