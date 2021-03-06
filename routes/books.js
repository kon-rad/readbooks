const express = require('express');
const router = express.Router();
const Book = require('../models/book.js');
const { checkPostOwnership, isLoggedIn } = require('../services/middleWare');

/**
 * Gets all posts
 */
router.get('/', function(req, res) {
  Book.find({}, function(err, books) {
    if (err) {
      console.log(err);
    } else {
      res.render('index', { books: books });
    }
  });
});

/**
 * Gets all book posts made by a user
 */
router.get('/user/:id', (req, res) => {
  if (!req.params.id) {
    res.send('error - user id missing');
  }

  Book.find(
    {
      'postedBy.id': req.params.id
    },
    function(err, books) {
      if (err) {
        console.log(err);
      } else {
        res.send(books);
      }
    }
  );
});

/**
 * Creates new book and assigns book id to user
 */
router.post('/', isLoggedIn, function(req, res) {
  const email = req.user.local.email
    ? req.user.local.email
    : req.user.facebook.name;

  const {
    formattedPubDate,
    thumbnail,
    title,
    authorsJoined,
    description,
    thoughts
  } = req.body;

  const {
    _id,
    username,
    avatar
  } = req.user;

  const newBook = {
    thumbnail: thumbnail,
    title: title,
    author: authorsJoined,
    publishedDate: formattedPubDate,
    description: description,
    thoughts: thoughts,
    postedBy: {
      id: _id,
      username,
      email,
      avatar
    }
  };

  Book.create(newBook, function(err) {
    if (err) {
      console.log(err);
    } else {
      res.send({ newBook });
    }
  });
});

/**
 * Shows individual book by :id
 */
router.get('/:id', function(req, res) {
  Book.findById(req.params.id)
    .populate('comments')
    .exec(function(err, book) {
      if (err) {
        console.log(err);
      } else {
        const d = book._id.getTimestamp();
        book.postDate
          = (d.getMonth()+1) + '/' + d.getDate()
          + '/' + d.getFullYear();
        book.authorLabel
          = book.author && book.author.split(',')
          && book.author.split(',').length > 1 ? 'Authors' : 'Author';

        res.render('posts/show', { book: book });
      }
    });
});

/**
 * Edits individual book by :id
 */
router.get('/:id/edit', checkPostOwnership, function(req, res) {
  Book.findById(req.params.id, function(err, foundBook) {
    if (err) {
      console.log(err);
    } else {
      res.render('posts/edit', { book: foundBook });
    }
  });
});

/**
 * Shows individual book by :id
 */
router.put('/:id', checkPostOwnership, function(req, res) {
  Book.findByIdAndUpdate(req.params.id, req.body.book, function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/posts/' + req.params.id);
    }
  });
});

/**
 * Deletes individual book by :id
 */
router.delete('/:id', checkPostOwnership, function(req, res) {
  Book.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/posts');
    }
  });
});

module.exports = router;
