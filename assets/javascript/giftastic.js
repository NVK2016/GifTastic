$(document).ready(function() {

    // VARIABLES 
    //--------------------------------------------------
    var topics = [
      "minions", "disney-cars","inside out", "wall-e", "disney-brave","la luna", "UP",
      "snow white" , "disney-monsters", "disney-toy story"
    ];

    // // get favorites from local storage or empty array
    // var favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // // add class 'fav' to each favorite
    // favorites.forEach(function(favorite) {
    //   document.getElementById(favorite).className = 'fav';
    // });

    // FUNCTIONS 
    // -------------------------------------------
      function renderButtons(){

        // console.log("renderButtons");
        // Delete the content inside the gif-buttons div prior to adding new gif buttons 
        $("#gif-buttons").empty(); 

        // Loop through the array of topics, then generate buttons for each topic in the array
        for(var i=0; i< topics.length; i++)
        {
          //Create button 
          var gifButton = $("<button class='btn-outline-success m-3'>");
          gifButton.addClass("gifTastic");  //its helpful when we use event listeners 
          //Add movie name 
          gifButton.attr("data-name", topics[i]);  
          gifButton.text(topics[i]);

          $('#gif-buttons').append(gifButton);
      }
    }

  // $(document).on("click", ".gifTastic", displayMovieInfo);
  // $(".gifTastic").on("click", function() {
  function displayGifInfo() {

    //CLear previous GIF IMAGES 
    $("#gifs-appear-here").empty();

    //Take the GIF NAME AS A PARAMETER 
    var gifTopic = $(this).attr("data-name");

    //RETURNS 10 items for the selected topic
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + gifTopic + "&api_key=4aCPsmsCn0T77A2YUnVUvvAFYd6t9it8&limit=10";

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
      var results = response.data;
      console.log(results);

      for (var i = 0; i < results.length; i++) {
        var newGifDiv = $("<div id='gif-"+ i +"' class='col-md-6' style='float:left;'>");

        var rating = results[i].rating;

        //Rating condition 
        if (!( rating === "pg-13" || rating === "r" || rating === "gv" )){

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

    //EVENT LISTINERS 
    //-------------------------------------------
   
    // This function handles events where the add topic SUBMIT button is clicked
    $("#add-gifs").on("click", function(event) {
      event.preventDefault();
      // This line of code will grab the input from the textbox
      var topic = $("#topic-input").val().trim();

      // The movie from the textbox is then added to our array
      topics.push(topic);

      // Calling renderButtons which handles the processing of our gif array
      renderButtons();
    });

     //ON BUTTON CLICK ANIMATE OR STILL THE GIF IMAGES 
     $(document).on("click", ".gif-animation", function() {
      // console.log("Animation IMage click"); 
      //GIF IMAGE STATE 
      var state = $(this).attr("data-state"); 
      // console.log(state);

      if (state === "still") {
        $(this).attr("src",  $(this).attr("data-animate")); 
        $(this).attr("data-state", "animate"); 
      }
      else {
        $(this).attr("src",  $(this).attr("data-still")); 
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
      var queryURL = "https://rest.bandsintown.com/artists/"+artist.split(' ').join('%20')+"?app_id=54beed58-86b2-4068-bf0e-d05667919404";
  
      // We then created an AJAX call
      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
  
        // Create CODE HERE to Log the queryURL
        // console.log(queryURL)
        // Create CODE HERE to log the resulting object
        // console.log(response)
       
            // Using jQuery, append the following to the #artist-div :
            // The artist's name
            $("#artist-div").append("<h5> Artist Name: " + response.name + "</h5>"); 
            // The artists thumbnail image
            var newImg = $("<br /> <img class='gif-animation' src="+ response.thumb_url+" /> <br/>"); 
            $("#artist-div").append(newImg); 
            // The number of fans tracking this artist
            $("#artist-div").append("<p class='txt-light'> Number of Fans: " + response.tracker_count + "</p>"); 
            // The number of upcoming events for this artist
            $("#artist-div").append("<p class='txt-light'> Upcoming Events: " + response.upcoming_event_count+ "</p>"); 
            // A link to the bandsintown url for this artist
            // Note: Append actual HTML elements, not just text
            $("#artist-div").append("<a id='artist-link' href='"+response.url+"' > Click HERE to track events </a>"); 
          });
    }
  
    // Event handler for user clicking the select-artist button
    $("#select-artist").on("click", function(event) {
      // Preventing the button from trying to submit the form
      event.preventDefault();
      // Storing the artist name
      var artist = $("#artist-input").val().trim();
      console.log(artist);
      if ( artist !== null && artist !== ""){
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
    $("#pixarDisplay").hide(); 
    $("#bandDisplay").hide(); 

      //On click of start button the game starts 
    $('#btn-pixar').click(function () {
      console.log("Pixar Button clicked");

      $('#btn-pixar').hide();
      $('#btn-artist').show();

      $("#pixarDisplay").show(); 
      $("#bandDisplay").hide(); 

      $("#gifs-appear-here").empty(); 
      $("#artist-div").empty(); 
    });

    //On click of start button the game starts 
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