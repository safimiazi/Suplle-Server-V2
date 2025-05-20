import { z } from 'zod';
    
    export const QrCodeDesignPostValidation = z.object({
      name: z
        .string({
          required_error: 'Design name is required',
        }),
    
      category: z
        .string({
          required_error: 'Category is required',
        }),
    
      description: z
        .string({
          required_error: 'Description is required',
        })
,    
      price: z
        .number({
          required_error: 'Price is required',
          invalid_type_error: 'Price must be a number',
        })
        .min(0, 'Price cannot be negative'),
    
      image: z
        .string({
          required_error: 'Image URL is required',
        })
        .url('Invalid image URL'),
    
      status: z
        .enum(['Available', 'ComingSoon', 'Unavailable'])
        .optional(), // Optional in form; can default to 'Available' on backend
    });
    
    export const QrCodeDesignUpdateValidation = QrCodeDesignPostValidation.partial();
    