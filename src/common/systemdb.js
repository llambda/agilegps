'use strict';

/* Copyright (c) 2016 Grant Miner */
"use strict";
const options = require("../../config/database.js");
const db = require("rethinkdbdash")({
  ...options,
  db: 'rethinkdb',
});
module.exports.db = db;

// require("rethink-handle-uncaught")(r, {
//   filter: function(errorOrException) {
//     if (errorOrException.msg === "Malicious Path") {
//       return false;
//     }
//     return true;
//   }
// });
