import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const app = express();

// --- 1. MIDDLEWARE ---
app.use(express.json());
// --- 1. MIDDLEWARE ---
app.use(express.json());
app.use(cors({
  origin: ['https://esparanza.vercel.app', 'http://localhost:3000', 'https://esparanza-git-main-esparanzas-projects.vercel.app'],
  credentials: true
}));


// DEBUG LOGGING
console.log("DEBUG: Env Check");
console.log("Cloud Name exists:", !!process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key exists:", !!process.env.CLOUDINARY_API_KEY);
console.log("API Secret exists:", !!process.env.CLOUDINARY_API_SECRET);
console.log("Mongo URI exists:", !!process.env.MONGO_URI);


// --- 2a. CLOUDINARY CONFIG ---
// --- 2. CLOUDINARY CONFIGURATION (The Fixed Part) ---
// We check for credentials to help you debug if something is wrong
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("❌ CRITICAL ERROR: Cloudinary credentials are missing in .env file.");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// DEBUG: Check Cloudinary Config (Safe Log)
console.log("-----------------------------------------");
console.log("🔍 Checking Environment Variables:");
console.log("Cloudinary Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME ? "✅ Set" : "❌ MISSING");
console.log("Cloudinary API Key:", process.env.CLOUDINARY_API_KEY ? "✅ Set" : "❌ MISSING");
console.log("Cloudinary API Secret:", process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ MISSING");
console.log("Mongo URI:", process.env.MONGO_URI ? "✅ Set" : "❌ MISSING");
console.log("-----------------------------------------");

// Configure Storage (Updated to support Videos & PDFs)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'espranza_uploads',
    // 'auto' lets Cloudinary detect if it's an image, video, or raw file (PDF)
    resource_type: 'auto',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'mp4', 'mkv', 'pdf'],
  },
});

const upload = multer({ storage: storage });

// --- 3. MONGODB CONNECTION ---
if (!process.env.MONGO_URI) {
  console.error("❌ CRITICAL ERROR: MONGO_URI is missing in .env file.");
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully vro!'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));


// --- 4. SCHEMAS (Your Data Models) ---

// --- 4. SCHEMAS (Your Data Models) ---

// Media Asset Sub-schema (Reusable)
const MediaAssetSchema = {
  url: String,
  publicId: String,
  type: { type: String, default: 'image' } // 'image', 'video', 'pdf'
};

// Registration Schema
const RegistrationSchema = new mongoose.Schema({
  // Common fields
  email: String,
  eventId: String,
  eventName: String,
  participationType: String, // 'Solo' or 'Team'

  // Solo event fields
  name: String,
  phone: String,
  college: String,
  department: String,
  degree: String,
  course: String,
  year: String,
  idCardUrl: String,

  // Team event fields
  teamName: String,
  teamMembers: [{
    name: String,
    phone: String
  }],
  teamLeaderIdCardUrl: String,

  // Payment
  paymentScreenshotUrl: String,
  paymentStatus: { type: String, default: "Pending" },

  // Admin
  isActive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
const RegistrationModel = mongoose.model('Registration', RegistrationSchema);

// Event Schema
const EventSchema = new mongoose.Schema({
  id: String,
  title: String,
  date: String,
  time: String,
  description: String,
  category: String,
  registeredCount: Number,
  maxSlots: Number,
  image: MediaAssetSchema, // Updated to MediaAsset
  participationType: String,
  ticketTiers: [String],
  rules: [String],
  teamSize: String,
  coordinatorPhone: String // Event coordinator contact number
});
const EventModel = mongoose.model('Event', EventSchema);

// Content Schema
const ContentSchema = new mongoose.Schema({
  heroTitle: String,
  heroSubtitle: String,
  heroBackgroundMedia: MediaAssetSchema, // Updated
  marqueeText: String,
  eventDate: String,
  ticketPrices: {
    diamond: Number,
    gold: Number,
    silver: Number
  },
  upiId: String,
  qrCodeUrl: String,
  galleryImages: [MediaAssetSchema], // Updated to array of MediaAssets
  faqs: [{ question: String, answer: String }],
  isTicketPassEnabled: { type: Boolean, default: true }
});
const ContentModel = mongoose.model('Content', ContentSchema);

// Team Schema
const TeamMemberSchema = new mongoose.Schema({
  name: String,
  role: String,
  category: {
    type: String,
    enum: ['Faculty Coordinators', 'Student Coordinators', 'Vistara Club Members', 'Cultural Team', 'Technical Team', 'Design & Media Team', 'Volunteers / Core Committee'],
    default: 'Volunteers / Core Committee'
  },
  image: MediaAssetSchema, // Re-added image field
  isActive: { type: Boolean, default: true },
  instagram: String,
  linkedin: String,
  order: { type: Number, default: 0 }
});
const TeamMemberModel = mongoose.model('TeamMember', TeamMemberSchema);


// --- 5. API ROUTES ---

// === A. FILE UPLOAD ROUTE (FIXED) ===
app.post('/api/upload', upload.single('file'), (req, res) => {
  console.log("DEBUG: /api/upload hit");

  if (!req.file) {
    console.error("❌ No file received");
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }

  // Success! Multer-Storage-Cloudinary has already uploaded it.
  console.log("✅ Upload Successful:", req.file.path);

  res.json({
    success: true,
    data: {
      url: req.file.path,
      publicId: req.file.filename,
      type: req.file.mimetype
    }
  });
});

// === B. ADMIN SECURITY ===
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASS) {
    res.json({ success: true, token: "admin-access-granted-vro" });
  } else {
    res.status(401).json({ success: false, message: "Wrong password vro!" });
  }
});

