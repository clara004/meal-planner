const mongoose = require('mongoose');//Getting the library
const userSchema = new mongoose.Schema({
    name : { //Name must be string and not empty
        type: String,
        required: true
    },
    email : { //email must be reqiured and unique no duplicates
        type: String,
        required:true,
        unique:true
    },
    password : {
        type:String,
        required:true
    }
});
module.exports = mongoose.model('User',userSchema);
//Ana 3mlt expor ll model a2dr ast5dmoo bara as a user w a3ml mno objects



