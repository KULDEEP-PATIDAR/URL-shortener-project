const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 8000;
const URL_DB= path.join(__dirname,"data","urls.json");

// Set view engine
app.set('view engine', 'ejs');
app.use(express.static("public"));
// Parse form data
app.use(bodyParser.urlencoded({ extended: false }));


let urls = JSON.parse(fs.readFileSync(URL_DB));

function generateShortID() {
  return Math.random().toString(36).substring(2, 8);
}

app.get("/", (req, res) => {
  res.render("index", { urls });
});

app.post("/shorten", (req, res) => {
  const longURL = req.body.longURL;
  if (!longURL) {
    return res.status(400).send("Missing URL");
  }
  const shortID = generateShortID();
  urls[shortID] = longURL;

  fs.writeFileSync(URL_DB, JSON.stringify(urls, null, 2));
  res.redirect("/");
});

// Redirect Handler
app.get("/:shortID", (req, res) => {
  const longURL = urls[req.params.shortID];
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.status(404).send("❌ Short URL not found");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});



