const express =require('express');
const app = express();
app.use(express.json());


app.post('/transactions', (req, res) => {
    console.log('Received request:', req.body);
    res.status(200).json({
      success: true,
      transactionId: '12345',
    });
});

const port = 3001;
app.listen(port, () => {
    console.log(`Mock API server running on http://localhost:${port}`);
});