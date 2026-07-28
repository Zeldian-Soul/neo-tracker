// backend/src/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const verifyUrl = `http://localhost:5173/verify/${token}`;
    
    // We added await here to catch configuration errors
    await transporter.sendMail({
        from: '"NEO Tracker Command" <noreply@neotracker.com>',
        to: email,
        subject: "Verify your NEO Tracker Account",
        html: `
            <div style="font-family: sans-serif; background: #0a0a0f; color: #fff; padding: 20px; text-align: center;">
                <h2 style="color: #00f3ff;">Welcome Explorer!</h2>
                <p>You are one step away from joining the NEO Tracker network.</p>
                <a href="${verifyUrl}" style="display: inline-block; padding: 10px 20px; background: #9d4edd; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 15px;">Activate Account</a>
            </div>
        `,
    });
};

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Please provide username, email, and password.' });
        }

        // Check if email is already in the database
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Username or Email is already registered.' });
        }

        // Hash password BEFORE sending it in the temporary token
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create a temporary token valid for 15 minutes holding the user data
        const tempToken = jwt.sign(
            { username, email, password: hashedPassword }, 
            process.env.JWT_SECRET, 
            { expiresIn: '15m' }
        );

        // Try to send the email BEFORE returning success
        try {
            await sendVerificationEmail(email, tempToken);
            res.status(200).json({
                status: 'success',
                message: 'Registration initiated! Please check your email to complete setup.'
            });
        } catch (emailError) {
            console.error("Gmail SMTP Error:", emailError.message);
            return res.status(500).json({ error: 'Failed to send email. Check your .env EMAIL_PASS.' });
        }

    } catch (error) {
        console.error('Registration error:', error.message);
        res.status(500).json({ error: 'Server error during registration.' });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        
        // Decode the temporary token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Ensure user wasn't created by a previous click
        const existingUser = await User.findOne({ email: decoded.email });
        if (existingUser) {
            return res.status(400).json({ error: 'Account already verified. Please log in.' });
        }

        // NOW we permanently save the user to MongoDB
        const newUser = await User.create({
            username: decoded.username,
            email: decoded.email,
            password: decoded.password, // Already hashed
            isVerified: true
        });

        // Generate final login token
        const authToken = jwt.sign({ id: newUser._id, username: newUser.username }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ 
            status: 'success', 
            message: 'Account successfully verified!',
            user: { id: newUser._id, username: newUser.username, email: newUser.email },
            token: authToken
        });
    } catch (error) {
        console.error('Verification error:', error.message);
        res.status(400).json({ error: 'Verification link is invalid or has expired.' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            status: 'success',
            user: { id: user._id, username: user.username, email: user.email },
            token
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error logging in.' });
    }
};

module.exports = { register, login, verifyEmail };