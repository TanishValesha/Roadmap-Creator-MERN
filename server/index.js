const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const userRouter = require("./routers/userRoute");
const chartRouter = require("./routers/chartRouter");
const taskRouter = require("./routers/taskRouter");
require("dotenv").config();
const app = express();

app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"], // Add PUT to allowed methods
  })
);
app.use(express.json());
app.use(morgan("tiny"));

app.use("/api/user", userRouter);
app.use("/api/chart", chartRouter);
app.use("/api/tasks", taskRouter);

try {
  mongoose.connect(process.env.MONGODB_CONNECTION_STRING).then(() => {
    console.log("DB Connected");
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}

app.listen(process.env.PORT, () => {
  console.log(`Server running on Port ${process.env.PORT}`);
});
