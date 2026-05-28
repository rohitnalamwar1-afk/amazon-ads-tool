const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const JWT_SECRET = process.env.JWT_SECRET || 'adflow-secret-key-change-in-production';

// Register new user
async function register(email, password, fullName, companyName, role = 'brand') {
  const passwordHash = await bcrypt.hash(password, 10);
  
  const { data, error } = await supabase
    .from('users')
    .insert([{
      email,
      password_hash: passwordHash,
      full_name: fullName,
      company_name: companyName,
      role
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Login user
async function login(email, password) {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) throw new Error('Invalid email or password');

  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) throw new Error('Invalid email or password');

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Update last login
  await supabase
    .from('users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', user.id);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      companyName: user.company_name,
      role: user.role
    }
  };
}

// Verify token
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

// Middleware to protect routes
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
}

// Admin only middleware
function adminMiddleware(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin access required' });
  }
  next();
}

module.exports = { register, login, verifyToken, authMiddleware, adminMiddleware, supabase };