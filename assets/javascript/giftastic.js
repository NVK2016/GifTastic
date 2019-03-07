$(document).ready(function () {

  // VARIABLES 
  //--------------------------------------------------
  var topics = [
    "minions", "disney-cars", "inside out", "wall-e", "disney-brave", "la luna", "UP",
    "snow white", "disney-monsters", "disney-toy story"
  ];

  // // get favorites from local storage or empty array
  // var favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  // // add class 'fav' to each favorite
  // favorites.forEach(function(favorite) {
  //   document.getElementById(favorite).className = 'fav';
  // });

  // FUNCTIONS 
  // -------------------------------------------
  function renderButtons() {

    // console.log("renderButtons");
    // Delete the content inside the gif-buttons div prior to adding new gif buttons 
    $("#gif-buttons").empty();

    // Loop through the array of topics, then generate buttons for each topic in the array
    for (var i = 0; i < topics.length; i++) {
      //Create button 
      var gifButton = $("<button class='btn-outline-success m-3'>");
      gifButton.addClass("gifTastic");  //its helpful when we use event listeners 
      //Add movie name 
      gifButton.attr("data-name", topics[i]);
      gifButton.text(topics[i]);

      $('#gif-buttons').append(gifButton);
    }
  }

  //Display iformation related to GIF button clicked or entered  
  function displayGifInfo() {

    //CLear previous GIF IMAGES 
    $("#gifs-appear-here").empty();

    //Take the GIF NAME AS A PARAMETER 
    var gifTopic = $(this).attr("data-name");
    console.log(gifTopic);

    if (gifTopic !== null && gifTopic !== "") {
      //RETURNS 10 items for the selected topic
      var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + gifTopic + "&api_key=4aCPsmsCn0T77A2YUnVUvvAFYd6t9it8&limit=10";

      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function (response) {
        var results = response.data;
        console.log(results);

        for (var i = 0; i < results.length; i++) {
          var newGifDiv = $("<div id='gif-" + i + "' class='col-md-6' style='float:left;'>");

          var rating = results[i].rating;

          //Rating condition 
          if (!(rating === "pg-13" || rating === "r" || rating === "gv")) {

            var p = $("<p>").text("Rating: " + rating);
            p.append("<br/> Title: " + results[i].title);
            p.append("<br/> Click the gif to animate it!!");

            var gifImage = $("<img>");
            //STILL & ANIMATE URLS 
            var animateImgURL = results[i].images.fixed_height.url;
            var stillImgUrl = results[i].images.fixed_height_still.url;
            // console.log(animateImgURL); 
            // console.log(stillImgUrl); 

            gifImage.attr("src", stillImgUrl);
            gifImage.attr("data-still", stillImgUrl);
            gifImage.attr("data-animate", animateImgURL);
            gifImage.attr("data-state", "still");
            gifImage.addClass("gif-animation");

            newGifDiv.append(p);
            newGifDiv.append(gifImage);

            $("#gifs-appear-here").append(newGifDiv);
          }
        }
      });
    }
    else {
      alert("Cannot leave topic blank , please enter a pixar movie name");
      $(this).focus();
    }

  }

  //Validation FUnctions 
  //-------------------------------------------

  function alphanumeric(inputtxt) {

    // console.log("aplha " + inputtxt) ; 
    var letters = /^[0-9a-zA-Z]+$/;
    
    if (inputtxt.match(letters)) {
      return true;
    }
    else {
      alert('Please input alphanumeric characters only');
      return false;
    }
  }

  function required(inputtxt) {
    console.log("required " + inputtxt) ; 

    if (inputtxt.length == 0 || inputtxt == ""){
      alert('Please enter a valid value ');
      return false;
    }
    else {
      return true;
    }
  }

  //-------------------------------------------------------------

  //EVENT LISTINERS 
  //-------------------------------------------

  // This function handles events where the add topic SUBMIT button is clicked
  $("#add-gifs").on("click", function (event) {
    event.preventDefault();
    // This line of code will grab the input from the textbox
    var topic = $("#topic-input").val().trim();

    //Checks if the movie name is alphanumeric or not 
    if (required(topic)) {
      // The movie from the textbox is then added to our array
      topics.push(topic);

      // if (topic !== null & topic !== "") {
      // Calling renderButtons which handles the processing of our gif array
      renderButtons();
    }
    else {
      // alert("Please enter a topic name, to add a button");
      $("#topic-input").focus();
    }
  });

  //ON BUTTON CLICK ANIMATE OR STILL THE GIF IMAGES in case of dynamic buttons we added event listiner after the $document isloaded
  $(document).on("click", ".gif-animation", function () {
    // console.log("Animation IMage click"); 
    //GIF IMAGE STATE 
    var state = $(this).attr("data-state");
    // console.log(state);

    if (state === "still") {
      $(this).attr("src", $(this).attr("data-animate"));
      $(this).attr("data-state", "animate");
    }
    else {
      $(this).attr("src", $(this).attr("data-still"));
      $(this).attr("data-state", "still");
    }

  });

  // BANDS in TOWN API 
  //----------------------------------------------------

  function searchBandsInTown(artist) {
    console.log("searchBandsInTown");
    // Add code to query the bands in town api searching for the artist received as an argument to this function
    // This is our API key. Add your own API key between the ""
    $("#artist-div").empty();

    // Here we are building the URL we need to query the database
    var queryURL = "https://rest.bandsintown.com/artists/" + artist.split(' ').join('%20') + "?app_id=54beed58-86b2-4068-bf0e-d05667919404";

    // We then created an AJAX call
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {

      // Using jQuery, append the following to the #artist-div :
      // The artist's name
      $("#artist-div").append("<h5 class='text-light' > Artist Name: " + response.name + "</h5>");
      // The artists thumbnail image
      var newImg = $("<br /> <img  src=" + response.thumb_url + " /> <br/>");
      $("#artist-div").append(newImg);
      // The number of fans tracking this artist
      $("#artist-div").append("<p class='text-light'> Number of Fans: " + response.tracker_count + "</p>");
      // The number of upcoming events for this artist
      $("#artist-div").append("<p class='text-light'> Upcoming Events: " + response.upcoming_event_count + "</p>");
      // A link to the bandsintown url for this artist
      // Note: Append actual HTML elements, not just text
      $("#artist-div").append("<a id='artist-link' href='" + response.url + "' > Click HERE to track events </a>");

    });
  }

  // Event Listiner for user clicking the select-artist button
  $("#select-artist").on("click", function (event) {
    // Preventing the button from trying to submit the form
    event.preventDefault();
    // Storing the artist name
    var artist = $("#artist-input").val().trim();

    // if( alphanumeric(artist));

    if (required(artist)) {
      // Running the searchBandsInTown function (passing in the artist as an argument)
      searchBandsInTown(artist);
    }
    else {
      alert("Please enter an artist name");
      $("#artist-input").focus();
    }
  });

  //MAIN PROCESS
  // -----------------

  //Show GIFPHY section  by default and hide BANDS IN town 
  $("#pixarDisplay").show();
  $("#bandDisplay").hide();

  //On click of GIFPHY button the gifphy section is visible and bands is hidden 
  $('#btn-pixar').click(function () {
    console.log("Pixar Button clicked");

    // $('#btn-pixar').hide();
    $('#btn-artist').show();

    $("#pixarDisplay").show();
    $("#bandDisplay").hide();

    $("#gifs-appear-here").empty();
    $("#artist-div").empty();
  });

  //On click of artist button vice-versa takes place 
  $('#btn-artist').click(function () {
    console.log("Artist Band Button clicked");

    $('#btn-pixar').show();
    $('#btn-artist').hide();

    $("#pixarDisplay").hide();
    $("#bandDisplay").show();

    $("#gifs-appear-here").empty();
    $("#artist-div").empty();

  });

  // Calling the renderButtons function to display the intial buttons
  renderButtons();
  
  // Adding click event listeners to all elements with a class of "gifTastic"
  $(document).on("click", ".gifTastic", displayGifInfo);

});  