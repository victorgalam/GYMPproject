var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
   username: { 
     type: String,
     required: false,
     trim: true,
     maxlength: 100 },

   email: { 
      type: String, 
      required: true, 
      unique: true, 
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
   },

   age: { type: Number, min: 0 },


   join: { type: Date, default: Date.now },

   password: { 
    type: String, 
    required: true, 
    minlength: 8, 
    select: false }

}, 

    { timestamps: true });

module.exports = mongoose.model('user', userSchema)