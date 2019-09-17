// Get references to page elements
// var $seenBtn = $("#seen-btn");

// The API object contains methods for each kind of request we'll make
var API = {
  saveMovie: function(Movies) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "/api/movies",
      data: JSON.stringify(Movies)
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
  }
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
// var handleFormSubmit = function(event) {
//   event.preventDefault();

//   var example = {
//     text: $exampleText.val().trim(),
//     description: $exampleDescription.val().trim()
//   };

//   if (!(example.text && example.description)) {
//     alert("You must enter an example text and description!");
//     return;
//   }

//   API.saveMovie(example).then(function() {
//     refreshExamples();
//   });

//   $exampleText.val("");
//   $exampleDescription.val("");
// };

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var updateBtnClick = function() {
  var idToUpdate = $(this).attr("value");

  console.log(idToUpdate);

  API.updateMovie(idToUpdate).then(function() {
    window.location.href = "/";
  });
};

// Add event listeners to the submit and delete buttons
$(document).on("click", "#seen-btn", updateBtnClick);
