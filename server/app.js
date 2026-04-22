const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message)
  })

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: Number,
      default: null,
    },
    otpExpires: {
      type: Number,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

const User = mongoose.model('User', userSchema)

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' })
})

app.post('/api/signup', async (request, response) => {
  try {
    const { fullName, email, password } = request.body

    if (!fullName || !email || !password) {
      return response.status(400).json({ message: 'fullName, email and password are required.' })
    }

    const normalizedEmail = String(email).toLowerCase().trim()
    const hashedPassword = await bcrypt.hash(password, 10)

    // 2. Generate OTP (Simple logic)
    const otp = Math.floor(100000 + Math.random() * 900000)

    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser && existingUser.isVerified) {
      return response.status(409).json({ message: 'User already exists and is verified.' })
    }

    const userPayload = {
      fullName,
      email: normalizedEmail,
      password: hashedPassword,
      otp,
      otpExpires: Date.now() + 5 * 60 * 1000,
      isVerified: false,
    }

    if (existingUser) {
      existingUser.fullName = userPayload.fullName
      existingUser.password = userPayload.password
      existingUser.otp = userPayload.otp
      existingUser.otpExpires = userPayload.otpExpires
      existingUser.isVerified = false
      await existingUser.save()
    } else {
      await User.create(userPayload)
    }

    // 3. Send OTP Email (main moment)
    await transporter.sendMail({
      to: normalizedEmail,
      subject: 'Your OTP Code',
      html: `<h2>Your OTP is ${otp}</h2>`,
    })

    return response.status(200).json({
      message: 'OTP sent to email successfully.',
    })
  } catch (error) {
    return response.status(500).json({
      message: 'Signup failed.',
      error: error.message,
    })
  }
})

app.post('/api/verify-otp', async (request, response) => {
  try {
    const { email, otp } = request.body

    if (!email || !otp) {
      return response.status(400).json({ message: 'Email and OTP are required.' })
    }

    const normalizedEmail = String(email).toLowerCase().trim()
    const user = await User.findOne({ email: normalizedEmail })

    if (!user) {
      return response.status(404).json({ message: 'User not found.' })
    }

    // Logic:
    // Match OTP
    // Check expiry
    // Mark user as verified.
    if (String(user.otp) !== String(otp)) {
      return response.status(400).json({ message: 'Invalid OTP.' })
    }

    if (!user.otpExpires || Date.now() > user.otpExpires) {
      return response.status(400).json({ message: 'OTP expired.' })
    }

    user.isVerified = true
    user.otp = null
    user.otpExpires = null
    await user.save()

    await transporter.sendMail({
      to: normalizedEmail,
      subject: 'Welcome to Curio',
      html: `<h2>Welcome to Curio, ${user.fullName}!</h2><p>Your signup is successful.</p>`,
    })

    return response.status(200).json({
      message: 'OTP verified and signup completed.',
    })
  } catch (error) {
    return response.status(500).json({
      message: 'OTP verification failed.',
      error: error.message,
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
