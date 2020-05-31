const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const centerData = require("./model/Centerdata");
const atob = require("atob");
const vendorCashingMiddleware = require("./middleware/VendorCachingMiddleware");
const vendorRoutes = require("./route/VendorListRoutes");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,Authorization"
  );
  res.header("Access-Control-Allow-Methods", "*");
  next();
});
mongoose
  .connect(
    "mongodb+srv://rapidprint:behappy123@cluster0-fjjdr.mongodb.net/RapidPrint?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected!!");
  })
  .catch(console.log);
decoderMiddleWare = (req, res, next) => {
  let encodedData = req.query.data;

  //console.log(encodedData);
  try {
    req.query.encodedData = encodedData;
    decodedData = JSON.parse(atob(encodedData));
    req.query.data = decodedData;

    next();
  } catch (exception) {
    console.log(exception);
    res.status(500);
    res.json({ error: true, data: "Internal server error" });
  }
};
app.use("/listVendor", decoderMiddleWare, vendorRoutes);

app.listen(3000);
