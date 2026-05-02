import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, User, BarChart, Flame, Dumbbell } from 'lucide-react';

interface ClassInfo {
  name: string;
  coach: string;
  duration: string;
  difficulty: string;
  time: string;
  day: string;
  calories: string;
  muscles: string;
}

export const Schedule: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const times = [
    { label: 'Morning', slots: ['6:00 AM', '7:00 AM', '8:00 AM'] },
    { label: 'Afternoon', slots: ['12:00 PM', '1:00 PM'] },
    { label: 'Evening', slots: ['5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'] }
  ];

  const classDetails: Record<string, { coach: string; difficulty: string; calories: string; muscles: string }> = {
    'Weight Loss': { coach: 'Coach Tere', difficulty: 'Beginner', calories: '400-600', muscles: 'Full Body, Cardio' },
    'Strength': { coach: 'Coach Harold', difficulty: 'Advanced', calories: '300-500', muscles: 'Chest, Back, Legs' },
    'HIIT': { coach: 'Coach Joeffrey', difficulty: 'Intermediate', calories: '500-800', muscles: 'Full Body, Core' },
    'Endurance': { coach: 'Coach Alvin', difficulty: 'Intermediate', calories: '450-700', muscles: 'Legs, Cardio' },
  };

  const scheduleData: Record<string, Record<string, string>> = {
    'Mon': { '6:00 AM': 'Weight Loss', '5:00 PM': 'Strength' },
    'Tue': { '7:00 AM': 'HIIT', '6:00 PM': 'Weight Loss' },
    'Wed': { '6:00 AM': 'Weight Loss', '5:00 PM': 'Strength' },
    'Thu': { '7:00 AM': 'HIIT', '6:00 PM': 'Weight Loss' },
    'Fri': { '6:00 AM': 'Weight Loss', '5:00 PM': 'Strength' },
    'Sat': { '6:00 AM': 'Endurance', '8:00 AM': 'HIIT' },
    'Sun': {}, // Sunday is closed
  };

  const handleClassClick = (className: string, time: string, day: string) => {
    const details = classDetails[className] || { coach: 'Coach Mike', difficulty: 'Intermediate', calories: '400', muscles: 'Full Body' };
    setSelectedClass({
      name: className,
      coach: details.coach,
      duration: '60 Mins',
      difficulty: details.difficulty,
      calories: details.calories,
      muscles: details.muscles,
      time: time,
      day: day
    });
  };

  const getCalendarLinks = (classInfo: ClassInfo) => {
    const nextDate = new Date();
    const dayMap: Record<string, number> = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
    const targetDay = dayMap[classInfo.day];
    const currentDay = nextDate.getDay();
    let daysDiff = targetDay - currentDay;
    if (daysDiff <= 0) daysDiff += 7;
    nextDate.setDate(nextDate.getDate() + daysDiff);

    const [hmin, p] = classInfo.time.split(' ');
    let [h, m] = hmin.split(':').map(Number);
    if (p === 'PM' && h < 12) h += 12;
    if (p === 'AM' && h === 12) h = 0;
    nextDate.setHours(h, m, 0, 0);

    const endDate = new Date(nextDate);
    endDate.setHours(endDate.getHours() + 1);

    const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const startStr = formatDate(nextDate);
    const endStr = formatDate(endDate);

    const title = encodeURIComponent(`North Fitness Camp: ${classInfo.name}`);
    const details = encodeURIComponent(`Class with ${classInfo.coach}. Duration: ${classInfo.duration}. Difficulty: ${classInfo.difficulty}`);
    const location = encodeURIComponent("North Fitness Camp, Tarlac");

    return {
      google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}`,
      outlook: `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${title}&startdt=${nextDate.toISOString()}&enddt=${endDate.toISOString()}&body=${details}&location=${location}`
    };
  };

  return (
    <section id="schedule" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-display font-bold mb-4">WEEKLY SCHEDULE</h2>
          <div className="w-24 h-1 bg-primary mx-auto" />
        </div>

        <motion.div 
          initial={{ rotateX: 10, opacity: 0 }}
          whileInView={{ rotateX: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="overflow-x-auto"
        >
          <div className="min-w-[800px] bg-secondary/80 backdrop-blur-md border border-white/10 shadow-2xl rounded-3xl overflow-hidden relative">
            <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
            <div className="grid grid-cols-7 border-b border-white/10 relative z-10">
              <div className="p-4 bg-black/50 border-r border-white/10"></div>
              {days.map(day => (
                <div key={day} className="p-4 text-center font-display font-bold text-primary border-r border-white/10 last:border-r-0 uppercase tracking-widest drop-shadow-[0_0_8px_rgba(255,0,0,0.3)]">
                  {day}
                </div>
              ))}
            </div>

            {times.map((group, gIdx) => (
              <React.Fragment key={gIdx}>
                <div className="bg-black/30 p-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 border-b border-white/10 relative z-10">
                  {group.label}
                </div>
                {group.slots.map((time, tIdx) => (
                  <div key={tIdx} className="grid grid-cols-7 border-b border-white/10 last:border-b-0 relative z-10">
                    <div className="p-4 text-xs font-bold text-gray-500 border-r border-white/10 flex items-center justify-center font-mono">
                      {time}
                    </div>
                    {days.map(day => {
                      const className = scheduleData[day]?.[time];
                      const isSunday = day === 'Sun';
                      return (
                        <div key={day} className="p-2 border-r border-white/10 last:border-r-0 min-h-[60px] flex items-center justify-center">
                          {isSunday ? (
                            <span className="text-[10px] font-display font-bold text-gray-800 uppercase tracking-tighter">CLOSED</span>
                          ) : className ? (
                            <button 
                              onClick={() => handleClassClick(className, time, day)}
                              className="w-full h-full p-2 bg-primary/10 border border-primary/30 text-[10px] font-bold uppercase tracking-tighter text-primary hover:bg-primary hover:text-white transition-all rounded-lg shadow-sm hover:shadow-[0_0_15px_rgba(255,0,0,0.3)] group relative overflow-hidden"
                            >
                              <span className="relative z-10">{className}</span>
                              <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </button>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedClass && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedClass(null)}
              className="absolute inset-0 bg-background/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white border border-gray-100 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-3xl"
            >
              <button 
                onClick={() => setSelectedClass(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-primary transition-colors"
              >
                <X size={24} />
              </button>
              
              <h3 className="text-3xl font-display font-bold mb-6 text-primary">{selectedClass.name}</h3>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Coach</p>
                    <p className="font-bold text-gray-900">{selectedClass.coach}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Duration & Time</p>
                    <p className="font-bold text-gray-900">{selectedClass.duration} @ {selectedClass.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <BarChart className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Difficulty</p>
                    <p className="font-bold text-gray-900">{selectedClass.difficulty}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-lime-400/10 flex items-center justify-center">
                    <Flame className="text-lime-600" size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Est. Calories Burned</p>
                    <p className="font-bold text-gray-900">{selectedClass.calories} kcal</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Dumbbell className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Muscles Targeted</p>
                    <p className="font-bold text-gray-900">{selectedClass.muscles}</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  setSelectedClass(null);
                  const el = document.getElementById('booking-calendar');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-4 bg-primary text-white font-display font-bold uppercase tracking-widest hover:bg-gray-900 transition-all rounded-xl shadow-lg shadow-primary/20 mb-4"
              >
                Book This Slot
              </button>

              <div className="grid grid-cols-2 gap-3">
                <a 
                  href={getCalendarLinks(selectedClass).google}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 text-[10px] font-bold uppercase tracking-tighter text-gray-600 hover:bg-gray-100 transition-all rounded-xl border border-gray-100"
                >
                  Google Calendar
                </a>
                <a 
                  href={getCalendarLinks(selectedClass).outlook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 text-[10px] font-bold uppercase tracking-tighter text-gray-600 hover:bg-gray-100 transition-all rounded-xl border border-gray-100"
                >
                  Outlook
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
