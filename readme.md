# Node.js + Express.js Auth ด้วย JSON WEB Token (JWT)

# **การ clone เพื่อใช้งาน**

```jsx
git clone https://github.com/srseen/demo-auth-node-express-mongodb.git
```

```jsx
npm install
```

---

# **สิ่งที่ต้องติดตั้ง**

- node
- mongodb

---

# Lib สำคัญในการทำ Auth

- jsonwebtoken
- bcryptjs

---

# **ติดตั้ง Library**

```jsx
npm init -y
```

- คำสั่งที่ใช้สร้างไฟล์ `package.json`  เป็นไฟล์ที่ใช้เก็บข้อมูลเกี่ยวกับโปรเจกต์ Node.js

## 1.Express

```jsx
npm install express
```

- **web framework สำหรับ Node.js** ที่ช่วยให้การพัฒนาเว็บแอปและ API มีเครื่องมือที่ช่วยจัดการ **routing, middleware, request, response** และฟีเจอร์อื่นๆ ที่เกี่ยวข้องกับเซิร์ฟเวอร์ HTTP

## 2.nodemon

```jsx
npm install nodemon
```

- **nodemon** เป็นเครื่องมือที่ช่วยให้ Node.js **รีสตาร์ทเซิร์ฟเวอร์อัตโนมัติ** เมื่อมีการเปลี่ยนแปลงโค้ดในไฟล์ โดยไม่ต้องรันคำสั่ง `node server.js` ใหม่เองทุกครั้ง

> เพิ่มคำสั่ง start ที่ไฟล์ package.json เพื่อง่ายต่อการรันคำสั่งของ nodemon
> 

## 3.jsonwebtoken

```jsx
npm install jsonwebtoken
```

- `jsonwebtoken` (หรือ **JWT**) เป็นไลบรารีที่ใช้สำหรับ **สร้างและตรวจสอบ Token** เพื่อใช้ในการ **ยืนยันตัวตน (Authentication) และกำหนดสิทธิ์ (Authorization)** ในระบบที่ใช้ **Node.js และ Express**

## 4.bcryptjs

```jsx
npm i bcryptjs
```

- `bcryptjs` เป็นไลบรารีสำหรับ **เข้ารหัส (Hash) และตรวจสอบรหัสผ่าน (Password Verification)** ใน **Node.js** โดยใช้ **bcrypt algorithm** ซึ่งช่วยให้ **เก็บรหัสผ่านอย่างปลอดภัย**

### 5.dotenv

```jsx
npm i dotenv
```

- `dotenv` เป็นแพ็กเกจที่ใช้ **โหลดค่าตัวแปรสภาพแวดล้อม (Environment Variables) จากไฟล์ `.env`** เข้าไปใน **`process.env`** ใน Node.js

เปลี่ยน env.example เป็น .env

```
PORT=
MONGODB_URI=
```

### 6.mongoose

```jsx
npm i mongoose
```

- Mongoose เป็น ODM (Object Data Modeling) library สำหรับ MongoDB ที่ใช้ใน Node.js ช่วยให้เราสามารถจัดการ MongoDB database ได้ง่ายขึ้น โดยใช้ Schema และ Model

```jsx
// ไฟล์ config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected!");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

---

# ติดตั้ง Middleware

### 1.morgan

```jsx
npm i morgan
```

- **Morgan** เป็น **middleware สำหรับ logging (บันทึกข้อมูล request)** ใน Express.js ช่วยให้ดูรายละเอียดของ HTTP requests ได้ง่ายขึ้น เช่น **method, URL, status code, response time** เป็นต้น

```jsx
const morgan = require("morgan");

app.use(morgan("dev"));
```

มี code status ที่ terminal

```jsx
GET /api/product 304 2.648 ms - -
```

## 2.body-parser

```jsx
npm i body-parser
```

- `body-parser` เป็น **middleware** ใน Express.js ที่ใช้สำหรับ **แปลงข้อมูลจาก HTTP request body ให้อยู่ในรูปแบบที่ใช้งานได้** เช่น **JSON หรือ URL-encoded data**  
ปัจจุบัน **Express.js เวอร์ชัน 4.16 ขึ้นไปมี body-parser ในตัวแล้ว** ผ่าน `express.json()` และ `express.urlencoded()`

## 3.cors

```jsx
npm i cors
```

**CORS (Cross-Origin Resource Sharing)** เป็นกลไกความปลอดภัยของเว็บเบราว์เซอร์ที่ช่วยให้เซิร์ฟเวอร์กำหนดสิทธิ์ว่าคลายแอปพลิเคชันจาก **โดเมนอื่น (Cross-Origin)** สามารถเข้าถึง API หรือทรัพยากรของเซิร์ฟเวอร์ได้หรือไม่

---

# การสร้าง Schema

```jsx
// file user.model.js
const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: String,
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
```

---

# การสร้าง routes และ controller

```jsx
// file auth.routes.js
const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/auth.controller");

// http://localhost:3000/api/register
router.post("/register", register);
router.post("/login", login);

module.exports = router;
```

```jsx
// file auth.controller.js
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    // 1.Check User
    const { name, password } = req.body;
    var user = await User.findOne({ name });
    if (user) {
      return res.status(400).send("User Already Exists!!!");
    }
    // 2.Encrypt
    const salt = await bcrypt.genSalt(10);
    user = new User({
      name,
      password,
    });
    user.password = await bcrypt.hash(password, salt);
    // 3.Save
    await user.save();
    res.status(200).send("Register Success!!");
  } catch (err) {
    //code
    console.log(err);
    res.status(500).send("Server Error");
  }
};

exports.login = async (req, res) => {
  try {
    //code
    // 1. Check User
    const { name, password } = req.body;
    var user = await User.findOne({ name });
    if (!user) {
      return res.status(400).send("User not found!!!");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send("Password Invalid!!!");
    }
    // 2. Payload
    var payload = {
      user: {
        name: user.name,
      },
    };
    // 3. Generate
    jwt.sign(payload, "jwtsecret", { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token, payload });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
};
```

---

# การสร้าง middleware สำหรับ check token และการใช้งาน middleware

```jsx
file middleware
const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers["authtoken"];
    if (!token) {
      return res.status(401).send("No token");
    }
    // Verify token
    const decoded = jwt.verify(token, "jwtsecret");
    req.user = decoded.user;

    next();
  } catch (err) {
    console.log(err);
    res.send("Token Invalid").status(500);
  }
};
```

## ตัวอย่างการใช้งาน ในระบบ CRUD

```jsx
// file product.routes.js
const express = require("express");
const router = express.Router();
const {
  read,
  readById,
  create,
  update,
  remove,
} = require("../controllers/product.controller");

// import middleware
const { auth } = require("../middleware/auth");

// get all products
router.get("/product", auth, read);

// get product by id
router.get("/product/:id", auth, readById);

// create product
router.post("/product", auth, create);

// update product
router.put("/product/:id", auth, update);

// delete product
router.delete("/product/:id", auth, remove);
module.exports = router;
```

---
