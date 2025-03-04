const connectDB = require("./src/Config/db");
const express = require('express');
const app = express();
const cors = require('cors');
const port = 5000;
connectDB();

app.use(express.json());
app.use(cors());

const authRoute=require("./src/Routes/AuthRoute");

const profileRoutes = require("./src/Routes/profileRoute");
const userProfileRoutes = require("./src/Routes/userProfleRoute");
const visaRoute = require("./src/Routes/visaRoute");

app.use('/api/auth',authRoute)

app.use("/user", userProfileRoutes);

app.use("/uploads", express.static(__dirname + "/uploads"));

app.use('/api/profile', profileRoutes);

app.use("/api", visaRoute );

app.listen(port, ()=>{
    console.log(`server is runnigng on ${port}`);
});