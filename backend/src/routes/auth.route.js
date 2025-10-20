import express from "express";

const router = express.Router();

router.get('/signup', (req, res) => {
    res.send('Sigunp endpoint')
})

router.get('/login', (req, res) => {
res.send('Signin endpoint')
})

router.get('/logout', (req, res) => {
res.send('Signout endpoint')
})

export default router;