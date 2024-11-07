var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var Schema = mongoose.Schema;

var registerSchema = new Schema({
   name: { type: String, required: true, trim: true, maxlength: 100 },
   email: { 
      type: String, 
      required: true, 
      unique: true, 
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
   },
   password: { 
      type: String, 
      required: true, 
      minlength: 8, 
      select: false // מונע הצגת הסיסמה בשאילתות אוטומטיות
   },
   join: { type: Date, default: Date.now }
}, { timestamps: true });

// הגדרת פונקציה להצפנת הסיסמה לפני שמירת המשתמש
registerSchema.pre("save", function(next) {
   if (!this.isModified("password")) return next();
   
   bcrypt.hash(this.password, 10, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
      next();
   });
});

// פונקציה להשוואת סיסמה
registerSchema.methods.comparePassword = function(candidatePassword, callback) {
   bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return callback(err);
      callback(null, isMatch);
   });
};

module.exports = mongoose.model('User', registerSchema);