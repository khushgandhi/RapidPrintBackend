const express = require("express");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const redisClient = require("../redisConf");
const centerData = require("../model/Centerdata");
const VendorCacheMiddleware = require("../middleware/VendorCachingMiddleware");
const singleColored = "one_side_color_page";
const singlePlain = "one_side_plain_page";
const doubleColored = "double_side_color_page";
const doublePlain = "double_side_plain_page";
convertToIgnoreCase = (val) => {
  return new RegExp(["^", val, "$"].join(""), "i");
};

router.get(
  "/sortBy/singleSidedPlain",
  VendorCacheMiddleware.sortedBySingleSidedPlainMiddleware,
  (req, res, next) => {
    const city = convertToIgnoreCase(req.query.data.city);
    const encodedData = req.query.encodedData;
    const direction = req.query.direction ? req.query.direction : 1;
    try {
      centerData
        .find({
          "address.city": city,
        })
        .sort({ "price.one_side_plain_page": direction })
        .then((centers) => {
          res.status(200);
          let temp_centers = centers.map((val) => JSON.stringify(val));
          console.log(temp_centers);
          let transaction = redisClient.multi();
          for (let i = 0; i < temp_centers.length; i++) {
            transaction.rpush(
              encodedData + "_" + singlePlain + "_" + direction,
              temp_centers[i]
            );
          }
          transaction.expire(
            encodedData + "_" + singlePlain + "_" + direction,
            10 * 60
          );
          transaction.exec((err, reply) => {
            console.log("added-->" + reply);
          });
          res.json({
            error: false,
            data: centers,
            length:centers.length
          });
        });
    } catch (error) {
      res.status(500);
      res.json({ error: true, data: "Internal server error" });
    }
  }
);
router.get(
  "/sortBy/doubleSidedColor",
  VendorCacheMiddleware.sortedByDoubleSidedColorMiddleware,
  (req, res, next) => {
    const city = convertToIgnoreCase(req.query.data.city);
    const encodedData = req.query.encodedData;
    const direction = req.query.direction ? req.query.direction : 1;
    try {
      centerData
        .find({
          "address.city": city,
        })
        .sort({ "price.double_side_color_page": direction })
        .then((centers) => {
          res.status(200);
          let temp_centers = centers.map((val) => JSON.stringify(val));
          let transaction = redisClient.multi();
          for (let i = 0; i < temp_centers.length; i++) {
            transaction.rpush(
              encodedData + "_" + doubleColored + "_" + direction,
              temp_centers[i]
            );
          }
          transaction.expire(
            encodedData + "_" + doubleColored + "_" + direction,
            10 * 60
          );
          transaction.exec((err, reply) => {
            console.log("added-->" + reply);
          });
          res.json({
            error: false,
            data: centers,
            length:centers.length
          });
        });
    } catch (error) {
      res.status(500);
      res.json({ error: true, data: "Internal server error" });
    }
  }
);
router.get(
  "/sortBy/singleSidedColor",
  VendorCacheMiddleware.sortedBySingleSidedColorMiddleware,
  (req, res, next) => {
    const city = convertToIgnoreCase(req.query.data.city);
    const encodedData = req.query.encodedData;
    const direction = req.query.direction ? req.query.direction : 1;
    try {
      centerData
        .find({
          "address.city": city,
        })
        .sort({ "price.one_side_color_page": direction })
        .then((centers) => {
          res.status(200);
          let temp_centers = centers.map((val) => JSON.stringify(val));
          let transaction = redisClient.multi();
          for (let i = 0; i < temp_centers.length; i++) {
            transaction.rpush(
              encodedData + "_" + singleColored + "_" + direction,
              temp_centers[i]
            );
          }
          transaction.expire(
            encodedData + "_" + singleColored + "_" + direction,
            10 * 60
          );
          transaction.exec((err, reply) => {
            console.log("added-->" + reply);
          });
          res.json({
            error: false,
            data: centers,
            length:centers.length
          });
        });
    } catch (error) {
      res.status(500);
      res.json({ error: true, data: "Internal server error" });
    }
  }
);
router.get(
  "/sortBy/doubleSidedPlain",
  VendorCacheMiddleware.sortedByDoubleSidedPlainMiddleware,
  (req, res, next) => {
    const city = convertToIgnoreCase(req.query.data.city);
    const encodedData = req.query.encodedData;
    const direction = req.query.direction ? req.query.direction : 1;
    try {
      centerData
        .find({
          "address.city": city,
        })
        .sort({ "price.double_side_plain_page": direction })
        .then((centers) => {
          res.status(200);
          let temp_centers = centers.map((val) => JSON.stringify(val));
          let transaction = redisClient.multi();
          for (let i = 0; i < temp_centers.length; i++) {
            transaction.rpush(
              encodedData + "_" + doublePlain + "_" + direction,
              temp_centers[i]
            );
          }
          transaction.expire(
            encodedData + "_" + doublePlain + "_" + direction,
            10 * 60
          );
          transaction.exec((err, reply) => {
            console.log("added-->" + reply);
          });
          res.json({
            error: false,
            data: centers,
            length:centers.length
          });
        });
    } catch (error) {
      res.status(500);
      res.json({ error: true, data: "Internal server error" });
    }
  }
);
router.get(
  "/sortBy/location",
  VendorCacheMiddleware.VendorListByLocationMiddleware,
  (req, res, next) => {
    const lat = req.query.data.lat;
    const long = req.query.data.long;
    const city = convertToIgnoreCase(req.query.data.city);
    const encodedData = req.query.encodedData;

    if ((!lat || !long) && city) {
      console.log("without location..");
      try {
        centerData.find({ "address.city": city }).then((centers) => {
          res.status(200);
          let temp_centers = centers.map((val) => JSON.stringify(val));
          let transaction = redisClient.multi();
          for (let i = 0; i < temp_centers.length; i++) {
            transaction.rpush(encodedData, temp_centers[i]);
          }
          transaction.expire(encodedData, 10 * 60);
          transaction.exec((err, reply) => {
            console.log("added-->" + reply);
          });
          res.json({
            error: false,
            data: centers,
            length:centers.length
          });
        });
      } catch (error) {
        res.status(500);
        res.json({ error: true, data: "Internal server error" });
      }
    } else if (lat && long && city) {
      try {
        console.log("with location...");
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
              data: centers,
              length:centers.length
            });
          });
      } catch (error) {
        res.status(500);
        res.json({ error: true, data: "Internal server error" });
      }
    } else {
      res.status(400);
      res.json({ error: true, data: "Please allow location or select city." });
      return;
    }
  }
);
router.get(
  "/vendorNames",
  VendorCacheMiddleware.VendorNameMiddleware,
  (req, res, next) => {
    const city = convertToIgnoreCase(req.query.data.city);
    const encodedData = req.query.encodedData;

    try {
      centerData
        .aggregate([
          { $match: { "address.city": city } },
          { $project: { name: 1, _id: 0 } },
        ])
        .then((vendorNames) => {
          res.status(200);
          let temp_names = vendorNames.map((val) => val.name);
          let transaction = redisClient.multi();
          for (let i = 0; i < temp_names.length; i++) {
            transaction.rpush(encodedData + "_" + "names", temp_names[i]);
          }
          transaction.expire(encodedData + "_" + "names", 10 * 60);
          transaction.exec((err, reply) => {
            console.log("added-->" + reply + " to " + encodedData);
          });
          res.json({
            error: false,
            data: temp_names,
          });
        });
    } catch (exception) {
      res.status(500);
      res.json({ error: true, data: "Internal server error" });
    }
  }
);
router.get("/byName", (req, res, next) => {
  const city = convertToIgnoreCase(req.query.data.city);
  const vendorName = req.query.vendorName;
  try {
    
    centerData
      .find({ "address.city": city, name: vendorName })
      .then((centers) => {
        res.status(200);
        res.json({
          error: false,
          data: centers,
          length:centers.length
        });
      });
  } catch (exception) {
    res.status(500);
    res.json({ error: true, data: "Internal server error" });
  }
});
module.exports = router;
