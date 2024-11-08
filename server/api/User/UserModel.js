var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
   name: { 
     type: String,
     required: true,
     trim: true,
     maxlength: 100 },

   email: { 
      type: String, 
      required: true, 
      unique: true, 
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
   },

   age: { type: Number, min: 0 },

   id: { type: Number, unique: true },

   join: { type: Date, default: Date.now },

   password: { 
    type: String, 
    required: true, 
    minlength: 8, 
    select: false }

}, 

    { timestamps: true });

module.exports = mongoose.model('user', userSchema)