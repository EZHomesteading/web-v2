import mongoose from 'mongoose';
import connectMongoose from '@/lib/mongoose';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    await connectMongoose();
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const radius = parseInt(searchParams.get('radius') || '10000'); 
    const q = searchParams.get('q')

    const geoQuery = {
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: radius
        }
      }
    };

    const nearbyLocations = await mongoose.models.Location.find(geoQuery).select('_id').lean().exec();

    if (!nearbyLocations || nearbyLocations.length === 0) {
      return NextResponse.json({ message: 'No nearby locations found' }, { status: 404 });
    }
    const locationIds = nearbyLocations.map((location) => location._id as string);

    const listings = await prisma.listing.findMany({
      where: {
        locationId: { in: locationIds }
      },
      select:{
        title:true,
        imageSrc:true,
        price:true,
        rating:true,
        quantityType:true,
        location: {
          select: {address:true},
         
        }
      }
    });
    
    return NextResponse.json(listings);
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error', error: String(error) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
