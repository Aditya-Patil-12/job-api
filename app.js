require("dotenv").config();
require("express-async-errors");

// extra security packages ....
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const express = require("express");
const app = express("xss-clean");

// ===== IMPORTS =================
// routers ....
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");
// connect database ...
const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");
// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
// IMPORTS OVER ===================================

// Post request Middle Ware
app.use(express.json());
// extra packages
app.use(rateLimiter({
  windowMs:15*60*100,
  max:100,
}));
app.set('trust proxy',1)

app.use(helmet());
app.use(cors());
app.use(xss());
// ======= Routes ============
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

// ======= MiddleWare ==========
app.use(notFoundMiddleware);
// so everyError has got through this errorHandleMiddleWare .....
// (err,req,res,next) -> we invoke the customApiHandle
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
