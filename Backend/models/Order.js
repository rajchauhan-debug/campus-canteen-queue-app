const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    items: [
        {
            name: {
                type: String,
                required: true
            },

            price: {
                type: Number,
                required: true
            }
        }
    ],

    totalAmount: {
        type: Number,
        required: true
    },

    queueNumber: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: [
            "Waiting",
            "Preparing",
            "Ready",
            "Completed"
        ],
        default: "Waiting"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});


module.exports =
    mongoose.model("Order", orderSchema);