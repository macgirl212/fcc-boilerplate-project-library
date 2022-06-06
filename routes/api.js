/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
	title: { type: String, required: true },
	comments: { type: [String], default: [] },
	commentcount: { type: Number, default: 0 },
});

const Book = mongoose.model('Book', bookSchema);

('use strict');

module.exports = function (app) {
	app
		.route('/api/books')
		.get(function (req, res) {
			// find book
			Book.find({}, (err, books) => {
				if (err) {
					console.error(err);
				}
				//response will be array of book objects
				//json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
				res.status(200).json(books);
			});
		})

		.post(function (req, res) {
			let title = req.body.title;

			// check if there is a book title
			if (!title) {
				return res.send('missing required field title');
			}

			// create book
			Book.create(
				{
					title: title,
				},
				(err, book) => {
					if (err) {
						console.error(err);
					}
					//response will contain new book object including atleast _id and title
					res.status(201).json({ _id: book._id, title: book.title });
				}
			);
		})

		.delete(function (req, res) {
			//if successful response will be 'complete delete successful'
			Book.deleteMany({}, (err, book) => {
				if (err) {
					console.error(err);
				}
				return res.send('complete delete successful');
			});
		});

	app
		.route('/api/books/:id')
		.get(function (req, res) {
			let bookid = req.params.id;

			// find specific book
			Book.findById(bookid, (err, book) => {
				if (err) {
					console.error(err);
				}
				if (!book) {
					return res.send('no book exists');
				}
				//json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
				res.status(200).send(book);
			});
		})

		.post(async function (req, res) {
			let bookid = req.params.id;
			let comment = req.body.comment;

			if (!comment) {
				return res.send('missing required field comment');
			}

			// find and update specific book
			const book = await Book.findById(bookid);
			if (!book) {
				return res.send('no book exists');
			}
			book.comments.push(comment);
			book.commentcount++;

			await book.save();
			//json res format same as .get
			return res.send(book);
		})

		.delete(function (req, res) {
			let bookid = req.params.id;

			// find and delete specific book
			Book.findByIdAndDelete(bookid, (err, book) => {
				if (err) {
					console.log(err);
				}
				if (!book) {
					return res.send('no book exists');
				}
				return res.send('delete successful');
			});
			//if successful response will be 'delete successful'
		});
};
