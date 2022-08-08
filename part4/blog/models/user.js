const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    name: { type: String },
    passwordHash: {type: String},
    blogs: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Blog'
        }
      ],
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        // the passwordHash should not be revealed
        delete returnedObject.passwordHash
    }
})

userSchema.pre("save", async function (next) {
    //encrypt password hash on saving
    if (this.isModified("passwordHash")) {
        this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
    }
    next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPasswordHash) {
    return await bcrypt.compare(candidatePassword, userPasswordHash);
};

const User = mongoose.model('User', userSchema)

module.exports = User