import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Loader2, CheckCircle } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export const Newsletter: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const subscriberData = {
        email: email.toLowerCase().trim(),
        subscribedAt: serverTimestamp(),
        status: 'active'
      };

      const docRef = doc(db, 'subscribers', subscriberData.email);
      await setDoc(docRef, subscriberData);
      
      // Ping the email notification
      try {
        await fetch('/api/notify-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: subscriberData.email })
        });
      } catch (err) {
        console.warn("Notification ping failed, but data was saved to Firestore.");
      }
      
      setStatus('success');
      setEmail('');
    } catch (error) {
      setStatus('idle');
      handleFirestoreError(error, OperationType.WRITE, `subscribers/${email}`);
    }
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto bg-secondary/80 backdrop-blur-md border border-white/10 p-8 md:p-16 text-center relative shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[40px] overflow-hidden group">
          <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-primary rounded-b-full shadow-[0_0_15px_rgba(255,0,0,0.5)]" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-white drop-shadow-[0_0_15px_rgba(255,0,0,0.3)] uppercase tracking-tighter">JOIN THE <span className="text-primary">INNER CIRCLE</span></h2>
            <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto font-medium">
              Get exclusive workout tips, nutrition guides, and early access to our special bootcamps. Plus, stay updated with the latest posts from our <a href="https://www.facebook.com/northfitnesscamp" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Facebook Page</a>.
            </p>

            {status === 'success' ? (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center py-4"
              >
                <CheckCircle className="text-primary mb-4 drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]" size={48} />
                <h3 className="text-2xl font-display font-bold text-white uppercase tracking-widest">YOU'RE IN!</h3>
                <p className="text-gray-500 mb-2">Check your email for your welcome guide.</p>
                <p className="text-gray-400 text-sm italic">
                  Follow us on <a href="https://www.facebook.com/northfitnesscamp" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">Facebook</a> to get real-time training updates!
                </p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="mt-6 text-primary text-sm font-display font-bold uppercase tracking-widest hover:underline"
                >
                  Subscribe another email
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 bg-black/50 border border-white/10 px-6 py-5 text-white focus:border-primary focus:outline-none transition-all placeholder:text-gray-700 rounded-2xl font-medium"
                />
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="px-10 py-5 bg-primary text-white font-display font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-primary transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50 rounded-2xl shadow-[0_0_20px_rgba(255,0,0,0.3)] hover:shadow-[0_0_40px_rgba(255,0,0,0.5)] relative group overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {status === 'loading' ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        Subscribe <Send size={18} />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </button>
              </form>
            )}
            <p className="text-[10px] text-gray-500 mt-8 uppercase tracking-[0.3em] font-bold">
              No spam. Just gains. Unsubscribe at any time.
            </p>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
        </div>
      </div>
    </section>
  );
};
