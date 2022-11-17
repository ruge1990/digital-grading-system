const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    forename: {type: String, required: true},
    surname: {type: String, required: true},
    role: {type: String, immutable: true, required: true}
});

module.exports = mongoose.model("User", UserSchema);