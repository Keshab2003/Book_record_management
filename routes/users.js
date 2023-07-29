const express = require("express");
const { users } = require("../data/users.json");

const router = express.Router();

/**
 * Route :/users
 * Method:GET
 * Description:Get all user
 * Access:public
 * Parameters:None
 */

router.get("/", (req, res) => {
    res.status(200).json({
        success: "true",//a bollean variable 
        body: users //whole of data in users was destructed in users variable which is now stored in body to be shown in postman

    });
    // console.log(`${body}`);
});


/**
 * Route :/users/:id
 * Method:GET
 * Description:Get the asked user
 * Access:public
 * Parameters:id
 */
router.get("/:id", (req, res) => {
    const { id } = req.params;
    const user = users.find((each) => each.id === id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }
    return res.status(200).json({
        success: true,
        data: user,
    });
});

/**
 * Route :/users
 * Method:POST
 * Description:Create a new user
 * Access:public
 * Parameters:none
 */

router.post("/", (req, res) => {
    const { id, name, surname, email, subscriptionType, subscriptionDate } =
        req.body;

    const user = users.find((each) => each.id === id);
    if (user) {
        return res.status(404).json({
            success: false,
            message: "User already exist with this id",
        });
    }
    users.push({
        id, //id:id as key and values name are same
        name,
        surname,
        email,
        subscriptionType,
        subscriptionDate,
    });
    return res.status(200).json({
        success: true,
        data: users,
    });
});

/**
 * Route :/users/:id
 * Method:PUT/PATCH
 * Description:Update a user find using ID
 * Access:public
 * Parameters:id
 */
router.put("/:id", (req, res) => {
    const { id } = req.params; //fetch the id from params or parameters
    const { data } = req.body;//fetch the data variable from body of request

    const user = users.find((each) => each.id === id);

    if (!user) return res.status(404).json({ success: false, message: "user not found" });

    const updatedUser = users.map((each) => {
        if ((each.id) === id) {
            return {
                ...each,
                ...data,
            };

        }
        return each;
    });
    return res.status(200).json({
        success: true,
        data: updatedUser,
    });
});

/**
 * Route :/users/:id
 * Method:Delete
 * Description:Delete a user using ID
 * Access:public
 * Parameters:id
 */
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const user = users.find((each) => each.id === id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "The user does not exist!",
        });
    }
    const index = users.indexOf(user);
    users.splice(index, 1);
    return res.status(200).json({ //this will work if return statement is not written
        success: true,
        message: `the user with ${id} has been deleted `,
        data: users
    });

});

/**
 * Route :/users/subscription-details/:id
 * Method:get
 * Description:Get all user subscription details
 * Access:public
 * Parameters:id
 */


router.get("/subscription-details/:id", (req, res) => {
    const { id } = req.params;
    const user = users.find((each) => each.id === id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "the user does not exist",
        });
    }


    const getDateInDays = (data = "") => {
        let date;
        if (data === "") {
            date = new Date();
        } else {
            //getting date on bacis of data vriable
            date = new Date(data);
        }
        //multiplying with 1000 simplely means that it is done for tackling the milliseconds
        let days = Math.floor(date / 1000 * 60 * 60 * 24);
        return days;
    };

    const subscriptionType = (date) => {
        if (user.subscriptionType === "Basic") {
            date = date + 90;
        }
        else if (user.subscriptionType === "Standard") {
            date = date + 180;
        }
        else if (user.subscriptionType === "Premium") {
            date = date + 365;
        }
        return date;
    };

    let returnDate = getDateInDays(user.returnDate);
    let currentDate = getDateInDays();
    let subscriptionDate = getDateInDays(user.subscriptionDate);
    let subscriptionExpiration = subscriptionType(subscriptionDate);

    const data = {
        ...user,
        subscriptionExpired: subscriptionExpiration < currentDate,
        daysLeftForExpiration:
            subscriptionExpiration <= currentDate
                ? 0
                : subscriptionExpiration - currentDate,

        fine:
            returnDate < currentDate
                ? subscriptionExpiration >= currentDate
                    ? 100
                    : 200
                : 0,
    };
    res.status(200).json({
        success: true,
        data,
    });

});

module.exports = router;//this is important it simply says that it can be imported by any other file.
//this must be written at the end
//this is default 