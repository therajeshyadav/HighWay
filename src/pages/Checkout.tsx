import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { apiService } from "@/services/api";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [appliedPromoCode, setAppliedPromoCode] = useState("");
  const [loading, setLoading] = useState(false);

  if (!bookingData) {
    navigate('/');
    return null;
  }

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code");
      return;
    }

    try {
      setLoading(true);
      const result = await apiService.validatePromoCode(promoCode, bookingData.subtotal);
      setDiscount(result.discountAmount);
      setAppliedPromoCode(promoCode);
      toast.success(result.message);
    } catch (error: any) {
      toast.error(error.message || "Invalid promo code");
      setDiscount(0);
      setAppliedPromoCode("");
    } finally {
      setLoading(false);
    }
  };

  const finalTotal = bookingData.total - discount;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!agreedToTerms) {
      toast.error("Please agree to terms and safety policy");
      return;
    }

    if (!bookingData.experienceId || !bookingData.slotId) {
      toast.error("Missing booking information. Please try again.");
      return;
    }

    try {
      setLoading(true);
      console.log('🎫 Creating booking with data:', {
        experienceId: bookingData.experienceId,
        slotId: bookingData.slotId,
        userName: fullName,
        userEmail: email,
        userPhone: phone,
        participants: bookingData.quantity,
        promoCode: appliedPromoCode || undefined
      });
      
      const booking = await apiService.createBooking({
        experienceId: bookingData.experienceId,
        slotId: bookingData.slotId,
        userName: fullName,
        userEmail: email,
        userPhone: phone,
        participants: bookingData.quantity,
        promoCode: appliedPromoCode || undefined
      });

      console.log('✅ Booking created successfully:', booking);
      toast.success("Booking confirmed successfully!");
      navigate('/confirmation', { 
        state: { 
          bookingId: booking.id,
          booking: booking
        } 
      });
    } catch (error: any) {
      console.error('❌ Booking failed:', error);
      toast.error(error.message || "Failed to create booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header searchPlaceholder="Search" />
      
      <main className="container mx-auto px-4 py-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm mb-4 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Checkout
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          <form onSubmit={handlePayment} className="lg:col-span-2 space-y-6">
            <div className="bg-card border rounded-lg p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full name *</Label>
                  <Input
                    id="fullName"
                    placeholder="Your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="promoCode">Promo code</Label>
                <div className="flex gap-2">
                  <Input
                    id="promoCode"
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button 
                    type="button" 
                    variant="secondary"
                    onClick={handleApplyPromo}
                    disabled={loading}
                  >
                    {loading ? "Applying..." : "Apply"}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                />
                <Label 
                  htmlFor="terms" 
                  className="text-sm cursor-pointer"
                >
                  I agree to the terms and safety policy
                </Label>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full md:w-auto" disabled={loading}>
              {loading ? "Processing..." : "Pay and Confirm"}
            </Button>
          </form>

          <div className="lg:col-span-1">
            <div className="bg-card border rounded-lg p-6 space-y-4 sticky top-24">
              <h2 className="font-semibold text-lg mb-4">Booking Summary</h2>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Experience</span>
                  <span>{bookingData.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span>{bookingData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span>{bookingData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Qty</span>
                  <span>{bookingData.quantity}</span>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{bookingData.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes</span>
                  <span>₹{bookingData.taxes}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Discount</span>
                    <span>−₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>₹{finalTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
