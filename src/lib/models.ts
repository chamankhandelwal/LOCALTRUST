import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema({ name: { type: String, required: true, trim: true }, email: { type: String, required: true, unique: true, lowercase: true, trim: true }, password: { type: String, required: true, select: false }, phone: String, role: { type: String, enum: ["customer", "provider", "admin"], default: "customer" }, profileImage: String, address: { locality: String, city: String, pinCode: String }, isActive: { type: Boolean, default: true } }, { timestamps: true });
const ProviderSchema = new Schema({ userId: { type: Schema.Types.ObjectId, ref: "User", unique: true, required: true }, businessName: { type: String, required: true }, category: { type: String, required: true, index: true }, description: { type: String, default: "" }, experience: { type: Number, default: 0 }, serviceAreas: [{ locality: String, city: String, pinCode: String }], pricing: { startingPrice: { type: Number, default: 0 }, details: String }, availability: { type: String, enum: ["available", "busy", "unavailable"], default: "available" }, workingHours: String, portfolio: [String], verificationStatus: { type: String, enum: ["pending", "verified", "rejected"], default: "pending", index: true }, averageRating: { type: Number, default: 0 }, totalReviews: { type: Number, default: 0 }, completedJobs: { type: Number, default: 0 } }, { timestamps: true });
ProviderSchema.index({ "serviceAreas.city": 1, "serviceAreas.locality": 1, "serviceAreas.pinCode": 1 });
const CategorySchema = new Schema({ name: { type: String, required: true, unique: true }, slug: { type: String, required: true, unique: true }, description: String, icon: String, isActive: { type: Boolean, default: true } }, { timestamps: true });
const BookingSchema = new Schema({ customerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true }, providerId: { type: Schema.Types.ObjectId, ref: "ProviderProfile", required: true, index: true }, categoryId: { type: String, required: true }, serviceDate: { type: Date, required: true }, preferredTime: { type: String, required: true }, description: { type: String, required: true }, status: { type: String, enum: ["Pending", "Accepted", "Rejected", "In Progress", "Completed", "Cancelled"], default: "Pending", index: true } }, { timestamps: true });
BookingSchema.index({ providerId: 1, serviceDate: 1, preferredTime: 1, status: 1 });
const ReviewSchema = new Schema({ bookingId: { type: Schema.Types.ObjectId, ref: "Booking", unique: true, required: true }, customerId: { type: Schema.Types.ObjectId, ref: "User", required: true }, providerId: { type: Schema.Types.ObjectId, ref: "ProviderProfile", required: true, index: true }, rating: { type: Number, required: true, min: 1, max: 5 }, comment: { type: String, required: true, maxlength: 1200 } }, { timestamps: true });
const FavouriteSchema = new Schema({ customerId: { type: Schema.Types.ObjectId, ref: "User", required: true }, providerId: { type: Schema.Types.ObjectId, ref: "ProviderProfile", required: true } }, { timestamps: true });
FavouriteSchema.index({ customerId: 1, providerId: 1 }, { unique: true });
const NotificationSchema = new Schema({ userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true }, title: { type: String, required: true }, message: { type: String, required: true }, isRead: { type: Boolean, default: false } }, { timestamps: true });

export const User = models.User || model("User", UserSchema);
export const ProviderProfile = models.ProviderProfile || model("ProviderProfile", ProviderSchema);
export const Category = models.Category || model("Category", CategorySchema);
export const Booking = models.Booking || model("Booking", BookingSchema);
export const Review = models.Review || model("Review", ReviewSchema);
export const Favourite = models.Favourite || model("Favourite", FavouriteSchema);
export const Notification = models.Notification || model("Notification", NotificationSchema);
export type Role = "customer" | "provider" | "admin";
