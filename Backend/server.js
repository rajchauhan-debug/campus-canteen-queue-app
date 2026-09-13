require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const Menu = require("./models/Menu");
const Order = require("./models/Order");

const app = express();

const PORT = process.env.PORT || 3000;


// ================= MIDDLEWARE =================

app.use(cors({
    origin: [
        "http://127.0.0.1:5500",
        "http://campus-canteen-raj-2026.s3-website.ap-south-1.amazonaws.com"
    ]
}));

app.use(express.json());


// ================= DATABASE =================

connectDB();


// ================= HOME ROUTE =================

app.get("/", (req, res) => {

    res.send("Campus Canteen Backend is Running!");

});


// ================= GET MENU =================

app.get("/api/menu", async (req, res) => {

    try {

        const menu = await Menu.find();

        res.json(menu);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to fetch menu"
        });

    }

});


// ================= CREATE ORDER =================

app.post("/api/orders", async (req, res) => {

    try {

        const { items, totalAmount } = req.body;

        if (!items || items.length === 0) {

            return res.status(400).json({
                message: "Order must contain items"
            });

        }

        if (totalAmount === undefined) {

            return res.status(400).json({
                message: "Total amount is required"
            });

        }


        // Temporary queue number
        const queueNumber =
            Math.floor(Math.random() * 50) + 1;


        const order = await Order.create({

            items: items,

            totalAmount: totalAmount,

            queueNumber: queueNumber,

            status: "Waiting"

        });


        res.status(201).json(order);

    } catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Failed to create order"

        });

    }

});


// ================= GET ALL ORDERS =================

app.get("/api/orders", async (req, res) => {

    try {

        const orders = await Order.find()
            .sort({ createdAt: -1 });

        res.json(orders);

    } catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Failed to fetch orders"

        });

    }

});


// ================= GET SINGLE ORDER =================

app.get("/api/orders/:id", async (req, res) => {

    try {

        const order =
            await Order.findById(req.params.id);

        if (!order) {

            return res.status(404).json({

                message: "Order not found"

            });

        }

        res.json(order);

    } catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Failed to fetch order"

        });

    }

});


// ================= UPDATE ORDER STATUS =================

app.put("/api/orders/:id/status", async (req, res) => {

    try {

        const { status } = req.body;


        const allowedStatuses = [
            "Waiting",
            "Preparing",
            "Ready",
            "Completed"
        ];


        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({

                message: "Invalid order status"

            });

        }


        const order =
            await Order.findByIdAndUpdate(

                req.params.id,

                {
                    status: status
                },

                {
                    returnDocument: "after"
                }

            );


        if (!order) {

            return res.status(404).json({

                message: "Order not found"

            });

        }


        res.json(order);

    } catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Failed to update order status"

        });

    }

});


// ================= START SERVER =================

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});