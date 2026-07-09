

const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const { createProxyMiddleware } = require("http-proxy-middleware");
require('dotenv').config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// frontend 

app.use(cors({
     origin:"http://localhost:5173",
     credentials:true
}));

// static file
app.use(
    "/uploads",
    createProxyMiddleware({
        target: process.env.VENUE_SERVICE,
        changeOrigin: true,
        pathRewrite: (path) => "/uploads" + path,
    })
);

// Auth service

 app.use(
  "/api/auth",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE,
    changeOrigin: true,
    pathRewrite: {
      "^/api/auth": "",
    },
  })
);



// User service


app.use(
  "/api/users",
  createProxyMiddleware({
    target: process.env.USER_SERVICE,
    changeOrigin: true,
    pathRewrite: {
      "^/api/users": "",
    },
  })
);

// venue service

app.use(
  "/api/venues",
  createProxyMiddleware({
    target: process.env.VENUE_SERVICE,
    changeOrigin: true,
    pathRewrite: {
      "^/api/venues": "",
    },
  })
);

// Booking services 

app.use(
  "/api/bookings",
  createProxyMiddleware({
    target: process.env.BOOKING_SERVICE,
    changeOrigin: true,
    pathRewrite: {
      "^/api/bookings": "",
    },
  })
);


// Review services

app.use(
  "/api/reviews",
  createProxyMiddleware({
    target: process.env.REVIEW_SERVICE,
    changeOrigin: true,
    pathRewrite: {
      "^/api/reviews": "",
    },
  })
);

// HEALTH CHECK

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Gateway running successfully",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT}`);
});


