var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var exerciseSchema = new Schema({
   name: { 
      type: String, 
      required: true, 
      trim: true, 
      maxlength: 100 
   },
   description: { 
      type: String, 
      trim: true, 
      maxlength: 500 
   },
   category: { 
      type: String, 
      enum: ['cardio', 'strength', 'flexibility', 'balance'], // רק ערכים מסוימים
      required: true 
   },
   id: { 
      type: Number, 
      unique: true 
   }
}, { timestamps: true }); // הוספת createdAt ו-updatedAt

module.exports = mongoose.model('exercise', exerciseSchema);