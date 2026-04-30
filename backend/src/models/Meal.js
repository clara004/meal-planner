const mongoose = require('mongoose');
const mealSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    description : {
        type : String,
    },
    ingredients : [String],
    calories : {
        type : Number
    },
    user : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User',
        required : true
    },
} , {timestamps: true});

module . exports = mongoose.model('Meal',mealSchema);
