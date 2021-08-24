const { Comment, Pizza } = require('../models');

const commentController = {
    // add comment to pizza
    addComment({ params, body }, res) {
        console.log(body);
        Comment.create(body)
        .then(({ _id }) => {
            // return Pizza Promise so we can do something with the results
            return Pizza.findOneAndUpdate(
                { _id: params.pizzaId },
                // push comment's id to comments array
                { $push: { comments: _id } },
                // to receive back the updated pizza with new comment
                { new: true }
            );
        })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    },

    // add reply to comment
    addReply({ params, body }, res) {
        Comment.findOneAndUpdate(
            { _id: params.commentId },
            // Mongo $push method to push reply into replies property of Comment
            { $push: { replies: body } },
            { new: true }
        )
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    },

    // remove comment
    removeComment({ params }, res) {
        Comment.findOneAndDelete({ _id: params.commentId })
        .then(deletedComment => {
            if (!deletedComment) {
                return res.status(404).json({ message: 'No comment with this id!' });
            }
            // return Pizza Promise so we can do something with the results
            return Pizza.findOneAndUpdate(
                { _id: params.pizzaId },
                // Mongo $pull method to remove comment from associated array
                { $pull: { comments: params.commentId } },
                { new: true }
            );
        })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    },

    // remove reply
    removeReply({ params }, res) {
        Comment.findOneAndUpdate(
            { _id: params.commentId },
            // MongoDB $pull operator to remove specific reply from replies array
            { $pull: { replies: { replyId: params.replyId } } },
            { new: true }
        )
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => res.json(err));
    }
};

module.exports = commentController;