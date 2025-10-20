import express from 'express';
const router = express.Router();

router.get('/api/messages/send', (req, res)=>{
    res.send ('Sent the message');
})

export default router;