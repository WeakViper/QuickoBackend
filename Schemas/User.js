const { Schema, model, models } = require("mongoose");

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email address"]
    },
    firstName: {
        type: String,
        required: [true, "Full first name is required"],
        minLength: [1, "Full name should be at least 1 character long"],
        maxLength: [30, "First name should be less than 30 characters"]
    },
    lastName: {
        type: String,
        required: [true, "Full last name is required"],
        minLength: [1, "Full name should be at least 1 character long"],
        maxLength: [30, "First name should be less than 30 characters"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        unique: true,
        match: [/^(\+1)?\d{10}$/, "Invalid phone number"]
    },
    addresses: [
        {
            fullName: String,
            phone: String,
            streetAddress: String,
            unit: String,
            city: String,
            state: String,
            postalCode: String
        }
    ],
    orderHistory: [
        {
            orderId: Schema.Types.ObjectId
        }
    ]
});

const User = models.User || model("User", UserSchema);

export default User;
