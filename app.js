var express = require('express');
var app = express();
app.use(express.json())
var CurrentUser = require('./UserModel');
var mongoose = require('mongoose');
const strConnect = "mongodb+srv://victorgalam2000:Victor22@projectgym.dgofc.mongodb.net/?retryWrites=true&w=majority&appName=projectGYM";
const OPT = { useNewUrlParser: true };

app.post('/api/v1/Users', function (req, res, next) {
    let p1 = req.body;
    console.log(req.body)
    var newItem = new CurrentUser(p1);
    newItem.save().then(item => {
        res.json({ item: item })
    }).catch(err => {
        console.log("error 😱:" + err)
    });
});

mongoose.connect(strConnect, OPT);
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Running on port " + port);
})

app.post('/api/v1/Users', async function (req, res, next) {
    try {
        let p1 = req.body;
        var newItem = await CurrentUser.create(p1);
        res.status(201).json({
            status: "success",
            data: newItem
        })
    }
    catch (err) {
        res.status(400).json({
            status: "fail",
            message: "error:😱" + err
        })
    }
});

app.get('/api/v1/Users', function (req, res, next) {
    CurrentUser.find({}).then(function (data) {
        res.status(200).json({
            status: "success",
            data: data
        })
    }).catch(err => {
        res.status(404).json({
            status: "fail",
            message: "error:😱" + err
        })
    })
})

app.get('/api/v1/Users/:id', function (req, res, next) {
    let id = req.params.id
    CurrentUser.find({ id: id }).then(function (data) {
        res.status(200).json({
            status: "success",
            data: data
        })
    }).catch(err => {
        res.status(404).json({
            status: "fail",
            message: "error:😱" + err
        })
    })
})

app.patch('/api/v1/Users/:id', function (req, res, next) {
    let id = req.params.id;

    CurrentUser.findOneAndUpdate({ id: id }, req.body, { new: true, runValidators: true })
        .then(function (data) {
            if (!data) {
                return res.status(404).json({
                    status: "fail",
                    message: "User not found"
                });
            }
            res.status(200).json({
                status: "success",
                data: data
            });
        })
        .catch(err => {
            res.status(400).json({
                status: "fail",
                message: "error:😱 " + err.message
            });
        });
});

app.delete('/api/v1/Users/:id', function (req, res, next) {
    let userId = req.params.id;

    // חיפוש ומחיקה של המשתמש לפי השדה id
    CurrentUser.findOneAndDelete({ id: userId })
        .then(function (data) {
            if (!data) {
                return res.status(404).json({
                    status: "fail",
                    message: "User not found"
                });
            }
            res.status(204).json({
                status: "success",
                message: "User deleted successfully"
            });
        })
        .catch(err => {
            res.status(400).json({
                status: "fail",
                message: "error:😱 " + err.message
            });
        });
});
