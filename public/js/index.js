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
    console.log("else");

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
$(document).on("mouseover", ".movieInfo", function() {
  var omdbTitle = $(this).text();
  displayOmdb(omdbTitle);
});

$(document).on("click", ".movieInfo", function() {
  var omdbTitle = $(this).text();
  displayOmdb(omdbTitle);
});

var displayOmdb = function(movie) {
  //console.log("Hey I'm here!")
  var queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    var movieDiv = $("<div>");
    var poster = response.Poster;
    var p1 = $("<img>").attr("src", poster);

    movieDiv.attr("class", "pInfo");
    movieDiv.append(p1);

    var rating = response.imdbRating;
    var p2 = $("<p>").text("Rating: " + rating);

    movieDiv.append(p2);

    var year = response.Released;
    var p3 = $("<p>").text("Released: " + year);

    movieDiv.append(p3);

    var genre = response.Genre;
    var p4 = $("<p>").text("Genre: " + genre);

    movieDiv.append(p4);

    var actors = response.Actors;
    var p5 = $("<p>").text("Actors: " + actors);

    movieDiv.append(p5);

    var plot = response.Plot;
    var p6 = $("<p>").text("Plot: " + plot);

    movieDiv.append(p6);

    $(".omdb").html(movieDiv);

    console.log(response);
  });
};

/**
 * Full Background Video
 *
 * More info on Audio/Video Media Events/Attributes/Methods
 * - https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
 * - http://www.w3schools.com/tags/ref_av_dom.asp
 */

(function (global) {

  // Define Bideo constructor on the global object
  global.Bideo = function () {

    // Plugin options
    this.opt = null;
    // The Video element
    this.videoEl = null;

    // Approximate Loading Rate
    //
    // The value will be a number like 0.8
    // which means to load 4 seconds of the video
    // it takes 5 seconds. If the number is super low
    // like 0.2 (regular 3g connections) then you can
    // decide whether to play the video or not.
    // This behaviour will be controller with
    // the `acceptableLoadingRate` option.
    this.approxLoadingRate = null;

    // Methods to which `this` will be bound
    this._resize = null;
    this._progress = null;

    // Time at which video is initialized
    this.startTime = null;

    this.onLoadCalled = false;

    // Initialize and setup the video in DOM`
    this.init = function (opt) {
      // If not set then set to an empty object
      this.opt = opt = opt || {};

      var self = this;

      self._resize = self.resize.bind(this);

      // Video element
      self.videoEl = opt.videoEl;

      // Meta data event
      self.videoEl.addEventListener('loadedmetadata', self._resize, false);

      // Fired when enough has been buffered to begin the video
      // self.videoEl.readyState === 4 (HAVE_ENOUGH_DATA)
      self.videoEl.addEventListener('canplay', function () {
        // Play the video when enough has been buffered
        if (!self.opt.isMobile) {
          self.opt.onLoad && self.opt.onLoad();
          if (self.opt.autoplay !== false) self.videoEl.play();
        }
      });

      // If resizing is required (resize video as window/container resizes)
      if (self.opt.resize) {
        global.addEventListener('resize', self._resize, false);
      }

      // Start time of video initialization
      this.startTime = (new Date()).getTime();

      // Create `source` for video
      this.opt.src.forEach(function (srcOb, i, arr) {
        var key
          , val
          , source = document.createElement('source');

        // Set all the attribute key=val supplied in `src` option
        for (key in srcOb) {
          if (srcOb.hasOwnProperty(key)) {
            val = srcOb[key];

            source.setAttribute(key, val);
          }
        }

        self.videoEl.appendChild(source);
      });

      if (self.opt.isMobile) {
        if (self.opt.playButton) {
          self.opt.videoEl.addEventListener('timeupdate', function () {
            if (!self.onLoadCalled) {
              self.opt.onLoad && self.opt.onLoad();
              self.onLoadCalled = true;
            }
          });


          self.opt.playButton.addEventListener('click', function () {
            self.opt.pauseButton.style.display = 'inline-block';
            this.style.display = 'none';

            self.videoEl.play();
          }, false);
        }
      }

      return;
    }

    // Called once video metadata is available
    //
    // Also called when window/container is resized
    this.resize = function () {
      // IE/Edge still don't support object-fit: cover
      if ('object-fit' in document.body.style) return;

      // Video's intrinsic dimensions
      var w = this.videoEl.videoWidth
        , h = this.videoEl.videoHeight;

      // Intrinsic ratio
      // Will be more than 1 if W > H and less if H > W
      var videoRatio = (w / h).toFixed(2);

      // Get the container DOM element and its styles
      //
      // Also calculate the min dimensions required (this will be
      // the container dimentions)
      var container = this.opt.container
        , containerStyles = global.getComputedStyle(container)
        , minW = parseInt( containerStyles.getPropertyValue('width') )
        , minH = parseInt( containerStyles.getPropertyValue('height') );

      // If !border-box then add paddings to width and height
      if (containerStyles.getPropertyValue('box-sizing') !== 'border-box') {
        var paddingTop = containerStyles.getPropertyValue('padding-top')
          , paddingBottom = containerStyles.getPropertyValue('padding-bottom')
          , paddingLeft = containerStyles.getPropertyValue('padding-left')
          , paddingRight = containerStyles.getPropertyValue('padding-right');

        paddingTop = parseInt(paddingTop);
        paddingBottom = parseInt(paddingBottom);
        paddingLeft = parseInt(paddingLeft);
        paddingRight = parseInt(paddingRight);

        minW += paddingLeft + paddingRight;
        minH += paddingTop + paddingBottom;
      }

      // What's the min:intrinsic dimensions
      //
      // The idea is to get which of the container dimension
      // has a higher value when compared with the equivalents
      // of the video. Imagine a 1200x700 container and
      // 1000x500 video. Then in order to find the right balance
      // and do minimum scaling, we have to find the dimension
      // with higher ratio.
      //
      // Ex: 1200/1000 = 1.2 and 700/500 = 1.4 - So it is best to
      // scale 500 to 700 and then calculate what should be the
      // right width. If we scale 1000 to 1200 then the height
      // will become 600 proportionately.
      var widthRatio = minW / w;
      var heightRatio = minH / h;

      // Whichever ratio is more, the scaling
      // has to be done over that dimension
      if (widthRatio > heightRatio) {
        var new_width = minW;
        var new_height = Math.ceil( new_width / videoRatio );
      }
      else {
        var new_height = minH;
        var new_width = Math.ceil( new_height * videoRatio );
      }

      this.videoEl.style.width = new_width + 'px';
      this.videoEl.style.height = new_height + 'px';
    };

  };

}(window));

(function () {

  var bv = new Bideo();
  bv.init({
    // Video element
    videoEl: document.querySelector('#background_video'),

    // Container element
    container: document.querySelector('body'),

    // Resize
    resize: true,

    // autoplay: false,

    isMobile: window.matchMedia('(max-width: 768px)').matches,

    playButton: document.querySelector('#play'),
    // pauseButton: document.querySelector('#pause'),

    // Array of objects containing the src and type
    // of different video formats to add
    src: [
      {
        src: '../imgs/film_027___4K_res.mp4',
        type: 'video/mp4'
      }
    ],

    // What to do once video loads (initial frame)
    onLoad: function () {
      document.querySelector('#video_cover').style.display = 'none';
    }
  });
}());