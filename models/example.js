module.exports = function(sequelize, DataTypes) {
  var Movies = sequelize.define("movies", {
    movie_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255]
      }
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255]
      }
    },
    year: {
      type: DataTypes.INT,
      allowNull: false, 
    }, 
    seen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    user_ranking: DataTypes.FLOAT,
    userID: DataTypes.STRING
  });
  return Movies;
};
