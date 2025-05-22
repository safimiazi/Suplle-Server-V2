import { z } from "zod";
import mongoose from "mongoose";

export const restaurantZoneValidationSchema = z.object({

  tableName: z.string().min(1, "Table name is required"),
  tableSetting: z.string().min(1, "Table setting is required"),
  seatingCapacity: z
    .number({ required_error: "Seating capacity is required" })
    .int("Seating capacity must be an integer")
    .min(1, "Seating capacity must be at least 1"),
  zoneName: z.string().min(1, "Zone name is required"),
  zoneType: z.string().min(1, "Zone type is required"),
});



export const restaurantZoneUpdateValidation = restaurantZoneValidationSchema.partial();