// === C. REGISTRATION ROUTES ===
app.post('/api/register', async (req, res) => {
  try {
    const newReg = new RegistrationModel(req.body);
    await newReg.save();
    console.log("New Registration Saved:", req.body.name);
    res.json({ success: true, message: "Registration successful!" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/admin/registrations', async (req, res) => {
  try {
    const allStudents = await RegistrationModel.find().sort({ createdAt: -1 });
    res.json({ success: true, data: allStudents });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/admin/verify-registration', async (req, res) => {
  try {
    const { registrationId, isActive } = req.body;
    if (!registrationId) {
      return res.status(400).json({ success: false, error: "Registration ID is required" });
    }
    const updatedReg = await RegistrationModel.findByIdAndUpdate(
      registrationId,
      { isActive: isActive },
      { new: true }
    );
    if (!updatedReg) {
      return res.status(404).json({ success: false, error: "Registration not found" });
    }
    console.log(`✅ Registration Verified: ${updatedReg.name} (${updatedReg._id})`);
    res.json({ success: true, message: "Registration verified successfully!", data: updatedReg });
  } catch (error) {
    console.error("❌ Error verifying registration:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- D. EVENT ROUTES ---
app.get('/api/events', async (req, res) => {
  try {
    const events = await EventModel.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

app.post('/api/events/update', async (req, res) => {
  try {
    const { events } = req.body;
    await EventModel.deleteMany({});
    await EventModel.insertMany(events);
    res.json({ success: true, message: "Events updated vro!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- E. CONTENT ROUTES ---
app.get('/api/content', async (req, res) => {
  try {
    const content = await ContentModel.findOne();
    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/content/update', async (req, res) => {
  try {
    const { content } = req.body;
    await ContentModel.deleteMany({});
    const newContent = new ContentModel(content);
    await newContent.save();
    res.json({ success: true, message: "Website content saved!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- F. TEAM ROUTES ---
app.get('/api/team', async (req, res) => {
  try {
    const teamMembers = await TeamMemberModel.find().sort({ order: 1 });
    res.status(200).json({ success: true, data: teamMembers || [] });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.post('/api/team/update', async (req, res) => {
  try {
    const { teamMembers } = req.body;
    if (!Array.isArray(teamMembers)) {
      return res.status(400).json({ success: false, error: "Invalid data format: teamMembers must be an array" });
    }

    // We replace the entire collection or specific logic. 
    // To keep it simple and consistent with Events/Content approaches in this codebase:
    await TeamMemberModel.deleteMany({});
    if (teamMembers.length > 0) {
      // Direct insert - schemas on frontend and backend are now aligned to handle MediaAsset objects
      await TeamMemberModel.insertMany(teamMembers);
    }
    res.json({ success: true, message: "Team list updated successfully!" });
  } catch (error) {
    console.error("❌ Error in /api/team/update:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));