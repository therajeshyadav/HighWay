import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { apiService, Experience } from "@/services/api";
import { toast } from "sonner";
import { getImageSrc } from "@/hooks/useImageImport";

const ExperienceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchExperience = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await apiService.getExperienceById(id);
        if (data) {
          setExperience(data);
        } else {
          setError('Experience not found');
        }
      } catch (err) {
        setError('Failed to load experience details');
        console.error('Error fetching experience:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header searchPlaceholder="Search" />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading experience details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen bg-background">
        <Header searchPlaceholder="Search" />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <p className="text-red-500">{error || 'Experience not found'}</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Back to Home
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const selectedTimeSlot = selectedTime !== null && experience.availableTimes ? experience.availableTimes[selectedTime] : null;
  const subtotal = experience.price * quantity;
  const taxes = Math.round(subtotal * 0.06);
  const total = subtotal + taxes;

  const handleConfirm = () => {
    if (selectedTime === null) {
      toast.error("Please select a time slot");
      return;
    }

    if (selectedTimeSlot && selectedTimeSlot.slotsLeft === 0) {
      toast.error("This time slot is sold out");
      return;
    }

    navigate('/checkout', {
      state: {
        experienceId: experience.id,
        experience: experience.title,
        date: experience.availableDates?.[selectedDate],
        time: selectedTimeSlot?.time,
        slotId: selectedTimeSlot?.slotId,
        quantity,
        subtotal,
        taxes,
        total
      }
    });
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
          Details
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-[16/9] overflow-hidden rounded-lg">
              <img
                src={getImageSrc(experience.image)}
                alt={experience.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-2">{experience.title}</h1>
              <p className="text-muted-foreground">{experience.description}</p>
            </div>

            <div>
              <h2 className="font-semibold mb-3">Choose date</h2>
              <div className="flex gap-2 flex-wrap">
                {experience.availableDates?.map((date, index) => (
                  <Button
                    key={date}
                    variant={selectedDate === index ? "default" : "outline"}
                    onClick={() => setSelectedDate(index)}
                  >
                    {date}
                  </Button>
                )) || <p className="text-muted-foreground">No dates available</p>}
              </div>
            </div>

            <div>
              <h2 className="font-semibold mb-3">Choose time</h2>
              <p className="text-xs text-muted-foreground mb-3">
                All times are in IST (GMT +5:30)
              </p>
              <div className="flex gap-2 flex-wrap">
                {experience.availableTimes?.map((slot, index) => (
                  <Button
                    key={slot.time}
                    variant={selectedTime === index ? "default" : "outline"}
                    onClick={() => setSelectedTime(index)}
                    disabled={slot.slotsLeft === 0}
                    className="relative"
                  >
                    {slot.time}
                    <span className="ml-2 text-xs">
                      {slot.slotsLeft === 0 ? 'Sold out' : `${slot.slotsLeft} left`}
                    </span>
                  </Button>
                )) || <p className="text-muted-foreground">No time slots available</p>}
              </div>
            </div>

            <div>
              <h2 className="font-semibold mb-2">About</h2>
              <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
                {experience.about}
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card border rounded-lg p-6 space-y-4 sticky top-24">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Starts at</span>
                <span className="text-2xl font-bold">₹{experience.price}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Quantity</span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    −
                  </Button>
                  <span className="w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxes</span>
                  <span>₹{taxes}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                onClick={handleConfirm}
                disabled={selectedTime === null || (selectedTimeSlot && selectedTimeSlot.slotsLeft === 0)}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExperienceDetails;
