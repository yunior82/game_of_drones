const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const { Players, Score } = require("./data");

const API_PORT = 3001;
const app = express();
const router = express.Router();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); //My frontend APP domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// this is our MongoDB database
const dbRoute = "mongodb://localhost:27017/gameDB2";

// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

router.get("/getData", (req, res) => {
  Players.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.get("/getScoreData", (req, res) => {
  Score.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.post("/putPlayerData", (req, res) => {
  let data = new Players();
  const { player_1, player_2 } = req.body;
  if ( !player_1 || !player_2 ) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  data.player_1 = player_1;
  data.player_2 = player_2;
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.post("/putRoundData", (req, res) => {
  let data = new Score();
  const { round, winner } = req.body;
  if ( !round || !winner ) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  data.round = round;
  data.winner = winner;
  data.save(err => {
    if (err){
       return res.json({ success: false, error: err})
    }else{
      Score.find((err, data) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ data: data });
      });
    }
  });
});

router.delete("/delDB", async (req, res) => {
  await db.dropDatabase(function(err, result) {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: 'Dropped' });
  });
});

// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));

