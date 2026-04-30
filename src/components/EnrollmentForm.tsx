import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, MessageSquare, Loader2, CheckCircle } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const EnrollmentForm: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    program: '',
    schedule: '',
    coach: '',
    goals: ''
  });

  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#enroll-')) {
        const coachName = decodeURIComponent(hash.replace('#enroll-', ''));
        setFormData(prev => ({ ...prev, coach: coachName }));
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check on mount
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const enrollmentData = {
        ...formData,
        email: formData.email.toLowerCase().trim(),
        submittedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'enrollments'), enrollmentData);
      
      // Ping the email notification
      try {
        await fetch('/api/notify-enrollment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(enrollmentData)
        });
      } catch (err) {
        console.warn("Notification ping failed, but data was saved to Firestore.");
      }
      
      setStatus('success');
      setFormData({
        fullName: '',
        mobileNumber: '',
        email: '',
        program: '',
        schedule: '',
        coach: '',
        goals: ''
      });
    } catch (error) {
      setStatus('idle');
      handleFirestoreError(error, OperationType.WRITE, 'enrollments');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section id="enroll" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-6xl font-display font-bold mb-6 leading-none text-white drop-shadow-[0_0_15px_rgba(255,0,0,0.3)]">
              READY TO <br />
              <span className="text-primary">TRANSFORM?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-md font-medium">
              Fill out the form below and one of our expert coaches will contact you within 24 hours to schedule your first session.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-secondary border border-white/10 shadow-2xl flex items-center justify-center text-primary rounded-2xl group-hover:border-primary transition-all duration-500">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Call Us Directly</p>
                  <p className="text-xl font-display font-bold text-white">0962-960-5748</p>
                </div>
              </div>
              
              <a 
                href="https://wa.me/639629605748" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-6 group"
              >
                <div className="w-14 h-14 bg-primary flex items-center justify-center text-white group-hover:bg-white group-hover:text-primary transition-all duration-500 rounded-2xl shadow-[0_0_20px_rgba(255,0,0,0.3)]">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">WhatsApp Chat</p>
                  <p className="text-xl font-display font-bold text-white group-hover:text-primary transition-colors">Message on WhatsApp</p>
                </div>
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full" />
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative bg-secondary/80 backdrop-blur-xl border border-white/10 p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[40px] overflow-hidden"
            >
              <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
              
              {status === 'success' ? (
                <div className="py-20 text-center relative z-10">
                  <CheckCircle className="mx-auto text-primary mb-6 drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]" size={64} />
                  <h3 className="text-3xl font-display font-bold mb-4 text-white">APPLICATION RECEIVED!</h3>
                  <p className="text-gray-400 font-medium mb-4">Our team will contact you within 24 hours. Get ready to work!</p>
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl mb-8">
                    <p className="text-sm font-medium text-white mb-2">Want real-time updates while you wait?</p>
                    <a href="https://www.facebook.com/northfitnesscamp" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold text-sm block">
                      Follow our Facebook Page →
                    </a>
                  </div>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="mt-8 text-primary font-display font-bold uppercase tracking-widest hover:underline"
                  >
                    Send another application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative group">
                      <input 
                        type="text" 
                        name="fullName"
                        required 
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className="w-full bg-black/50 border border-white/10 px-4 py-4 text-white focus:border-primary focus:outline-none transition-all placeholder:text-gray-700 rounded-xl font-medium"
                      />
                    </div>
                    <div className="relative group">
                      <input 
                        type="tel" 
                        name="mobileNumber"
                        required 
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        placeholder="Mobile Number"
                        className="w-full bg-black/50 border border-white/10 px-4 py-4 text-white focus:border-primary focus:outline-none transition-all placeholder:text-gray-700 rounded-xl font-medium"
                      />
                    </div>
                  </div>
                  
                  <input 
                    type="email" 
                    name="email"
                    required 
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="w-full bg-black/50 border border-white/10 px-4 py-4 text-white focus:border-primary focus:outline-none transition-all placeholder:text-gray-700 rounded-xl font-medium"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <select 
                      name="program"
                      required
                      value={formData.program}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/10 px-4 py-4 text-white focus:border-primary focus:outline-none transition-all appearance-none rounded-xl cursor-pointer font-medium"
                    >
                      <option value="" className="bg-secondary">Select Program</option>
                      <option value="weight-loss" className="bg-secondary">Weight Loss Camp</option>
                      <option value="strength" className="bg-secondary">Strength & Conditioning</option>
                      <option value="hiit" className="bg-secondary">HIIT Bootcamp</option>
                      <option value="endurance" className="bg-secondary">Endurance Training</option>
                    </select>
                    <select 
                      name="schedule"
                      required
                      value={formData.schedule}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/10 px-4 py-4 text-white focus:border-primary focus:outline-none transition-all appearance-none rounded-xl cursor-pointer font-medium"
                    >
                      <option value="" className="bg-secondary">Preferred Schedule</option>
                      <option value="morning" className="bg-secondary">Morning (5AM - 8AM)</option>
                      <option value="afternoon" className="bg-secondary">Afternoon (12PM - 2PM)</option>
                      <option value="evening" className="bg-secondary">Evening (5PM - 8PM)</option>
                    </select>
                    <select 
                      name="coach"
                      value={formData.coach}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-white/10 px-4 py-4 text-white focus:border-primary focus:outline-none transition-all appearance-none rounded-xl cursor-pointer font-medium"
                    >
                      <option value="" className="bg-secondary">Preferred Coach (Optional)</option>
                      <option value="Coach Harold" className="bg-secondary">Coach Harold</option>
                      <option value="Coach Joeffrey" className="bg-secondary">Coach Joeffrey</option>
                      <option value="Coach Teresa" className="bg-secondary">Coach Teresa</option>
                      <option value="Coach Alvin" className="bg-secondary">Coach Alvin</option>
                    </select>
                  </div>
                  
                  <textarea 
                    name="goals"
                    rows={4} 
                    value={formData.goals}
                    onChange={handleChange}
                    placeholder="Tell us about your fitness goals..."
                    className="w-full bg-black/50 border border-white/10 px-4 py-4 text-white focus:border-primary focus:outline-none transition-all placeholder:text-gray-700 rounded-xl resize-none font-medium"
                  ></textarea>
                  
                  <button 
                    type="submit" 
                    disabled={status === 'loading'}
                    className="w-full py-5 bg-primary text-white font-display font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-primary transition-all duration-500 flex items-center justify-center gap-3 rounded-xl shadow-[0_0_20px_rgba(255,0,0,0.3)] hover:shadow-[0_0_40px_rgba(255,0,0,0.5)] relative group overflow-hidden"
                  >
                    <span className="relative z-10">
                      {status === 'loading' ? (
                        <div className="flex items-center gap-3">
                          <Loader2 className="animate-spin" size={20} />
                          Processing...
                        </div>
                      ) : (
                        'Forge My Future →'
                      )}
                    </span>
                    <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
