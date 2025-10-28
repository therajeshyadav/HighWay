import pool from '../config/database.js';
import { PromoCode } from '../types/index.js';
import { createError } from '../middleware/errorHandler.js';

export class PromoService {
  async validatePromoCode(code: string): Promise<PromoCode | null> {
    try {
      console.log(`🔍 Validating promo code: "${code}" (uppercase: "${code.toUpperCase()}")`);
      
      const result = await pool.query(
        'SELECT * FROM promo_codes WHERE code = $1 AND is_active = true',
        [code.toUpperCase()]
      );
      
      console.log(`📊 Found ${result.rows.length} matching promo codes`);
      if (result.rows.length > 0) {
        console.log(`✅ Promo code found:`, result.rows[0]);
      }
      
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error validating promo code:', error);
      throw createError('Failed to validate promo code', 500);
    }
  }

  async calculateDiscount(promoCode: PromoCode, amount: number): Promise<number> {
    // Convert string values to numbers (database returns strings)
    const minAmount = promoCode.min_amount ? parseFloat(promoCode.min_amount.toString()) : 0;
    const discountValue = parseFloat(promoCode.discount_value.toString());
    const maxDiscount = promoCode.max_discount ? parseFloat(promoCode.max_discount.toString()) : null;

    // Check minimum amount requirement
    if (minAmount && amount < minAmount) {
      throw createError(`Minimum order amount of ₹${minAmount} required for this promo code`, 400);
    }

    let discount = 0;

    if (promoCode.discount_type === 'percentage') {
      discount = (amount * discountValue) / 100;
      
      // Apply maximum discount limit if specified
      if (maxDiscount && discount > maxDiscount) {
        discount = maxDiscount;
      }
    } else if (promoCode.discount_type === 'fixed') {
      discount = discountValue;
    }

    // Ensure discount doesn't exceed the total amount
    return Math.min(discount, amount);
  }

  async validateAndCalculateDiscount(code: string, amount: number): Promise<number> {
    const promoCode = await this.validatePromoCode(code);
    
    if (!promoCode) {
      throw createError('Invalid or expired promo code', 400);
    }

    return this.calculateDiscount(promoCode, amount);
  }

  async getAllPromoCodes(): Promise<PromoCode[]> {
    try {
      const result = await pool.query(
        'SELECT * FROM promo_codes WHERE is_active = true ORDER BY created_at DESC'
      );
      
      return result.rows;
    } catch (error) {
      console.error('Error fetching promo codes:', error);
      throw createError('Failed to fetch promo codes', 500);
    }
  }
}