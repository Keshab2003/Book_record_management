const express = require("express");
const { books } = require("../data/books.json");
const { users } = require("../data/users.json");

const router = express.Router();

/**
 * Route :/books
 * Method:GET
 * Description:Get all books
 * Access:public
 * Parameters:None
 */
// router.get("/", (req, res) => {
//     res.status(200).json({
//         message: "the route has been successfully created",
//         success: true,
//         body: books
//     });
// });

// /**
//  * Route :/books/search/:id
//  * Method:GET
//  * Description:Get the details of book using id
//  * Access:public
//  * Parameters:id
//  */

router.get("/search/:id", (req, res) => {
    const { id } = req.params;
    const bookss = books.find((each) => each.id === id);
    if (!bookss) {
        return res.status(500).json({
            success: false,
            message: "the searched book does not exits! "
        })
    }
    res.status(200).json({

        success: true,
        data: bookss
    });
});

// /**
//  * Route :/books/issued/books
//  * Method:GET
//  * Description:Get the details of book which is issued
//  * Access:public
//  * Parameters:none
//  */

// //here issued was not able to stabke it self as route as issued in postman took as a paramater for upper function
// //so we need to add some extra routes

router.get("/issued/by_user", (req, res) => {
    const userWithIssuedBook = users.filter((each) => {
        // console.log("hi");
        if (each.issuedBook) return each;
    });

    const issuedBooks = [];

    userWithIssuedBook.forEach((each) => {
        const book = books.find((book) => book.id === each.issuedBook);

        book.issuedBy = each.name;
        book.issuedDate = each.issuedDate;
        book.returnDate = each.returnDate;

        issuedBooks.push(book);

    });
    if (issuedBooks.length === 0) {
        res.status(404).json({
            success: false,
            message: "none of the books has been issued yet"
        });
    }
    return res.status(200).json({
        success: true,
        data: issuedBooks
    })
});

// /**
//  * Route :/books
//  * Method:POST
//  * Description:Get the details of book which is issued
//  * Access:public
//  * Parameters:none
//  */

router.post("/", (req, res) => {
    const { book } = req.body;
    if (!book) {
        return res.status(404).json({
            success: false,
            message: "The body is empty",
        });
    }

    const bookExist = books.find((each) => each.id === book.id);
    if (bookExist) {
        return res.status(500).json({
            success: false,
            message: "The book with this id already exist",
        });
    }

    const allBooks = { ...books, book };
    return res.status(200).json({
        success: true,
        book: allBooks,
    });
});

// /**
//  * Route :/books/:id
//  * Method:PUT
//  * Description:Update the book details
//  * Access:public
//  * Parameters:id
//  */

router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { body } = req.body;

    const book = books.find((each) => each.id === id);
    if (!book) return res.status(404).json({ success: false, message: "The book does not exist", });

    const updatedBook = books.map((each) => {
        if (each.id === id) {
            return { ...each, ...body };
        }
        return each;
    });


    return res.status(200).json({
        success: true,
        body: updatedBook,
    });
});

/**
 * Route :/books/finnedBook
 * Method:GET
 * Description:get the details of the book which is associated with some fines
 * Access:public
 * Parameters:none
 */


router.get("/fine", (req, res) => {
    const userWithFine = users.filter((each) => {
        if (each.fine) {
            return each;
        }
    });
    // console.log("hio");
    const finnedBook = [];
    // console.log("hio");
    userWithFine.forEach((each) => {
        // console.log(` ${each} `);
        const book = books.find((book) => book.id === each.issuedBook);
        book.fineed = each.fine;
        finnedBook.push(book);
    });

    // if (finnedBook.length === 0) {
    //     return res.status(404).json({
    //         success: false,
    //         message: "There is no user with fine!",
    //     });
    // }
    return res.status(200).json({
        success: true,
        message: "successfully done!",
        data: finnedBook,
    });
});

module.exports = router;