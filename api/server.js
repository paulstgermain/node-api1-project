// BUILD YOUR SERVER HERE

const express = require('express');

const User = require('./users/model');

const server = express();

server.use(express.json());

// BUILD ENDPOINTS

// GET ALL USERS

server.get('/api/users', (req, res) => {
    User.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json({ message: "The users information could not be retrieved" });
        });
});

// GET USER BY ID

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;

    User.findById(id)
        .then(user => {
            console.log(user)
            if (!user) {
                res.status(404).json({ message: "The user with the specified ID does not exist" })
            } else {
                res.status(200).json(user);
            }
        })
        .catch(err => {
            res.status(404).json({ message: "The user information could not be retrieved" })
        })
});

// POST A NEW USER

server.post('/api/users', (req, res) => {
    const newUser = req.body;

    if (!newUser.name || !newUser.bio) {
        res.status(400).json({ message: "Please provide name and bio for the user" });
    } else {
        User.insert(newUser)
            .then(user => {
                res.status(201).json(user);
            })
            .catch(err => {
                res.status(500).json({ message: "There was an error while saving the user to the database" });
            });
    }

});

// PUT (EDIT) A USER BY ID

server.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const editedUser = req.body;

    if (!editedUser.name || !editedUser.bio) {
        res.status(400).json({ message: "Please provide name and bio for the user" });
    } else {
        User.update(id, editedUser)
            .then(user => {
                if (!user) {
                    res.status(404).json({ message: "The user with the specified ID does not exist" })
                } else {
                    res.status(200).json(user);
                }
            })
            .catch(err => {
                res.status(500).json({ message: "The user information could not be modified" });
            });
    };

});

// DELETE A USER BY ID

server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;

    User.remove(id)
        .then(info => {
            if (!info) {
                res.status(404).json({ message: "The user with the specified ID does not exist" })
            } else {
                res.status(200).json(info);
            }
        })
        .catch(err => {
            res.status(500).json({ message: "The user could not be removed" });
        });
});

// CATCH ALL

server.use('*', (req, res) => {
    res.status(404).json({ message: 'Resource not found on this server.'} );
});

module.exports = server; // EXPORT YOUR SERVER instead of {}
