var db = require("../models");

module.exports = function(app) {
  // Get all examples
  app.get("/api/examples", function(req, res) {
    db.Movies.findAll({}).then(function(dbMovies) {
      res.json(dbMovies);
    });
  });

  // Create a new example
  app.post("/api/examples", function(req, res) {
    db.Movies.create({
      movieName: req.body.movie_name,
      genre: req.body.genre,
      year: req.body.year,
      userRanking: req.body.user_ranking,
      userID: req.body.userID
    }).then(function(dbMovies) {
      res.json(dbMovies);
    });
  });

  // Update an example
  app.post("/api/examples", function(req, res) {
    db.Movies.update(
      {
        seen: true
      },
      {
        where: {
          id: req.body.id
        }
      }
    ).then(function(dbMovies) {
      res.json(dbMovies);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function(req, res) {
    db.Movies.destroy({ where: { id: req.params.id } }).then(function(
      dbMovies
    ) {
      res.json(dbMovies);
    });
  });
};
