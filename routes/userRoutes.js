const express = require('express')

const getAllUsers = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'All users'
    });
} 
const getAUser = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'All users'
    });
} 
const updateAUser = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'All users'
    });
} 
const deleteAUser = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'All users'
    });
} 

const router = express.Router()

router
.route('/')
.get(getAllUsers)
router
.route('/:id')
.get(getAUser)
.patch(updateAUser)
.delete(deleteAUser)

module.exports = router