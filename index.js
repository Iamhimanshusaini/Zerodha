const express = require("express")
require('dotenv').config();
const holdingModel = require('./model and schema/holding')
const watchData = require('./model and schema/watchList')
const app = express();
const mongoose = require('mongoose');
const positionModel = require("./model and schema/position");
const port = 8080;
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bodyParser = require('body-parser')
const user = require('./model and schema/user')
const bcrypt = require('bcrypt')
const order = require('./model and schema/order')
const authCheck = require('./middleware/authCheck')
app.use(cors());
app.use(bodyParser.json());

// MONGODB CONNECTED CODE START HERE

mongoose.connect('mongodb+srv://himanshudB:Anmol1234@zerodhacluster.i4j0g6l.mongodb.net/zerodhaClone?appName=ZerodhaCluster')
    .then(() => {
        console.log('Db connected succesfuly')
    })
    .catch((err) => {
        console.log('not connected db')
        console.log(err.message)
    })


// signup page data post api code here

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existUser = await user.findOne({ email })
        // console.log(existUser)
        if (!existUser) {
            return res.status(401).json({ message: "User not found ❌" });
        }
        const isPasswordValid = await bcrypt.compare(password, existUser.password)
        if (!isPasswordValid) {
            return res.json({ message: "Invalid password ❌" });
        }
        if (isPasswordValid) {
            const token = jwt.sign({
                id: existUser._id,
                Email: existUser.email,
                name: existUser.name
            },
                "passcode",
                {
                    expiresIn: '24h'
                }
            )
            return res.status(200).json({
                user: existUser,
                token: token,
                message: `Hi ${existUser.name} you are Logined..`

            })
        }

    }
    catch (error) {
        res.status(401).json({ message: 'invaild credils' })
    }
})
app.post('/register', async (req, res) => {

    try {
        const { name, email, password } = req.body
        const hashPassword = await bcrypt.hash(password, 10)
        const newUser = user({
            name: name,
            email: email,
            password: hashPassword
        })
        const saveUser = await newUser.save()
        res.status(201).json({
            message: 'Successfully created user',
            data: saveUser
        })
        console.log(saveUser)
    } catch (error) {
        console.log(`"message": "${error.message}"`)

    }



})

// order placed api and route

app.post('/neworder', authCheck, async (req, res) => {
    try {

        const { name, qty, price, userId } = req.body
        // console.log(name, qty, price, userId)
        // console.log(user.userId)
        const newOrder = await new order({
            name: "SBI",
            qty: qty,
            price: price,
            userId: req.userId,
            mode: 'buy'
        })
        const saveOrder = await newOrder.save()
        return res.status(201).json({
            message: 'new order created succesfuly',
            data: newOrder
        })

    } catch (error) {
        console.log(error.message)

    }


})

// user Update data from mogoDb route

app.post('/forrgot', async (req, res) => {
    try {
        let { email, password } = req.body
        const newPassword = await bcrypt.hash(password, 10)
        let userForgot = await user.findOneAndUpdate({ email }, { password: newPassword })
        if (!userForgot) {
            return res.status(401).json({
                message: 'user not find'
            })
        }
        return res.status(201).json({
            message: 'user updated'
        })

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
})
// fetch userData data from mogoDb route
app.get('/profile/:id', async (req, res) => {
    try {
        const { id } = req.params
        const userData = await user.findById(id)
        if (!userData) {
            res.status(401).json({
                message: "user not found"
            })
        }
        return res.status(201).json({
            message: `Hi ${userData.name}`,
            data: userData
        })
    } catch (error) {
        res.status(401).json({
            message: "somethinigs went worng",
            error: error.message
        })
    }
})
// user profile data updated

app.patch('/profile/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { name, email } = req.body;
        console.log(name, email)
        const updateData = await user.findByIdAndUpdate(
            id,
            {
                name: name,
                email: email
            },
            { new: true }
        )
        console.log(updateData)
        if (!updateData) {
            res.status(401).json({
                message: "user not found"
            })
        }
        return res.status(201).json({
            message: `Hi ${updateData.name}`,
            data: updateData
        })
    } catch (error) {
        res.status(401).json({
            message: "somethinigs went worng",
            error: error.message
        })
    }
})
// fetch holding data from mogoDb route

app.get('/allholdings', async (req, res) => {
    let allholdings = await holdingModel.find({});
    res.json(allholdings)
})

// fetch Position data from mogoDb route
app.get('/allposition', async (req, res) => {
    let allposition = await positionModel.find({})
    res.json(allposition)
})
// fetch watchlist data from mogoDb route

// app.get('/', async (req, res) => {
//     const saveWatchlist = await watchData.insertMany(watchlist)
//     res.status(201).json({
//         message: "store data",
//         data: saveWatchlist

//     })
// })
// fetch Orders data from mogoDb route

app.get('/orders', authCheck, async (req, res) => {
    const allOrders = await order.find({ userId: req.userId })
    res.json(allOrders)
})

app.get('/dashboard', authCheck, (req, res) => {
    res.status(201).json({
        message: 'real auth'

    })
})
// server created 

app.listen(8080, () => {
    console.log('server run.....8080')
})
