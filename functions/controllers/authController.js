const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET ||
'your-secret-key-change-in-production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
const db = admin.firestore();

// Register new user
exports.register = async (req, res) => {
  try {
    const {username, email, password} = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username, email, and password',
      });
    }

    // Check if user already exists
    const usersRef = db.collection('users');
    const emailQuery = await usersRef.where('email', '==', email).get();
    const usernameQuery = await usersRef.where('username', '==', username)
        .get();

    if (!emailQuery.empty || !usernameQuery.empty) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const userDoc = await usersRef.add({
      username,
      email,
      password: hashedPassword,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Generate token
    const token = jwt.sign({userId: userDoc.id}, JWT_SECRET, {
      expiresIn: JWT_EXPIRE,
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: userDoc.id,
        username,
        email,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error registering user',
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const {email, password} = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user
    const usersRef = db.collection('users');
    const query = await usersRef.where('email', '==', email).get();

    if (query.empty) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const userDoc = query.docs[0];
    const user = userDoc.data();

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = jwt.sign({userId: userDoc.id}, JWT_SECRET, {
      expiresIn: JWT_EXPIRE,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: userDoc.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
    });
  }
};

// Verify token
exports.verify = async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user.userId,
      username: req.user.username,
      email: req.user.email,
    },
  });
};
