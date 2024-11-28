// var mongoose = require("mongoose");
// var Schema = mongoose.Schema;

// var exerciseSchema = new Schema({
//    name: { 
//       type: String, 
//       required: true, 
//       trim: true, 
//       maxlength: 100 
//    },
//    description: { 
//       type: String, 
//       trim: true, 
//       maxlength: 500 
//    },
//    category: { 
//       type: String, 
//       enum: ['cardio', 'strength', 'flexibility', 'balance'], 
//       required: true 
//    },
//    sets: {
//       type: Number,
//       min: 1,
//       default: 1
//    },
//    reps: {
//       type: Number,
//       min: 1,
//       default: 1
//    },
//    duration: {
//       type: Number, // בדקות
//       min: 1
//    },
//    intensity: {
//       type: String,
//       enum: ['קל', 'בינוני', 'קשה'],
//       default: 'בינוני'
//    },
//    equipment: [{
//       type: String,
//       trim: true
//    }],
//    userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true
//    },
//    id: { 
//       type: Number, 
//       unique: true 
//    }
// }, { timestamps: true });

// module.exports = mongoose.model('exercise', exerciseSchema);