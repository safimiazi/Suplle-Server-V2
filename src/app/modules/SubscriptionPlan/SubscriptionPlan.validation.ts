import { z } from 'zod';
    
    export const SubscriptionPlanPostValidation = z.object({
      name: z.string(),
      price: z.number().nonnegative("Price must be a non-negative number."),
      maxRestaurants: z.number().int().positive("Must allow at least one restaurant."),
      features: z.array(z.string().min(3)).nonempty("At least one feature is required."),
      mostPopular: z.boolean().optional(),
      billingCycle: z.enum(['monthly', 'yearly'])
   
    });
    
    export const SubscriptionPlanUpdateValidation = SubscriptionPlanPostValidation.partial();
    