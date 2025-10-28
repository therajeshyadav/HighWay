const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3001/api';

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: Array<{ field: string; message: string }>;
}

export interface Experience {
    id: string;
    title: string;
    location: string;
    description: string;
    price: number;
    image: string;
    border_color: 'pink' | 'yellow' | 'blue' | 'green';
    about: string;
    availableDates?: string[];
    availableTimes?: { time: string; slotsLeft: number; slotId: string }[];
}

export interface BookingRequest {
    experienceId: string;
    slotId: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    participants: number;
    promoCode?: string;
}

export interface Booking {
    id: string;
    experience_id: string;
    slot_id: string;
    user_name: string;
    user_email: string;
    user_phone: string;
    participants: number;
    promo_code?: string;
    discount_amount: number;
    total_amount: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    created_at: string;
    experience_title?: string;
    experience_location?: string;
    date?: string;
    time?: string;
}

export interface PromoValidation {
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    discountAmount: number;
    finalAmount: number;
    message: string;
}

class ApiService {
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const url = `${API_BASE_URL}${endpoint}`;
            console.log(`Making API request to: ${url}`);
            
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                ...options,
            });

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch {
                    // If response is not JSON, use status text
                    errorMessage = response.statusText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API request failed:', error);
            
            // Provide more specific error messages
            if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                throw new Error('Unable to connect to server. Please check if the backend is running.');
            }
            
            throw error;
        }
    }

    // Experience endpoints
    async getExperiences(): Promise<Experience[]> {
        const response = await this.request<Experience[]>('/experiences');
        return response.data || [];
    }

    async getExperienceById(id: string): Promise<Experience | null> {
        try {
            const response = await this.request<Experience>(`/experiences/${id}`);
            return response.data || null;
        } catch (error) {
            console.error('Failed to fetch experience:', error);
            return null;
        }
    }

    async getExperienceSlots(experienceId: string, date?: string) {
        const queryParam = date ? `?date=${encodeURIComponent(date)}` : '';
        const response = await this.request(`/experiences/${experienceId}/slots${queryParam}`);
        return response.data || [];
    }

    // Booking endpoints
    async createBooking(bookingData: BookingRequest): Promise<Booking> {
        const response = await this.request<Booking>('/bookings', {
            method: 'POST',
            body: JSON.stringify(bookingData),
        });

        if (!response.data) {
            throw new Error('Failed to create booking');
        }

        return response.data;
    }

    async getBookingById(id: string): Promise<Booking | null> {
        try {
            const response = await this.request<Booking>(`/bookings/${id}`);
            return response.data || null;
        } catch (error) {
            console.error('Failed to fetch booking:', error);
            return null;
        }
    }

    async getUserBookings(email: string): Promise<Booking[]> {
        try {
            const response = await this.request<Booking[]>(`/bookings/user/${encodeURIComponent(email)}`);
            return response.data || [];
        } catch (error) {
            console.error('Failed to fetch user bookings:', error);
            return [];
        }
    }

    async cancelBooking(id: string): Promise<boolean> {
        try {
            await this.request(`/bookings/${id}/cancel`, {
                method: 'PUT',
            });
            return true;
        } catch (error) {
            console.error('Failed to cancel booking:', error);
            return false;
        }
    }

    // Promo code endpoints
    async validatePromoCode(code: string, amount: number): Promise<PromoValidation> {
        const response = await this.request<PromoValidation>('/promo/validate', {
            method: 'POST',
            body: JSON.stringify({ code, amount }),
        });

        if (!response.data) {
            throw new Error('Failed to validate promo code');
        }

        return response.data;
    }

    async getPromoCodes() {
        const response = await this.request('/promo/codes');
        return response.data || [];
    }

    // Health check
    async healthCheck() {
        try {
            const response = await this.request('/health');
            return response.success;
        } catch (error) {
            console.error('Health check failed:', error);
            return false;
        }
    }
}

export const apiService = new ApiService();
export default apiService;