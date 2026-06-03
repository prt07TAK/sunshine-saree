const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const products = [
  {
    name: 'Classic Indigo Handblock Print Mulmul Cotton Saree',
    description: 'Breathable Mulmul cotton saree hand-printed by artisans in Jaipur using natural indigo dyes. Perfect for warm summer afternoons and daily wear comfort.',
    price: 2499,
    discountPrice: 1999,
    category: 'Cotton',
    fabric: 'Mulmul Cotton',
    color: 'Indigo Blue',
    occasion: ['Casual', 'Office'],
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'],
    stock: 20,
    ratings: 4.6,
    numReviews: 31,
    featured: true
  },
  {
    name: 'Sunset Orange Chanderi Cotton Silk Saree',
    description: 'Lightweight, sheer, and beautifully textured, this Chanderi saree merges the comfort of cotton with the sheen of silk.',
    price: 4999,
    discountPrice: 3899,
    category: 'Chanderi',
    fabric: 'Chanderi Cotton Silk',
    color: 'Orange',
    occasion: ['Casual', 'Festival', 'Office'],
    images: ['https://images.unsplash.com/photo-1610030470298-40529994b28c?auto=format&fit=crop&w=800&q=80'],
    stock: 15,
    ratings: 4.5,
    numReviews: 22,
    featured: true
  },
  {
    name: 'Peacock Blue Georgette Designer Saree',
    description: 'A modern take on traditional elegance. Flowy georgette saree embellished with fine sequins along the borders.',
    price: 8999,
    discountPrice: 7499,
    category: 'Georgette',
    fabric: 'Faux Georgette',
    color: 'Peacock Blue',
    occasion: ['Party', 'Festival'],
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
    stock: 12,
    ratings: 4.4,
    numReviews: 15,
    featured: true
  },
  {
    name: 'Marigold Yellow Silk Linen Saree',
    description: 'Blending the structure of linen with the softness of silk, this marigold yellow saree is perfect for daytime festive celebrations like Haldi or Pujas.',
    price: 6500,
    discountPrice: 5200,
    category: 'Silk',
    fabric: 'Silk Linen',
    color: 'Yellow',
    occasion: ['Festival', 'Casual'],
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'],
    stock: 10,
    ratings: 4.3,
    numReviews: 18,
    featured: false
  },
  {
    name: 'Crimson Red Pure Cotton Saree',
    description: 'Comfortable and durable pure cotton saree for everyday wear. Simple yet elegant.',
    price: 1200,
    discountPrice: 950,
    category: 'Cotton',
    fabric: 'Pure Cotton',
    color: 'Red',
    occasion: ['Casual', 'Office'],
    images: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'],
    stock: 30,
    ratings: 4.2,
    numReviews: 45,
    featured: false
  },
  {
    name: 'Elegant Maroon Art Silk Saree',
    description: 'A beautiful art silk saree with zari weaving. Looks premium without the premium price tag.',
    price: 3500,
    discountPrice: 2800,
    category: 'Silk',
    fabric: 'Art Silk',
    color: 'Maroon',
    occasion: ['Festival', 'Wedding'],
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
    stock: 25,
    ratings: 4.5,
    numReviews: 12,
    featured: true
  },
  {
    name: 'Pastel Green Chiffon Saree',
    description: 'Lightweight chiffon saree in pastel green with delicate border work. Perfect for parties.',
    price: 4500,
    discountPrice: 3800,
    category: 'Chiffon',
    fabric: 'Chiffon',
    color: 'Green',
    occasion: ['Party', 'Casual'],
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'],
    stock: 18,
    ratings: 4.4,
    numReviews: 20,
    featured: false
  },
  {
    name: 'Royal Blue Velvet Border Saree',
    description: 'Georgette saree featuring a luxurious velvet border with zari embroidery.',
    price: 8500,
    discountPrice: 7900,
    category: 'Georgette',
    fabric: 'Georgette',
    color: 'Blue',
    occasion: ['Wedding', 'Party'],
    images: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'],
    stock: 8,
    ratings: 4.8,
    numReviews: 16,
    featured: true
  },
  {
    name: 'Simple White Kerala Kasavu Saree',
    description: 'Traditional Kerala Kasavu saree in pure cotton with a golden border. Classic and timeless.',
    price: 2200,
    discountPrice: 1800,
    category: 'Cotton',
    fabric: 'Cotton',
    color: 'White',
    occasion: ['Traditional', 'Festival'],
    images: ['https://images.unsplash.com/photo-1610030470298-40529994b28c?auto=format&fit=crop&w=800&q=80'],
    stock: 40,
    ratings: 4.9,
    numReviews: 55,
    featured: true
  },
  {
    name: 'Mustard Yellow Bandhani Saree',
    description: 'Authentic tie-dye Bandhani saree from Rajasthan in vibrant mustard yellow.',
    price: 3200,
    discountPrice: 2600,
    category: 'Traditional',
    fabric: 'Art Silk',
    color: 'Yellow',
    occasion: ['Festival', 'Traditional'],
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'],
    stock: 22,
    ratings: 4.6,
    numReviews: 33,
    featured: false
  },
  {
    name: 'Black Linen Handloom Saree',
    description: 'Sophisticated black linen saree woven by hand. Breathable and perfect for corporate wear.',
    price: 4800,
    discountPrice: 4200,
    category: 'Linen',
    fabric: 'Linen',
    color: 'Black',
    occasion: ['Office', 'Casual'],
    images: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'],
    stock: 14,
    ratings: 4.7,
    numReviews: 21,
    featured: false
  },
  {
    name: 'Soft Pink Organza Saree',
    description: 'Ethereal organza saree with delicate floral motifs.',
    price: 7500,
    discountPrice: 6500,
    category: 'Organza',
    fabric: 'Organza',
    color: 'Pink',
    occasion: ['Party', 'Wedding'],
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
    stock: 10,
    ratings: 4.5,
    numReviews: 14,
    featured: true
  },
  {
    name: 'Magenta Mysore Crepe Saree',
    description: 'Rich magenta crepe saree offering a fluid drape and subtle sheen.',
    price: 5500,
    discountPrice: 4900,
    category: 'Crepe',
    fabric: 'Crepe',
    color: 'Magenta',
    occasion: ['Festival', 'Party'],
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'],
    stock: 16,
    ratings: 4.3,
    numReviews: 19,
    featured: false
  },
  {
    name: 'Olive Green Tussar Silk Saree',
    description: 'Earthy olive green Tussar silk saree with a natural golden sheen and tribal print borders.',
    price: 8200,
    discountPrice: 7500,
    category: 'Silk',
    fabric: 'Tussar Silk',
    color: 'Olive Green',
    occasion: ['Traditional', 'Office'],
    images: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'],
    stock: 7,
    ratings: 4.8,
    numReviews: 27,
    featured: true
  },
  {
    name: 'Teal Blue Daily Wear Synthetic Saree',
    description: 'Easy to wash and wear synthetic saree. Needs zero ironing.',
    price: 999,
    discountPrice: 900,
    category: 'Synthetic',
    fabric: 'Polyester',
    color: 'Teal Blue',
    occasion: ['Casual'],
    images: ['https://images.unsplash.com/photo-1610030470298-40529994b28c?auto=format&fit=crop&w=800&q=80'],
    stock: 50,
    ratings: 4.1,
    numReviews: 60,
    featured: false
  },
  {
    name: 'Peach Net Embroidered Saree',
    description: 'Delicate net saree covered in intricate thread embroidery and stonework.',
    price: 6800,
    discountPrice: 5900,
    category: 'Net',
    fabric: 'Net',
    color: 'Peach',
    occasion: ['Party', 'Wedding'],
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'],
    stock: 12,
    ratings: 4.6,
    numReviews: 24,
    featured: false
  },
  {
    name: 'Silver Grey Satin Silk Saree',
    description: 'Ultra-smooth satin silk saree that drapes like a dream.',
    price: 5200,
    discountPrice: 4500,
    category: 'Silk',
    fabric: 'Satin Silk',
    color: 'Silver Grey',
    occasion: ['Party', 'Cocktail'],
    images: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'],
    stock: 15,
    ratings: 4.4,
    numReviews: 17,
    featured: true
  },
  {
    name: 'Turquoise Kalamkari Print Saree',
    description: 'Cotton saree featuring beautiful hand-painted style Kalamkari motifs.',
    price: 2800,
    discountPrice: 2400,
    category: 'Cotton',
    fabric: 'Cotton',
    color: 'Turquoise',
    occasion: ['Casual', 'Office', 'Traditional'],
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
    stock: 25,
    ratings: 4.7,
    numReviews: 38,
    featured: false
  },
  {
    name: 'Lavender Chanderi Saree with Zari',
    description: 'Soft lavender Chanderi saree woven with silver zari motifs.',
    price: 6000,
    discountPrice: 5400,
    category: 'Chanderi',
    fabric: 'Chanderi',
    color: 'Lavender',
    occasion: ['Festival', 'Party'],
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'],
    stock: 11,
    ratings: 4.5,
    numReviews: 13,
    featured: false
  },
  {
    name: 'Golden Yellow Supernet Saree',
    description: 'Crisp and transparent supernet saree, perfect for hot summers.',
    price: 1800,
    discountPrice: 1500,
    category: 'Net',
    fabric: 'Supernet',
    color: 'Golden Yellow',
    occasion: ['Casual'],
    images: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'],
    stock: 28,
    ratings: 4.2,
    numReviews: 9,
    featured: false
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to Database for seeding...');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products.');

    // Seed products
    const createdProducts = await Product.create(products);
    console.log(`Seeded ${createdProducts.length} products successfully!`);

    // Seed default Admin user if not exists
    const adminEmail = 'A.amansingh0143@gmail.com';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      await User.create({
        name: 'Aman Singh',
        email: adminEmail,
        password: 'admin_secure_password_123', // Will be hashed by userSchema pre-save hook
        phone: '6203569455',
        role: 'admin',
        address: {
          line: 'Near Ashok Circle',
          city: 'Sujangarh',
          state: 'Rajasthan',
          pincode: '331507'
        }
      });
      console.log(`Seeded Default Admin User: ${adminEmail} (password: admin_secure_password_123)`);
    } else {
      console.log('Admin user already exists.');
    }

    mongoose.connection.close();
    console.log('Database seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
