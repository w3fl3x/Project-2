var db = require("../models");

module.exports = function(app) {
  // Get all examples
  app.get("/api/movies", function(req, res) {
    db.movies.findAll({}).then(function(dbMovies) {
      res.json(dbMovies);
    });
  });

  // Create a new example
  app.post("/api/movies", function(req, res) {
    db.movies.create({
      movie_name: req.body.movie_name,
      genre: req.body.genre,
      year: req.body.year,
      userRanking: req.body.user_ranking,
      userID: req.body.userID
    }).then(function(dbMovies) {
      res.json(dbMovies);
    });
  });

  // Update an example
  app.put("/api/movies", function(req, res) {
    console.log('TEST TESTT');
    console.log(req.body);
    db.movies.update(
      {
        seen: true
      }, {
        where: {
            id: req.body.id
          }
      }
    ).then(function(dbMovies) {
      res.json(dbMovies);
    });
  });

  // Delete an example by id
  app.delete("/api/movies/:id", function(req, res) {
    db.movies.destroy({ where: { id: req.params.id } }).then(function(
      dbMovies
    ) {
      res.json(dbMovies);
    });
  });
};
