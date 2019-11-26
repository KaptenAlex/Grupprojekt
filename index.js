const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const http = require("http");
const path = require("path");

let app = express();
let face;
let word;

app.use("/images", express.static(path.join(__dirname, "images")));


app.use(fileUpload({
  createParentPath: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(morgan('dev'));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
  res.render("edit");
});

app.post("/profile", async (req, res) => {
  try {
    if (!req.files) {
      res.render("profile", {
        profile_image: "./images/deafult.png",
        profile_name: req.body.profile_name || "Default name",
        profile_title: req.body.profile_name || "Default name",
      });
    } else {
      //Use the name of the input field (i.e. "profile_pic") to retrieve the uploaded file
      let profile_pic = req.files.profile_image;

      //Use+ the mv() method to place the file in upload directory (i.e. "uploads")
      profile_pic.mv('./images/' + profile_pic.name);

      word = req.body.profile_name || "Default name";
      face = "/images/" + req.files.profile_image.name;
    }
  } catch (err) {
    res.status(500).send(err);
  }
  res.render("profile", {
    profile_name: word,
    profile_image: face,
    profile_title: req.body.profile_name || "Default name",

  });
});

app.get("/profile", (req, res) => {
  res.render("profile", {
    profile_name: word,
    profile_image: face,
    profile_title: req.body.profile_name || "Default name",

  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("App is running on port: " + port);
});


//app.listen(3000);
