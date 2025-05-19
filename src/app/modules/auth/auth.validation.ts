import { z } from 'zod';
    
    export const restaurantValidationRequest = z.object({
      restaurantName: z.string(),
      businessName: z.string(),
      businessEmail: z.string(),
      phone: z.string(),
      restaurantAddress: z.string(),
      password: z.string(),
      referralCode: z.string().optional()
  
       
    });

    export const authLoginValidation = z.object({
      email: z.string().email(),
      password: z.string().min(6),
       
    });




    export type IRestaurantValidationRequest =z.infer<typeof restaurantValidationRequest>
    
    
    