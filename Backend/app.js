const express = require("express");
const bodyParser = require ('body-parser')
const morgan = require("morgan");
const connectDB = require("./config/db")
const auth = require("./middlewares/auth") 
const app = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(require("cors"))();


// app.get("/protected",auth,(req,res)=>{
//     return res.status(200).json({...req.user._doc})
// })
app.use("/api", require("./routes/auth"))

app.get("/", (req, res) => {
  res.send("Hello World");
});

// routes
app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/contact"));

// server configurations.
const PORT = process.env.PORT || 8000;
app.listen(PORT, async() => {
   try {
     //await connectDB();
   console.log(`Server is running on port:${PORT}`);
   } catch (error) {
    console.log(error);  
   }
});
