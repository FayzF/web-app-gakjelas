const ejs = require("ejs");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const accounts = require("./utils/accounts");
const { getWeatherData, calendar, gretings } = require("./utils/widget");

// SET UP
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/sse-data", async (req, res) => {
  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const weather = await getWeatherData();
    const calnd = calendar();

    setInterval(() => {
      const data = JSON.stringify({ weather, calnd });
      res.write(`data: ${data}\n\n`);
    }, 1000);
  } catch (err) {
    console.error("Error fetching data", err);
    res.status(500).end();
  }
});

// Render halaman "/"
app.get("/", async (req, res) => {
  try {
    const weather = await getWeatherData();
    const users = await accounts.User.find();
    const calnd = calendar();
    const greting = gretings();
    const empty = users.length === 0;
    res.render("index", { users, empty, weather, calnd, greting });
  } catch (err) {
    console.error("Error retrieving data", err);
    res.status(500).send(`Internal server error`);
  }
});

// Merender halaman "/login"
app.get("/login", async (req, res) => {
  res.render("login", {
    validName: false,
    validEmail: false,
    sign: false,
  });
});

//Menerima data dari halaman login
app.post("/login", async (req, res) => {
  // Value dari data yang diterima
  const username = req.body.name;
  const email = req.body.email;
  const sign = true;
  const validName = await accounts.User.findOne({ name: username });
  const validEmail = await accounts.User.findOne({ email: email });
  res.render("login", { validName, validEmail, sign });
});

app.get("/signin", async (req, res) => {
  res.render("signin", { duplicate: false, duplicateEmail: false });
});

app.post("/signin", async (req, res) => {
  // Value dari data yang diterima
  const username = req.body.name;
  const email = req.body.email;

  // Memasukkan value ke dalam database
  const newUser = new accounts.User({
    name: username,
    email: email,
  });
  const duplicate = await accounts.User.findOne({ name: username });
  const duplicateEmail = await accounts.User.findOne({ email: email });
  if (duplicate || duplicateEmail) {
    res.render("signin", { duplicate, duplicateEmail });
  } else {
    // Menyimpan data
    newUser
      .save()
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.error("Error gagal mengirimkan data:", err);
        res.status(500).send("gagal mengirimkan data");
      });
    // Kembali ke halaman "/login"
    res.redirect("/login");
  }
});

// Halaman default yang merespon status 404(TIDAK DITEMUKAN)
app.use((req, res) => {
  res
    .status(404)
    .send(
      "<h1 style='height:100vh; display:flex; justify-content:center; align-items:center; '> 404 <br> PAGE NOT FOUND</h1>"
    );
});

// Memulai server js
const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
