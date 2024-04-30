// import { promises as fs } from "fs";
// import path from "path";
// import multer from "multer";
// import prisma from "@/lib/prisma";
// import { NextRequest, NextResponse } from "next/server";

// const upload = multer({ dest: "uploads/" });

// export async function POST(request: NextRequest) {
//   const formData = await request.formData();
//   const file = formData.get("file") as Express.Multer.File | null;
//   const listingId = formData.get("listingId") as string;

//   if (!file) {
//     return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
//   }

//   if (!listingId) {
//     return NextResponse.json(
//       { message: "Listing ID is required" },
//       { status: 400 }
//     );
//   }

//   console.log("file.buffer:", file.buffer); // Add this line

//   if (!file.buffer) {
//     return NextResponse.json(
//       { message: "Error processing file data" },
//       { status: 500 }
//     );
//   }

//   const fileData = file.buffer;
//   const fileName = `${Date.now()}_${file.originalname}`;
//   const filePath = path.join(process.cwd(), "public", "uploads", fileName);

//   await fs.writeFile(filePath, fileData);

//   try {
//     const savedFile = await prisma.file.create({
//       data: {
//         name: fileName,
//         path: filePath,
//         listing: { connect: { id: listingId } },
//       },
//     });
//     return NextResponse.json({ file: savedFile }, { status: 200 });
//   } catch (error) {
//     console.error("Error saving file details:", error);
//     return NextResponse.json(
//       { message: "Error saving file details" },
//       { status: 500 }
//     );
//   }
// }

// export const dynamic = "force-dynamic";
// export const revalidate = 0;
// export const fetchCache = "auto";
// export const runtime = "nodejs";
// export const preferredRegion = "auto";
