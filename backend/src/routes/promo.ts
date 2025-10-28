import { Router } from 'express';
import { PromoService } from '../services/promoService.js';
import { validatePromoCode } from '../middleware/validation.js';
import { createError } from '../middleware/errorHandler.js';

const router = Router();
const promoService = new PromoService();

// POST /promo/validate - Validate promo code and calculate discount
router.post('/validate', validatePromoCode, async (req, res, next) => {
  try {
    const { code, amount } = req.body;

    const promoCode = await promoService.validatePromoCode(code);

    if (!promoCode) {
      throw createError('Invalid or expired promo code', 400);
    }

    const discount = await promoService.calculateDiscount(promoCode, amount);

    res.json({
      success: true,
      data: {
        code: promoCode.code,
        discountType: promoCode.discount_type,
        discountValue: promoCode.discount_value,
        discountAmount: discount,
        finalAmount: amount - discount,
        message: `Promo code applied! You saved ₹${discount}`
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /promo/codes - Get all active promo codes (for admin or testing)
router.get('/codes', async (req, res, next) => {
  try {
    const promoCodes = await promoService.getAllPromoCodes();

    res.json({
      success: true,
      data: promoCodes
    });
  } catch (error) {
    next(error);
  }
});

export default router;