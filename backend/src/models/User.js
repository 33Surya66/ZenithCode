const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  walletAddress: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  zthBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    theme: {
      type: String,
      default: 'dark'
    },
    notifications: {
      type: Boolean,
      default: true
    }
  },
  stats: {
    totalContributions: {
      type: Number,
      default: 0
    },
    totalTokensEarned: {
      type: Number,
      default: 0
    },
    rank: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Add tokens to balance
userSchema.methods.addTokens = async function(amount) {
  this.zthBalance += amount;
  this.stats.totalTokensEarned += amount;
  return this.save();
};

// Spend tokens
userSchema.methods.spendTokens = async function(amount) {
  if (this.zthBalance < amount) {
    throw new Error('Insufficient token balance');
  }
  this.zthBalance -= amount;
  return this.save();
};

// Increment contribution count
userSchema.methods.incrementContributions = async function() {
  this.stats.totalContributions += 1;
  return this.save();
};

// Virtual for public profile
userSchema.virtual('publicProfile').get(function() {
  return {
    id: this._id,
    username: this.username,
    zthBalance: this.zthBalance,
    stats: this.stats,
    createdAt: this.createdAt
  };
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ walletAddress: 1 });
userSchema.index({ 'stats.totalContributions': -1 });
userSchema.index({ 'stats.totalTokensEarned': -1 });

module.exports = mongoose.model('User', userSchema); 