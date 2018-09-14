# NCNews backend checklist
- [ ] README clear and instructions accurate
- [ ] Needs instructions to seed database
- [yes] Package.json includes dependencies (mocha in particular) organised into dev and not dev
- [yes] Node modules and config file ignored
- [yes] Seed function takes raw data
- [yes] Routes broken down with `Router.route`
- [yes] Uses config file and process.env
- [yes] No errors in the console when running in dev or running tests
- [ ] Deployed on heroku and Mlab ()

## Implements all endpoints
- [yes] `GET /api/topics`
- [yes] `GET /api/topics/:topic_slug/articles` (should calculate comment count in controller)
- [yes] `POST /api/topics/:topic_slug/articles` 
- [yes] `GET /api/articles`  (should calculate comment count in controller)
- [yes] `GET /api/articles/:article_id`
- [yes] `GET /api/articles/:article_id/comments`
- [yes] `POST /api/articles/:article_id/comments`
- [yes] `PUT /api/articles/:article_id`
- [yes] `PUT /api/comments/:comment_id`
- [yes] `DELETE /api/comments/:comment_id`
- [yes] `GET /api/users/:username`
- [yes] Error handling on server (e.g. cast errors / validation errors, 400 and 500)
- [ ] Error handling on controllers
- [ ] 404 on invalid routes.

## Testing 
- [yes] Tests use test environment and DB
- [yes] Tests run successfully and are explicit: not just testing the length of things, but actual data values as well
- [yes] Describe_it blocks organised_logically
- [yes] Tests all endpoints
- [yes] Tests 400 and 404 errors