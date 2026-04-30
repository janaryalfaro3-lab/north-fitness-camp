import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, LogIn, User as UserIcon, LogOut, Loader2 } from 'lucide-react';
import { Logo } from './Logo';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);
      
      if (u) {
        // Handle user profile creation
        try {
          const userDoc = await getDoc(doc(db, 'users', u.uid));
          if (!userDoc.exists()) {
            const userData = {
              uid: u.uid,
              email: u.email,
              displayName: u.displayName,
              photoURL: u.photoURL,
              role: 'user',
              createdAt: serverTimestamp()
            };
            await setDoc(doc(db, 'users', u.uid), userData);

            // Notify admin
            try {
              await fetch('/api/notify-signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
              });
            } catch (err) {
              console.warn("Sign-up notification failed");
            }
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${u.uid}`);
        }
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Programs', href: '#programs' },
    { name: 'Coaches', href: '#coaches' },
    { name: 'Schedule', href: '#schedule' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#enroll' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? 'bg-black/90 backdrop-blur-xl border-b border-white/10 py-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <a href="#" className="hover:opacity-80 transition-opacity">
          <Logo className="h-10 md:h-12" />
        </a>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-[10px] font-display font-bold uppercase tracking-[0.3em] text-white/70 hover:text-primary transition-all relative group"
            >
              {link.name}
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full shadow-[0_0_10px_rgba(255,0,0,0.5)]" />
            </a>
          ))}
          
          <div className="flex items-center gap-4 pl-4 border-l border-white/10">
            {loading ? (
              <Loader2 className="text-primary animate-spin" size={20} />
            ) : user ? (
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <img 
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                    className="w-10 h-10 rounded-xl border border-white/10 p-0.5 group-hover:border-primary transition-colors cursor-pointer"
                    alt="Profile"
                  />
                  <div className="absolute top-full right-0 mt-3 hidden group-hover:block w-48 pt-2">
                    <div className="bg-secondary/95 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Signed in as</p>
                      <p className="text-white text-xs font-bold truncate mb-3">{user.displayName}</p>
                      <button 
                        onClick={handleLogout}
                        className="w-full py-2 bg-white/5 hover:bg-primary/20 text-white/70 hover:text-primary rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={handleLogin}
                className="flex items-center gap-2 text-[10px] font-display font-bold uppercase tracking-[0.3em] text-white hover:text-primary transition-colors group"
              >
                <LogIn size={18} className="group-hover:scale-110 transition-transform" /> Sign In
              </button>
            )}

            <a 
              href="#enroll" 
              className="px-8 py-3 bg-primary text-white font-display font-bold uppercase text-xs tracking-widest hover:bg-white hover:text-primary transition-all duration-500 shadow-[0_0_20px_rgba(255,0,0,0.3)] hover:shadow-[0_0_35px_rgba(255,0,0,0.5)] rounded-none relative group overflow-hidden"
            >
              <span className="relative z-10">Join Now</span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </a>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex lg:hidden items-center gap-4">
          {!loading && user && (
            <img 
              src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
              className="w-8 h-8 rounded-lg border border-white/10"
              alt="Profile"
            />
          )}
          <button 
            className="text-white p-2 bg-white/5 rounded-lg border border-white/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 lg:hidden bg-black/95 backdrop-blur-2xl z-[60]"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <Logo className="h-10" />
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-white p-2">
                  <X size={28} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto py-10 px-6 flex flex-col gap-8">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href}
                    className="text-3xl font-display font-bold uppercase tracking-widest text-white hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              <div className="p-6 bg-secondary/50 border-t border-white/5 flex flex-col gap-4">
                {user ? (
                  <button 
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    className="w-full py-4 bg-white/5 text-white/50 font-display font-bold uppercase tracking-widest flex items-center justify-center gap-3"
                  >
                    <LogOut size={20} /> Sign Out
                  </button>
                ) : (
                  <button 
                    onClick={() => { handleLogin(); setIsMobileMenuOpen(false); }}
                    className="w-full py-4 bg-white/10 text-white font-display font-bold uppercase tracking-widest flex items-center justify-center gap-3"
                  >
                    <LogIn size={20} /> Sign In
                  </button>
                )}
                <a 
                  href="#enroll" 
                  className="w-full py-5 bg-primary text-white font-display font-bold uppercase text-center tracking-widest shadow-[0_0_20px_rgba(255,0,0,0.3)]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Join Now
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
