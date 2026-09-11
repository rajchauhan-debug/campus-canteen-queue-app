require("dotenv").config();

const connectDB = require("./db");
const Menu = require("./models/Menu");


const seedMenu = async () => {

    try {

        // Connect to MongoDB
        await connectDB();


        // Remove existing menu items
        await Menu.deleteMany();


        // Insert menu
        await Menu.insertMany([

            {
                name: "Classic Burger",
                price: 60
            },

            {
                name: "Veg Sandwich",
                price: 40
            },

            {
                name: "Veg Noodles",
                price: 50
            },

            {
                name: "Cold Coffee",
                price: 40
            }

        ]);


        console.log(
            "Menu data inserted successfully"
        );


        process.exit(0);

    } catch (error) {

        console.log(
            "Menu seeding failed"
        );

        console.log(error.message);

        process.exit(1);

    }

};


seedMenu();