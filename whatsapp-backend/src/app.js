import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
// import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import compression from "compression";
import fileUpload from "express-fileupload";
import cors from "cors";
import createHttpError from "http-errors";

// local
import routes from "./routers/index.js"

// Load environment variables from .env file
dotenv.config()

// Create Express application instance
const app = express();

// Log incoming requests in development mode (helps in debugging)
if(process.env.NODE_ENV !== "production"){ 
  app.use(morgan("dev"))
}

// Set secure HTTP headers to protect from common vulnerabilities
app.use(helmet())

// Parse incoming requests with JSON payloads
app.use(express.json())

// Parse incoming requests with URL-encoded payloads (from HTML forms)
app.use(express.urlencoded({ extended: true }))

// Sanitize data to prevent NoSQL injection attacks
// app.use(mongoSanitize())

// Parse cookies from the HTTP Request
app.use(cookieParser())

// Compress response bodies for all requests (improves performance)
app.use(compression())

// Enable file uploads, storing files temporarily on disk
app.use(fileUpload({ useTempFiles: true }))

// Enable Cross-Origin Resource Sharing for frontend running on localhost:3000
app.use(cors({ 
  // origin: "http://localhost:3000",
  // origin:  ["http://localhost:5173","http://localhost:3000"],
  origin:  [process.env.CLIENT_ENDPOINT],
}))

// console.log for url & method
app.use((req,res,next)=>{ 
  console.log(` url:${req.url}\n method:${req.method}`);
  next()
})

//api v1 routes
app.use("/api/v1",routes)

// Basic route for testing server setup
app.get("/",async (req, res, next) => { 
 
  res.send("data send")
})
app.post("/test", (req, res, next) => { 
  // res.status(409).json({message:"there is a conflict"})
  throw createHttpError.BadRequest("this through an error")
})

// error for route not exist
app.use(async (req, res, next) => {
  next(createHttpError.NotFound("This route does not exist."));
});


//error handling
app.use(async (err, req, res, next) => {
 
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

export default app;
