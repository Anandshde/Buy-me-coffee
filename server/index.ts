import express from 'express';
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import crypto from 'crypto';
import cors from 'cors';
import adminMenuRoutes from './routes/adminMenu';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/admin/menu', adminMenuRoutes);

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/buyme';
mongoose
  .connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('Mongo connection error:', err);
  });

interface IUser extends Document {
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model<IUser>('User', userSchema);

interface IResetToken extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
}

const resetTokenSchema = new Schema<IResetToken>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

const ResetToken = mongoose.model<IResetToken>('ResetToken', resetTokenSchema);

app.post('/api/request-reset', async (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email) {
    return res.status(400).json({ message: 'Email required' });
  }

  const user = await User.findOne({ email });
  // Always respond with success to avoid user enumeration
  if (!user) {
    return res.json({ message: 'If that email is registered, you will receive a password reset link.' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const hashed = await bcrypt.hash(token, 10);
  await ResetToken.deleteMany({ userId: user._id });
  await ResetToken.create({
    userId: user._id,
    token: hashed,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
  });

  // In a real app, send an email. Here we log the link for demonstration.
  console.log(`Password reset link: https://example.com/reset-password?token=${token}&id=${user._id}`);

  res.json({ message: 'If that email is registered, you will receive a password reset link.' });
});

app.post('/api/reset-password', async (req, res) => {
  const { userId, token, password } = req.body as { userId?: string; token?: string; password?: string };
  if (!userId || !token || !password) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  const tokenEntry = await ResetToken.findOne({ userId });
  if (!tokenEntry || tokenEntry.expiresAt < new Date()) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  const isValid = await bcrypt.compare(token, tokenEntry.token);
  if (!isValid) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.findByIdAndUpdate(userId, { password: hashedPassword });
  await ResetToken.deleteMany({ userId });

  res.json({ message: 'Password updated' });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

