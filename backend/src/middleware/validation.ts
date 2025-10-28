import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const bookingSchema = z.object({
  experienceId: z.string().min(1, 'Experience ID is required'),
  slotId: z.string().min(1, 'Slot ID is required'),
  userName: z.string().min(2, 'Name must be at least 2 characters'),
  userEmail: z.string().email('Invalid email format'),
  userPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
  participants: z.number().min(1, 'At least 1 participant required').max(10, 'Maximum 10 participants allowed'),
  promoCode: z.string().optional()
});

export const promoValidationSchema = z.object({
  code: z.string().min(1, 'Promo code is required'),
  amount: z.number().min(0, 'Amount must be positive')
});

export function validateBooking(req: Request, res: Response, next: NextFunction): void {
  try {
    bookingSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
      return;
    }
    next(error);
  }
}

export function validatePromoCode(req: Request, res: Response, next: NextFunction): void {
  try {
    promoValidationSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
      return;
    }
    next(error);
  }
}