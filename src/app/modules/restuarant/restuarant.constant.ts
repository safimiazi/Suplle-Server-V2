export const RESTUARANT_SEARCHABLE_FIELDS = [];

export enum RESTAURANT_STATUS {
    PENDING = "pending",        // After OTP is verified
    ACTIVE = "acitve",      // After admin approval
    REJECTED = "rejected"       // Optional: if admin denies request
  }