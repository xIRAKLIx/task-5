const express = require('express');
const router = express.Router();
const fs = require('fs');

const BLOGS_FILE = 'blogs.json';

const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        console.log('No user found.');
        res.redirect('/login');
    }
};

router.get('/', requireAuth, function (req, res, next) {
    const blogs = JSON.parse(fs.readFileSync(BLOGS_FILE));
    const email = req.session.user.email;
    res.render('blogs', { blogs, email });
});

router.get('/new', requireAuth, function (req, res, next) {
    const email = req.session.user.email;
    res.render('new_blog', { error: null, email });
});

router.post('/new', requireAuth, function (req, res, next) {
    const { title, content } = req.body;
    const email = req.session.user.email;

    if (!title || !content) {
        return res.render('new_blog', {
            error: 'Missing title or content',
            email
        });
    }

    const blogs = JSON.parse(fs.readFileSync(BLOGS_FILE));
    const newBlog = {
        id: String(Date.now()),
        title,
        content,
        author: email,
        date: new Date().toLocaleString()
    };

    blogs.push(newBlog);
    fs.writeFileSync(BLOGS_FILE, JSON.stringify(blogs, null, 2));
    res.redirect('/blogs');
});

module.exports = router;