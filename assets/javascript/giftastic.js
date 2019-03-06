$(document).ready(function() {

    // VARIABLES 
    //--------------------------------------------------
    var topics = [
      "minions", "disney-cars","inside out", "wall-e", "disney-brave","la luna", "coco","cars3"
    ];


    // FUNCTIONS 
    // -------------------------------------------
      function renderButtons(){

        console.log("renderButtons");
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
          console.log(gifButton);
          $('#gif-buttons').append(gifButton);
      }
    }

  // $(document).on("click", ".gifTastic", displayMovieInfo);
  // $(".gifTastic").on("click", function() {
  function displayGifInfo() {

    //CLear previous GIF IMAGES 
    // $("#gifs-appear-here").empty();

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
        var newGifDiv = $("<div id='gif-"+ i +"'>");

        var rating = results[i].rating;

        var p = $("<p>").text("Rating: " + rating);

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

        newGifDiv.prepend(p);
        newGifDiv.prepend(gifImage);

        $("#gifs-appear-here").prepend(newGifDiv);
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
    
    //MAIN PROCESS
    // -----------------

    // Calling the renderButtons function to display the intial buttons
    renderButtons(); 
    // Adding click event listeners to all elements with a class of "gifTastic"
    $(document).on("click", ".gifTastic", displayGifInfo); 
    
});  