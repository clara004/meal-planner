const express = require ('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Making the register 
router.post('/register', async(req,res)=>{
    const {name , email , password}=req.body;
    const hashedPassword = await bcrypt.hash(password,10);//hashing the pass before writting it in the db and 10 is the salt rounds
    const user = new User({name,email,password:hashedPassword});
    await user.save();
    res.json({message:'User Registerd'});
});

//Making the login
router.post('/login' , async(req,res)=>{
    const {email,password}= req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Wrong password');

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token });
});

module.exports = router;
