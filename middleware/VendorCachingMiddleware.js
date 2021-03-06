const redisClient = require("../redisConf");
const singleColored = "one_side_color_page";
const singlePlain = "one_side_plain_page";
const doubleColored = "double_side_color_page";
const doublePlain = "double_side_plain_page";

// const pageSize = req.query.pageSize ? +req.query.pageSize : 5;
// const pageIndex = req.query.pageIndex ? +req.query.pageIndex : 0;
sortedBySingleSidedPlainMiddleware = (req, res, next) => {
  const encodedData = req.query.encodedData;
  const direction = req.query.direction ? +req.query.direction : 1;
  const searchVal=encodedData + "_" + singlePlain + "_" + direction;
  retriveFromCache(searchVal,next,res);
};
sortedBySingleSidedColorMiddleware = (req, res, next) => {
  const encodedData = req.query.encodedData;
  const direction = req.query.direction ? +req.query.direction : 1;
  const searchVal=encodedData + "_" + singleColored + "_" + direction;
  
  retriveFromCache(searchVal,next,res);
};
sortedByDoubleSidedPlainMiddleware = (req, res, next) => {
  const encodedData = req.query.encodedData;
  const direction = req.query.direction ? +req.query.direction : 1;
  const searchVal=encodedData + "_" + doublePlain + "_" + direction;
  
  retriveFromCache(searchVal,next,res);
};
sortedByDoubleSidedColorMiddleware = (req, res, next) => {
  const encodedData = req.query.encodedData;
  const direction = req.query.direction ? +req.query.direction : 1;
  const searchVal=encodedData + "_" + doubleColored + "_" + direction;
  retriveFromCache(searchVal,next,res);  
};
VendorListByLocationMiddleware = (req, res, next) => {
  const encodedData = req.query.encodedData;
  const searchVal=encodedData;
  retriveFromCache(searchVal,next,res);
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

retriveFromCache=(searchVal,next,res)=>{
  redisClient.exists(searchVal,(error,reply)=>{
    console.log("from cache.."+searchVal+" -->"+reply);
    if(reply==1)
    {
      redisClient.llen(searchVal,(err,length)=>{
          redisClient.lrange(searchVal,0,- 1,(err,data_arr)=>{
              if (err) {
                res.status(500);
                console.log("error....");
                res.json({ error: true, data: "Internal server error" });
                return;
              }
              let data= data_arr.map(val=>{
                return JSON.parse(val);
              });
              res.status(200);
              res.json({ error: false, data: data,length:length, cached: true });
            });
      })
    }
    else{
      next();
    }
  })
}
module.exports = {
  sortedBySingleSidedPlainMiddleware,
  sortedBySingleSidedColorMiddleware,
  sortedByDoubleSidedPlainMiddleware,
  sortedByDoubleSidedColorMiddleware,
  VendorListByLocationMiddleware,
  VendorNameMiddleware,
};
