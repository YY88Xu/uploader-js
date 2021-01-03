const express = require("express");
const multer = require('multer');
const fs = require('fs');
const createFolder = function(folder){
  try{
    fs.accessSync(folder);
  }catch(e){
    fs.mkdirSync(folder);
  }
};
const uploadFolder = 'C:/upload/';

createFolder(uploadFolder);

const app = express();
// 设置跨域访问
app.all("*", function(request, response, next) {
  response.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500"); // 设置跨域的域名，* 代表允许任意域名跨域
  response.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
  response.header(
    "Access-Control-Allow-Methods",
    "PUT,POST,GET,DELETE,OPTIONS"
  );
  response.header("Content-Type", "application/json;charset=utf-8");
  next();
});


const fileFilter = function (req, file, cb) {
  const acceptableMime = ["image/jpeg", "image/png", "image/jpg", "image/gif", "application/zip", "application/x-zip-compressed"];
  // 限制类型
  // null是固定写法
  if (acceptableMime.indexOf(file.mimetype) !== -1) {
    cb(null, true); // 通过上传
  } else {
    cb(null, false); // 禁止上传
    cb(new Error('文件类型错误'));
  }
}

// const path = require("path");
const storage = multer.diskStorage({
  //设置 上传图片服务器位置
  //destination: path.resolve(__dirname, "./upload"),
  destination: function(req, file, cb){
    cb(null, uploadFolder)
  },
  //设置 上传文件保存的文件名
  filename: function (req, file, cb) {
    // 获取后缀扩展
    let extName = file.originalname.slice(file.originalname.lastIndexOf("."));  //.jpg
    // 获取名称
    let fileName = Date.now();
    console.log(fileName + extName); //12423543465.jpg
    cb(null, fileName + extName);
  },
});

const limits = {
  fileSize: 1024*1024
}

const imageUploader = multer({
  storage,
  fileFilter,
  limits
}).single("file"); //文件上传预定 name 或者 字段

app.post("/upload", (req, res) => {
  imageUploader(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // 发生错误
      console.log("MulterError");
      if(err.code === "LIMIT_FILE_SIZE"){
        res.send("File too large");
        return;
      }
    } else if (err) {
      // 发生错误
      console.log("err");
      res.send("文件类型错误");
      return;
    }

    // 一切都好
    res.send("上传成功");
  })

});


app.listen(8081, ()=>{
  console.log("服务器启动成功！")
});