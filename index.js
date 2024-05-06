const express = require('express');
const cors = require('cors')
const app = express();
const router = require('./router/router')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
app.use(express.json());
app.use(cors())
app.use('/api', router)
app.post('/upload', upload.single('image'), (req, res) => {
    // Do something with the uploaded image
    const file = req.file;
    console.log(file);
    
    res.json({ message: 'Image uploaded successfully',photo:file.path });
  });
app.listen(3001,()=>{
    console.log('server is running')
})