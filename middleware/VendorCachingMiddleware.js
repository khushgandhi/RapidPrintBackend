const redisClient = require("../redisConf");
const singleColored = "one_side_color_page";
const singlePlain = "one_side_plain_page";
const doubleColored = "double_side_color_page";
const doublePlain = "double_side_plain_page";
sortedBySingleSidedPlainMiddleware = (req, res, next) => {
  const city = req.city;
  const encodedData = req.query.encodedData;
  const pageSize = req.query.pageSize ? +req.query.pageSize : 5;
  const pageIndex = req.query.pageIndex ? +req.query.pageIndex : 0;
  const direction = req.query.direction ? +req.query.direction : 1;
  const searchVal=encodedData + "_" + singlePlain + "_" + direction;
  redisClient.exists(
    encodedData + "_" + singlePlain + "_" + direction,
    (err, reply) => {
      if (reply == 1) {
        redisClient.llen(searchVal,(err,length)=>{
          redisClient.lrange(
            searchVal,
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
                res.json({ error: false, data: temp_centers, length:length,cached: true }); 
            }
          );

        })
        
        return;
      }
      next();
    }
  );
};
sortedBySingleSidedColorMiddleware = (req, res, next) => {
  const city = req.city;
  const encodedData = req.query.encodedData;
  const pageSize = req.query.pageSize ? +req.query.pageSize : 5;
  const pageIndex = req.query.pageIndex ? +req.query.pageIndex : 0;
  const direction = req.query.direction ? +req.query.direction : 1;
  const searchVal=encodedData + "_" + singleColored + "_" + direction;
  redisClient.exists(
    searchVal,
    (err, reply) => {
      if (reply == 1) {
        redisClient.llen(searchVal,(err,length)=>{
          redisClient.lrange(
            searchVal,
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
                res.json({ error: false, data: temp_centers, length:length,cached: true });
             
            }
          );
        })
        
        return;
      }
      next();
    }
  );
};
sortedByDoubleSidedPlainMiddleware = (req, res, next) => {
  const city = req.city;
  const encodedData = req.query.encodedData;
  const pageSize = req.query.pageSize ? +req.query.pageSize : 5;
  const pageIndex = req.query.pageIndex ? +req.query.pageIndex : 0;
  const direction = req.query.direction ? +req.query.direction : 1;
  const searchVal=encodedData + "_" + doublePlain + "_" + direction;
  redisClient.exists(
    searchVal,
    (err, reply) => {
      if (reply == 1) {
        redisClient.llen(searchVal,(err,length)=>{
          redisClient.lrange(
            searchVal,
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
                res.json({ error: false, data: temp_centers, length:length,cached: true });
              
            }
          );
        })
     
        return;
      }
      next();
    }
  );
};
sortedByDoubleSidedColorMiddleware = (req, res, next) => {
  const city = req.city;
  const encodedData = req.query.encodedData;
  const pageSize = req.query.pageSize ? +req.query.pageSize : 5;
  const pageIndex = req.query.pageIndex ? +req.query.pageIndex : 0;
  const direction = req.query.direction ? +req.query.direction : 1;
  const searchVal=encodedData + "_" + doubleColored + "_" + direction;
  redisClient.exists(
    searchVal,
    (err, reply) => {
      if (reply == 1) {
        redisClient.llen(searchVal,(err,length)=>{
          redisClient.lrange(
            searchVal,
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
                res.json({ error: false, data: temp_centers, length:length,cached: true });
              
            }
          );
        })
        return;
      }
      next();
    }
  );
};
VendorListByLocationMiddleware = (req, res, next) => {
  const lat = req.query.data.lat;
  const long = req.query.data.long;
  const city = req.query.data.city;
  const encodedData = req.query.encodedData;
  const pageSize = req.query.pageSize ? +req.query.pageSize : 5;
  const pageIndex = req.query.pageIndex ? +req.query.pageIndex : 0;
  const searchVal=encodedData;
  redisClient.exists(searchVal, (err, reply) => {
    if (reply == 1) {
      redisClient.llen(searchVal,(err,length)=>{
        redisClient.lrange(
          searchVal,
          pageSize * pageIndex,
          (pageIndex + 1) * pageSize - 1,
          (err, centers) => {
            if (err) {
              res.status(500);
              console.log("error....");
              res.json({ error: true, data: "Internal server error" });
              return;
            }
            let temp_centers = centers.map((val) => {
              return JSON.parse(val);
            });
            
              res.status(200);
              res.json({ error: false, data: temp_centers, length:length,cached: true });  
          }
        );
      })
      return;
    }

    next();
  });
};
VendorNameMiddleware = (req, res, next) => {
  const encodedData = req.query.encodedData;
  redisClient.exists(encodedData + "_" + "names", (err, reply) => {
    if (reply == 1) {
      redisClient.lrange(
        encodedData + "_" + "names",
        0,
        -1,
        (err, vendorNames) => {
          if (err) {
            res.status(500);
            console.log("error....");
            res.json({ error: true, data: "Internal server error" });
            return;
          }
          res.status(200);
          res.json({ error: false, data: vendorNames, cached: true });
        }
      );
      return;
    }
    next();
  });
};
module.exports = {
  sortedBySingleSidedPlainMiddleware,
  sortedBySingleSidedColorMiddleware,
  sortedByDoubleSidedPlainMiddleware,
  sortedByDoubleSidedColorMiddleware,
  VendorListByLocationMiddleware,
  VendorNameMiddleware,
};
