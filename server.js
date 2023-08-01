// Module
const ejs = require("ejs");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Script } = require("vm");

// SET UP
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
// menghubungkan ke database
const dbUrl = "mongodb://127.0.0.1:27017/login";
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("berhasil terhubung ke database");
  })
  .catch((err) => {
    console.log("ERROR to connecting MongoDB:", err);
  });

// Menentukan Schema dari database
const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
});
// Mengambil database Users
const User = mongoose.model("User", userSchema);

//Merender halaman "/"
app.get("/", async (req, res) => {
  try {
    const users = await User.find();
    if (users.length == 0) {
      let empty = true;
      res.render("index", { users, empty });
    } else {
      res.render("index", { users, empty: false });
    }
  } catch (err) {
    console.error("Error cannot find data", err);
    res.status(500).send(`Internal server error`);
  }
});

// Merender halaman "/login"
app.get("/login", (req, res) => {
  res.render("login");
});

//Menerima data dari halaman login
app.post("/login", (req, res) => {
  // Value dari data yang diterima
  const username = req.body.name;
  const email = req.body.email;

  // Memasukkan value ke dalam database
  const newUser = new User({
    name: username,
    email: email,
  });

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
  // Kembali ke halaman "/"
  res.redirect("/");
});

// Halaman default yang merespon status 404(TIDAK DITEMUKAN)
app.use((req, res) => {
  res
    .status(404)
    .send(
      "<h1 style='height:100vh; display:flex; justify-content:center; align-items:center; '> 404 <br> PAGE NOT FOUND</h1>"
    );
});

// Membuat Server Mendengar di Port bawah
const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
