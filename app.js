const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const centerData = require("./model/Centerdata");
const redisClient = require("./redisConf");
const atob = require("atob");
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

   console.log(encodedData);
  try {
    req.query.encodedData = encodedData;
    decodedData = JSON.parse(atob(encodedData));
    req.query.data = decodedData;

    next();
  } catch (exception) {
    res.status(500);
    res.json({ error: true, data: "Internal server error" });
  }
};
VendorListMiddlewre = (req, res, next) => {
  const lat = req.query.data.lat;
  const long = req.query.data.long;
  const city = req.query.data.city;
  const encodedData = req.query.encodedData;
  const pageSize = req.query.pageSize ? +req.query.pageSize : 5;
  const pageIndex = req.query.pageIndex ? +req.query.pageIndex : 0;

  if ((!lat || !long) && city) {
    redisClient.exists(city, (err, reply) => {
      if (reply === 1) {
        redisClient.lrange(
          city,
          pageSize * pageIndex,
          (pageIndex + 1) * pageSize - 1,
          (err, centers) => {
            if (err) {
              res.status(500);
              res.json({ error: true, data: "Internal server error" });
              return;
            }
            let temp_centers = centers.map((val) => {
              return JSON.parse(val);
            });
            res.status(200);
            res.json({ error: false, data: temp_centers, cached: true });
          }
        );
        return;
      }
      next();
    });
  } else if (lat && long && city) {
    redisClient.exists(encodedData, (err, reply) => {
      if (reply == 1) {
        redisClient.lrange(
          encodedData,
          pageSize * pageIndex,
          (pageIndex + 1) * pageSize - 1,
          (err, centers) => {
            if (err) {
              res.status(500);
              res.json({ error: true, data: "Internal server error" });
              return;
            }
            let temp_centers = centers.map((val) => {
              return JSON.parse(val);
            });
            res.status(200);
            res.json({ error: false, data: temp_centers, cached: true });
          }
        );
        return;
      }

      next();
    });
  }
};
app.get("/listVendor", decoderMiddleWare, VendorListMiddlewre, (req, res) => {
  const lat = req.query.data.lat;
  const long = req.query.data.long;
  const city = req.query.data.city;
  const encodedData = req.query.encodedData;
  const pageSize = req.query.pageSize ? +req.query.pageSize : 5;
  const pageIndex = req.query.pageIndex ? +req.query.pageIndex : 0;

  if ((!lat || !long) && city) {
    centerData
      .find({ "address.city": city })
      .then((centers) => {
        res.status(200);
        let temp_centers = centers.map((val) => JSON.stringify(val));
        let transaction = redisClient.multi();
        for (let i = 0; i < temp_centers.length; i++) {
          transaction.rpush(city, temp_centers[i]);
        }
        transaction.expire(city, 10 * 60);
        transaction.exec((err, reply) => {
          console.log("added-->" + reply);
        });
        res.json({
          error: false,
          data: centers.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
        });
      })
      .catch((error) => {
        res.status(500);
        res.json({ error: true, data: "Internal server error" });
      });
  } else if (lat && long && city) {
    centerData
      .find({
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [lat, long] },
          },
        },
        "address.city": city,
      })
      .then((centers) => {
        res.status(200);
        let temp_centers = centers.map((val) => JSON.stringify(val));
        let transaction = redisClient.multi();
        for (let i = 0; i < temp_centers.length; i++) {
          transaction.rpush(encodedData, temp_centers[i]);
        }
        transaction.expire(encodedData, 10 * 60);
        transaction.exec((err, reply) => {
          console.log("added-->" + reply + " to " + encodedData);
        });
        res.json({
          error: false,
          data: centers.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
        });
      })
      .catch((error) => {
        res.status(500);
        res.json({ error: true, data: "Internal server error" });
      });
  } else {
    res.status(400);
    res.json({ error: true, data: "Please allow location or select city." });
    return;
  }
});
app.listen(8080);
