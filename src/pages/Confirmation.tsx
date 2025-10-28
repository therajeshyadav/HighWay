import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Booking } from "@/services/api";

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingId = location.state?.bookingId || 'UNKNOWN';
  const booking: Booking | undefined = location.state?.booking;

  return (
    <div className="min-h-screen bg-background">
      <Header searchPlaceholder="Search" />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-success rounded-full p-4">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Booking Confirmed</h1>
            <p className="text-muted-foreground">
              Ref ID: <span className="font-mono font-semibold">{bookingId}</span>
            </p>
          </div>

          {booking && (
            <div className="bg-card border rounded-lg p-4 text-left space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span>{booking.user_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span>{booking.user_email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone:</span>
                <span>{booking.user_phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Participants:</span>
                <span>{booking.participants}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-semibold">₹{booking.total_amount}</span>
              </div>
              {booking.promo_code && (
                <div className="flex justify-between text-success">
                  <span>Promo Applied:</span>
                  <span>{booking.promo_code} (-₹{booking.discount_amount})</span>
                </div>
              )}
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            Your booking has been confirmed. You will receive a confirmation email shortly with all the details.
          </p>

          <div className="space-y-2">
            <Button onClick={() => navigate('/')} size="lg" className="w-full">
              Back to Home
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Confirmation;
