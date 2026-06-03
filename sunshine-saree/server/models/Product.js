const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: [0, 'Discount price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: ['Silk', 'Cotton', 'Banarasi', 'Chanderi', 'Georgette', 'Designer', 'Chiffon', 'Traditional', 'Linen', 'Organza', 'Crepe', 'Synthetic', 'Net'],
    },
    fabric: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
    occasion: [
      {
        type: String,
        enum: ['Wedding', 'Festival', 'Casual', 'Party', 'Office', 'Traditional', 'Cocktail'],
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Virtual for discount percentage
productSchema.virtual('discountPercent').get(function () {
  if (this.price && this.discountPrice && this.discountPrice < this.price) {
    return Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  return 0;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

// Index for search
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, price: 1 });

module.exports = mongoose.model('Product', productSchema);
