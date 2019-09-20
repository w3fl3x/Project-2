// Get references to page elements
var movie_name = $("#title");
var genre = $("#genre");
var year = $("#year");
var addBtn = $("#addBtn");

// The API object contains methods for each kind of request we'll make
var API = {
  saveMovie: function(movie) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "/api/movies",
      data: JSON.stringify(movie)
    });
  },
  getMovie: function() {
    return $.ajax({
      url: "/api/movies",
      type: "GET"
    });
  },
  updateMovie: function(Movies) {
    var putData = { id: Movies };
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      url: "/api/movies",
      type: "PUT",
      data: JSON.stringify(putData)
    });
  },
  deleteMovie: function(Movies) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      url: "/api/movies/" + Movies,
      type: "DELETE"
    });
  }
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var movie = {
    movie_name: movie_name.val().trim(),
    genre: genre.val().trim(),
    year: year.val().trim()
  };
  console.log(movie);

  if (!movie_name || !genre || !year) {
    alert(
      "You forgot to enter one of the following fields: title, genre or year!"
    );
  } else {
    API.saveMovie(movie).then(function() {
      window.location.href = "/";
    });
  }

  movie_name.val("");
  genre.val("");
  year.val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var updateBtnClick = function() {
  var idToUpdate = $(this).attr("value");

  console.log(idToUpdate);

  API.updateMovie(idToUpdate).then(function() {
    window.location.href = "/";
  });
};

//This function will toggle the list display
var toggleList1 = function() {
  $("#seenFalse").css("display", "block");
  $("#seenTrue").css("display", "none");
};

var toggleList2 = function() {
  $("#seenFalse").css("display", "none");
  $("#seenTrue").css("display", "block");
};

// delete a specific movie from database when clicked on trash emblem
var deleteBtnClick = function() {
  var deleteThis = $(this).attr("value");
  console.log(deleteThis);

  API.deleteMovie(deleteThis).then(function() {
    window.location.href = "/";
  });
};

// Add event listeners to the submit and delete buttons
addBtn.on("click", handleFormSubmit);
//click button to toggle movie as seen
$(document).on("click", "#seen-btn", updateBtnClick);
//click button to toggle between lists
$(document).on("click", "#searchRadio1", toggleList1);
$(document).on("click", "#searchRadio2", toggleList2);
//Click Button to Delete
$(document).on("click", "#delete-btn", deleteBtnClick);

//Displaying Info After Button Click
$(document).on("mouseover", ".movieinfo", displayOmdb);
$(document).on("click", ".movieinfo", displayOmdb);

var displayOmdb = function() {
  //console.log("Hey I'm here!")
  var omdbTitle = $(this).text();
  var queryURL = "https://www.omdbapi.com/?t=" + omdbTitle + "&apikey=trilogy";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    var poster = response.Poster;
    var p1 = $("<img>").attr("src", poster);
    $(".omdb").append(p1);

    var rating = response.imdbRating;
    var p2 = $("<p>").text("Rating: " + rating);
    $(".omdb").append(p2);

    var year = response.Released;
    var p3 = $("<p>").text("Released: " + year);
    $(".omdb").append(p3);

    var genre = response.Genre;
    var p4 = $("<p>").text("Genre: " + genre);
    $(".omdb").append(p4);

    var actors = response.Actors;
    var p5 = $("<p>").text("Actors: " + actors);
    $(".omdb").append(p5);

    var plot = response.Plot;
    var p6 = $("<p>").text("Plot: " + plot);
    $(".omdb").append(p6);

    console.log(response);
  });
};
