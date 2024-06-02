const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const router = require('./router/router');

const app = express();

// Set up CORS
app.use(cors());

// Configure body-parser to handle larger payloads
app.use(bodyParser.json({ limit: '50gb' }));
app.use(bodyParser.urlencoded({ limit: '50gb', extended: true }));

// Set up Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Use JSON middleware
app.use(express.json());

// Use your router
app.use('/api', router);

// Example upload endpoint using Multer
app.post('/upload', upload.single('file'), (req, res) => {
  res.send('File uploaded successfully');
});

app.listen(3001, () => {
  console.log('server is running')
})