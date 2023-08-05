//Module
const mongoose = require("mongoose");

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

module.exports = { User };
