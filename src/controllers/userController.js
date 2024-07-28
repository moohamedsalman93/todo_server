import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Sequence from '../models/Sequence.js';
import { Types } from 'mongoose';

export const registerUser = async (req, res) => {
  const { name, email, isEdit, id } = req.body;
  const profilePicture = req.file;

  try {

    let user = ''

    if (isEdit === 'true') {
      user = await User.findById(id)
    }
    else {
      user = await User.findOne({ email });
    }

    if (user && !isEdit) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (user && isEdit) {
      user.email = email || user.email
      user.name = name || user.name;
      user.profilePicture = profilePicture ? profilePicture.path : user.profilePicture;

      await user.save();

      return res.status(200).json({
        message: 'User updated successfully',
        user: {
          customId: user.customId,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.profilePicture
        }
      });
    } else {
      const sequence = await Sequence.findOneAndUpdate(
        { _id: "employeeId" },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true } // upsert: true to create the document if it doesn't exist
      );

      const customId = `emp${sequence.sequence_value.toString().padStart(3, '0')}`;

      user = new User({
        customId,
        name,
        email,
        role: "employee",
        profilePicture: profilePicture ? profilePicture.path : undefined
      });

      await user.save();

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          customId: user.customId,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.profilePicture
        }
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

};

// export const updatePassword = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     let user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ message: 'User not exists' });
//     }

//     // Hash the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Update user's password
//     user.password = hashedPassword;
//     await user.save();

//     // Generate JWT token
//     const token = jwt.sign({ role: user.role, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.status(200).json({
//       message: 'Password updated successfully',
//       token,
//       role: user.role
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

export const checkUser = async (req, res) => {
  const { email } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not exists' });
    }

    res.status(201).json({
      message: 'User exists',
      isNew: !user.password || user.password === undefined
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.password || user.password === undefined) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Update user's password
      user.password = hashedPassword;
      await user.save();
    }
    else {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
    }



    const token = jwt.sign({ role: user.role, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  const { q } = req.query;

  try {
    let query = { role: { $ne: 'admin' } };

    if (q) {
      query = {
        ...query,
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } },
        ],
      };
    }

    const users = await User.find(query);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getUser = async (req, res) => {
  const { userId } = req.query;

  try {
    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.query;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
