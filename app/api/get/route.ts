import mongoose from 'mongoose';
import connectMongoose from '@/lib/mongoose';
import { NextResponse } from 'next/server';

// Define schemas that match your Prisma types
const TimeSlotSchema = new mongoose.Schema({
  open: Number,
  close: Number
});

const AvailabilitySchema = new mongoose.Schema({
  date: Date,
  timeSlots: [TimeSlotSchema],
  capacity: Number
});

const HoursSchema = new mongoose.Schema({
  delivery: [AvailabilitySchema],
  pickup: [AvailabilitySchema]
});

const LocationSchema = new mongoose.Schema({
  type: String,
  coordinates: [Number],
  address: [String],
  hours: HoursSchema,
  role: {
    type: String,
    enum: ['CONSUMER', 'SELLER', 'ADMIN'], // Adjust based on your UserRole enum
    default: 'CONSUMER'
  },
  isDefault: Boolean
});

const ListingSchema = new mongoose.Schema({
  title: String,
  price: Number,
  location: LocationSchema,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

// Create or get the Listing model
const ListingModel = mongoose.models.Listing || mongoose.model('Listing', ListingSchema, 'Listing');

export async function GET() {
  try {
    await connectMongoose();
    console.log('Mongoose connection state:', mongoose.connection.readyState);

    const listings = await ListingModel.find().lean().exec();
    console.log('Fetched listings:', JSON.stringify(listings, null, 2));

    if (!listings || listings.length === 0) {
      return NextResponse.json({ message: 'No listings found' }, { status: 404 });
    }

    return NextResponse.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json({ message: 'Internal server error', error: String(error) }, { status: 500 });
  }
}