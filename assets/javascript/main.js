var config = {
  apiKey: "AIzaSyABH3oQze7i_CG3MB1PB6sVCu0Jdxdg1vs",
  authDomain: "flight-schedule-41e4e.firebaseapp.com",
  databaseURL: "https://flight-schedule-41e4e.firebaseio.com",
  projectId: "flight-schedule-41e4e",
  storageBucket: "",
  messagingSenderId: "114824753162"
};
firebase.initializeApp(config);

var dataRef = firebase.database();

var plane = "";
var destination = "";
var nextArrival = "";
var frequency = "";
var minutesAway = "";

$("#flightSubmit").on("click", function (event) {
  event.preventDefault();

  planeName = $("#planeName")
    .val()
    .trim();
  destination = $("#destination")
    .val()
    .trim();
  firstPlaneTime = $("#firstPlaneTime")
    .val()
    .trim();
  frequency = $("#frequency")
    .val()
    .trim();

  dataRef.ref().push({
    plane: planeName,
    destination: destination,
    first: firstPlaneTime,
    frequency: frequency,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

  $("#planeName").val("");
  $("#destination").val("");
  $("#firstPlaneTime").val("");
  $("#frequency").val("");

  return false;
});

dataRef.ref().on("child_added", function (childSnapshot, value) {
  $(".planeData").append(
    "<tr><td>" +
    childSnapshot.val().plane +
    "</td><td>" +
    childSnapshot.val().destination +
    "</td><td>" +
    childSnapshot.val().nextArrival +
    "</td><td>" +
    childSnapshot.val().frequency +
    "</td><td>" +
    childSnapshot.val().minutesAway +
    "</td></tr>"
  );
  var pFrequency = 60;

  var startTime = "06:00";

  var startTimeConverted = moment(firstPlaneTime, "hh:mm").subtract(1, "years");
  console.log(startTimeConverted);

  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  var diffTime = moment().diff(moment(startTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  var remainder = diffTime % frequency;
  console.log(remainder);

  var minutesAway = pFrequency - remainder;
  console.log("MINUTES TILL PLANE: " + minutesAway);

  var nextArrival = moment().add(minutesAway, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm"));
});

dataRef
  .ref()
  .orderByChild("dateAdded")
  .limitToLast(1)
  .on("child_added", function (snapshot) {
    $("plane").text(snapshot.val().plane);
    $("destination").text(snapshot.val().destination);
    $("nextArrival").text(snapshot.val().nextArrival);
    $("frequency").text(snapshot.val().frequency);
    $("minutesAway").text(snapshot.val().minutesAway);
  });

//on click event to remove plane