// Initialize Firebase
var config = {
  apiKey: "AIzaSyBSm4PcIVspVwrhXYqbiSkY8LABZ7-Gow8",
  authDomain: "trains-60d00.firebaseapp.com",
  databaseURL: "https://trains-60d00.firebaseio.com",
  storageBucket: "trains-60d00.appspot.com"
};

firebase.initializeApp(config);

var database = firebase.database();

// Button for adding trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var trainStart = $("#start-input").val().trim();
  var trainFrequency = $("#frequency-input").val().trim();
  var platformInput = $("#platform-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    start: trainStart,
    frequency: trainFrequency,
    platform: platformInput
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.start);
  console.log(newTrain.frequency);
  console.log(newTrain.platform);

  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#start-input").val("");
  $("#frequency-input").val("");
  $("#platform-input").val("");
});

// Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainStart = childSnapshot.val().start;
  var trainFrequency = childSnapshot.val().frequency;
  var platformInput = childSnapshot.val().platform;

  // Moment.js time calculations
  var startTimeMoment = moment(trainStart, "HH:mm");

  var currentTime = moment();

  var minuteArrival = currentTime.diff(startTimeMoment, "minutes");

  var minuteLast = minuteArrival % trainFrequency;

  var minutesAway = trainFrequency - minuteLast;

  var nextTrain = currentTime.add(minutesAway, "minutes");

  var arrivalTime = nextTrain.format("HH:mm");

  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDestination),
    $("<td>").text(trainFrequency),
    $("<td>").text(arrivalTime),
    $("<td>").text(minutesAway),
    $("<td>").text(platformInput)
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});