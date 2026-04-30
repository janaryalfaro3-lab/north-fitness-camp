import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  isBefore,
  startOfToday
} from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, User, CheckCircle2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const timeSlots = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
  '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
];

const coaches = [
  { id: 'harold', name: 'Coach Harold', color: 'bg-lime-400' },
  { id: 'joeffrey', name: 'Coach Joeffrey', color: 'bg-blue-400' },
  { id: 'teresa', name: 'Coach Teresa', color: 'bg-pink-400' },
  { id: 'alvin', name: 'Coach Alvin', color: 'bg-orange-400' }
];

export const BookingCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedCoach, setSelectedCoach] = useState(coaches[0]);
  const [isBooked, setIsBooked] = useState(false);

  const today = startOfToday();

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-8">
        <h4 className="text-xl font-display font-bold text-white uppercase tracking-wider">
          {format(currentMonth, 'MMMM yyyy')}
        </h4>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 mb-4">
        {days.map((day) => (
          <div key={day} className="text-center text-[10px] uppercase font-black tracking-widest text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = 'd';
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isDisabled = !isSameMonth(day, monthStart) || isBefore(day, today);
        const isSelected = isSameDay(day, selectedDate);

        days.push(
          <div
            key={day.toString()}
            className={cn(
              "relative h-12 md:h-16 flex items-center justify-center cursor-pointer transition-all border border-white/5",
              isDisabled ? "opacity-20 cursor-not-allowed" : "hover:bg-primary/20",
              isSelected && "bg-primary/40 border-primary shadow-[0_0_15px_rgba(255,0,0,0.2)]"
            )}
            onClick={() => !isDisabled && setSelectedDate(cloneDay)}
          >
            <span className={cn(
              "text-xs font-bold font-display transition-colors",
              isDisabled ? "text-gray-600" : isSelected ? "text-white" : "text-gray-400"
            )}>
              {format(day, dateFormat)}
            </span>
            {isSameDay(day, today) && !isSelected && (
              <div className="absolute top-2 right-2 w-1 h-1 bg-primary rounded-full animate-ping" />
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40">{rows}</div>;
  };

  const handleBooking = () => {
    if (selectedSlot) {
      setIsBooked(true);
      setTimeout(() => setIsBooked(false), 3000);
    }
  };

  return (
    <section id="booking-calendar" className="py-24 bg-zinc-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-4 text-white uppercase tracking-tighter">
            BOOK YOUR <span className="text-primary">SESSION</span>
          </h2>
          <p className="text-gray-400 font-display tracking-widest text-sm uppercase">Select a date and time slot for your personal training</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar View */}
          <div className="lg:col-span-2 bg-zinc-900/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
          </div>

          {/* Slots & Selection */}
          <div className="space-y-6">
            {/* Coach Selection */}
            <div className="bg-zinc-900/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
              <h4 className="text-sm font-display font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <User size={16} className="text-primary" /> Select Coach
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {coaches.map((coach) => (
                  <button
                    key={coach.id}
                    onClick={() => setSelectedCoach(coach)}
                    className={cn(
                      "py-3 px-4 rounded-xl border font-display text-[10px] font-bold uppercase transition-all",
                      selectedCoach.id === coach.id 
                        ? cn("border-transparent text-black", coach.color) 
                        : "border-white/10 text-gray-500 hover:border-white/30"
                    )}
                  >
                    {coach.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="bg-zinc-900/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
              <h4 className="text-sm font-display font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <Clock size={16} className="text-primary" /> {format(selectedDate, 'MMM d')} Slots
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={cn(
                      "py-2 text-[9px] font-bold uppercase tracking-widest border rounded-lg transition-all",
                      selectedSlot === slot
                        ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(255,0,0,0.3)]"
                        : "border-white/5 bg-white/5 text-gray-500 hover:bg-white/10 hover:border-white/20"
                    )}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBooking}
                disabled={!selectedSlot || isBooked}
                className={cn(
                  "w-full mt-8 py-4 rounded-2xl font-display font-black uppercase text-xs tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-2",
                  isBooked 
                    ? "bg-lime-400 text-black" 
                    : "bg-primary text-white shadow-[0_0_30px_rgba(255,0,0,0.2)] hover:shadow-[0_0_50px_rgba(255,0,0,0.4)] disabled:opacity-50 disabled:grayscale cursor-pointer"
                )}
              >
                {isBooked ? (
                  <>
                    <CheckCircle2 size={18} />
                    Booking Confirmed!
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </motion.button>
              
              <p className="text-[9px] text-gray-500 text-center mt-6 uppercase font-bold tracking-widest italic">
                * Our staff will contact you to confirm the appointment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
