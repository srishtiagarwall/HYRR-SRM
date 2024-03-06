const express = require('express');
const router = express.Router();
const User = require('../model/User');
const Post = require('../model/Post');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'jwtsecretkey';

// Route 1 - Sign up a new user using: POST - '/api/auth/signup'. No login required.
router.post('/signup', [
    body('username', 'Enter a valid username').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be of atleast 5 characters').isLength({ min: 5 })], async (req, res) => {

        // If there are errors, return bad request and error
        const errors = validationResult(req);
        if (!errors.isEmpty) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Check whether user with this email already exists
        try {
            let user = await User.findOne({ email: req.body.email })

            if (user) {
                return res.status(400).json({ error: 'User with this email already exists.' });
            }

            // Generate verification token
            const verificationToken = jwt.sign({ email }, JWT_SECRET);

            // Hashing the password
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);

            // Create a new user
            user = await User.create({
                username: req.body.username,
                email: req.body.email,
                password: secPass,
                verificationToken
            });

            // Save the user to the database
            await user.save();

            // Send verification email
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: req.body.email,
                    pass: secPass
                }
            });

            const mailOptions = {
                from: 'your-email@gmail.com',
                to: email,
                subject: 'Verify Your Email Address',
                html: `<p>Click <a href="http://yourwebsite.com/verify/${verificationToken}">here</a> to verify your email address.</p>`
            };
    
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending verification email:', error);
                } else {
                    console.log('Verification email sent:', info.response);
                }
            });

            // Creating jwt payload
            const data = {
                user: {
                    id: user.id
                }
            }

            // Generating jwt token
            const authToken = jwt.sign(data, JWT_SECRET, { expiresIn: '1h' });

            res.status(200).json({ msg: 'User registered successfully!', authToken });
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    });

// Route 2 - Fetch paginated posts data using: GET - '/api/auth/posts'.
router.get('/posts', fetchuser, async (req, res) => {
    try {
        // Pagnation parameter
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;

        // Fetch posts from database with pagination
        const posts = await Post.find()
            .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
            .skip(startIndex)
            .limit(limit);

        // Return paginated posts data
        res.status(200).json(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;