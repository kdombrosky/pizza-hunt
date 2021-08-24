const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const PizzaSchema = new Schema(
    {
        pizzaName: {
            type: String
        },
        createdBy: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now,
            // (GETTERS) to return formated date from imported func. 
            get: (createdAtVal) => dateFormat(createdAtVal)
        },
        size: {
            type: String,
            default: 'Large'
        },
        toppings: [],
        comments: [
            {
                type: Schema.Types.ObjectID,
                ref: 'Comment'
            }
        ]
    },
    {
        toJSON: {
            // (VIRTUALS) tell the schema that it can use virtuals 
            virtuals: true,
            // (GETTERS) tell Mongoose model to use any getter function we specified
            getters: true
        },
        id: false
    }
);

// (VIRTUALS) get total count of comments and replies on retrieval 
PizzaSchema.virtual('commentCount').get(function() {
    // .reduce() method to tally up total of every comment and its replies
    return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;