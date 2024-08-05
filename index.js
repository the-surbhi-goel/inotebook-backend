const connectToMongo = require("./db");

const express = require("express");
const cors = require("cors");

connectToMongo();
const app = express();
app.use(cors());
const port = 8000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/notes", require("./routes/notesRoute"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
