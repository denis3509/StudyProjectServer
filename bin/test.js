const mongoose = require('mongoose');
const User = mongoose.model('Dashboard');
const ObjectId= mongoose.Types.ObjectId;
const async= require('async');
const Dashboard = mongoose.model("Dashboard");


// console.log("test is running");

// const dashboard_id = new ObjectId("5cceba9d9e74212880387bfb");
// const column_id = new ObjectId("5ccebca2e3b4740918591cdf");
// const card_id = new ObjectId("5ccec99095e30d0c5ca40634");
//
//
// async.series([
//   function (callback) {
//     Dashboard.updateCardInColumn(dashboard_id, column_id,card_id ,
//       {content: "new content", cardName : "newName"}, callback)
//   },
//
// ], (error, results)=>{
//   if (error) {
//     throw error;
//   }
//   console.log(results);
// });