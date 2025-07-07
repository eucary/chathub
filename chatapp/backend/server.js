require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
// Update these with your MySQL credentials
const db = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'eucarydupagan21',
  database: 'chat'
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Example route: Register user
app.post('/api/register', (req, res) => {
   console.log('Register endpoint hit:', req.body);
  const { email, password, contact, displayname } = req.body;
  db.query(
    'INSERT INTO users (email, password, contact, displayname) VALUES (?, ?, ?, ?)',
    [email, password, contact, displayname],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: err });
      }
      res.json({ success: true });
    }
  );
});

// Example route: Login user
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.query(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length > 0) {
        res.json({ success: true, user: results[0] });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    }
  );
  
});
app.post('/api/user/update-displayname', (req, res) => {
  const { email, displayname } = req.body;
  if (!email || !displayname) {
    return res.status(400).json({ error: 'Email and displayname are required' });
  }
  db.query(
    'UPDATE users SET displayname = ? WHERE email = ?',
    [displayname, email],
    (err, result) => {
      if (err) {
        console.error('MySQL error:', err);
        return res.status(500).json({ error: err });
      }
      res.json({ success: true });
    }
  );
});
app.post('/api/user/update-email-contact', (req, res) => {
  const { oldEmail, newEmail, contact } = req.body;
  db.query(
    'UPDATE users SET email = ?, contact = ? WHERE email = ?',
    [newEmail, contact, oldEmail],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ success: true });
    }
  );
});
app.post('/api/user/update-password', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  db.query(
    'UPDATE users SET password = ? WHERE email = ?',
    [password, email],
    (err, result) => {
      if (err) {
        console.error('MySQL error:', err);
        return res.status(500).json({ error: err });
      }
      res.json({ success: true });
    }
  );
});
app.get('/api/user', (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  db.query(
    'SELECT displayname, profile_url, contact FROM users WHERE email = ?',
    [email],
    (err, results) => {
      if (err) {
        console.error('MySQL error:', err);
        return res.status(500).json({ error: err });
      }
      if (results.length > 0) {
        res.json({
          displayname: results[0].displayname,
          profile_url: results[0].profile_url,
          contact: results[0].contact// <-- add this
        });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    }
  );
});
app.post('/api/user/upload-profile-picture', upload.single('profilePic'), (req, res) => {
  console.log('File:', req.file);
  console.log('Body:', req.body);
  const email = req.body.email;
  const profileUrl = req.file ? `/uploads/${req.file.filename}` : null;
  if (!email || !profileUrl) {
    return res.status(400).json({ error: 'Email and profile picture are required' });
  }
  db.query(
    'UPDATE users SET profile_url = ? WHERE email = ?',
    [profileUrl, email],
    (err, result) => {
      if (err) {
        console.error('MySQL error:', err);
        return res.status(500).json({ error: err });
      }
      res.json({ success: true, profile_url: profileUrl });
    }
  );
});
app.listen(3001, () => console.log('Server running on port 3001'));


app.post('/api/messages', (req, res) => {
  let { sender, recipient, text, timestamp } = req.body;
  console.log('POST /api/messages', req.body);

  if (!sender || !recipient || !text) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  // Convert ISO string to MySQL DATETIME format if timestamp is provided
  if (timestamp) {
    const date = new Date(timestamp);
    // Pad helper
    const pad = (n) => n < 10 ? '0' + n : n;
    timestamp = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  } else {
    timestamp = null;
  }

  db.query(
    'INSERT INTO messages (sender, recipient, text, timestamp) VALUES (?, ?, ?, ?)',
    [sender, recipient, text, timestamp],
    (err, result) => {
      if (err) {
        console.error('MySQL error:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, id: result.insertId });
    }
  );
});

app.get('/api/users/search', (req, res) => {
  const { q } = req.query;
  db.query(
    'SELECT email, displayname FROM users WHERE displayname LIKE ?',
    [`%${q}%`],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
});

app.get('/api/messages/conversation', (req, res) => {
  const { user1, user2 } = req.query;
  db.query(
    `SELECT * FROM messages WHERE 
      (sender = ? AND recipient = ?) OR 
      (sender = ? AND recipient = ?)
      ORDER BY timestamp ASC`,
    [user1, user2, user2, user1],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
});

app.get('/api/chats', (req, res) => {
  const { user } = req.query;
  if (!user) return res.status(400).json({ error: 'Missing user param' });

  db.query(
    `
    SELECT 
      u.email,
      u.displayname,
      u.profile_url,
      m.last_message_time
    FROM (
      SELECT 
        CASE 
          WHEN sender = ? THEN recipient 
          ELSE sender 
        END AS chat_partner,
        MAX(timestamp) AS last_message_time
      FROM messages
      WHERE sender = ? OR recipient = ?
      GROUP BY chat_partner
    ) m
    JOIN users u ON u.email = m.chat_partner
    ORDER BY m.last_message_time DESC
    `,
    [user, user, user],
    (err, results) => {
      if (err) {
        console.error('Error fetching chats:', err);
        return res.status(500).json({ error: err });
      }
      res.json(results);
    }
  );
});



app.post('/api/chatai', async (req, res) => {
  const { messages } = req.body;

  try {
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer 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`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'deepseek/deepseek-r1-0528:free',
    messages: messages,
  }),
});

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      console.error('Invalid AI response:', data);
      return res.status(500).json({ error: 'Invalid AI response' });
    }

    res.json({ reply: data.choices[0].message });

  } catch (err) {
    console.error('AI fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch AI response' });
  }
});

app.post('/api/ai-messages', (req, res) => {
  const { user_email, role, content } = req.body;

  if (!user_email || !role || !content) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  db.query(
    'INSERT INTO ai_messages (user_email, role, content) VALUES (?, ?, ?)',
    [user_email, role, content],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});
app.get('/api/ai-messages', (req, res) => {
  const { user_email } = req.query;
  if (!user_email) return res.status(400).json({ error: 'User email required' });

  db.query(
    'SELECT role, content FROM ai_messages WHERE user_email = ? ORDER BY timestamp ASC',
    [user_email],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});