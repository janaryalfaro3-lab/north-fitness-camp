import React from 'react';
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, Clock, Twitter, MessageCircle, ShieldCheck, Award, ThumbsUp } from 'lucide-react';
import { motion } from 'motion/react';
import { Logo } from './Logo';
import { QRCodeSVG } from 'qrcode.react';

export const Footer: React.FC = () => {
  const socialLinks = [
    { 
      icon: <Facebook size={24} />, 
      href: 'https://www.facebook.com/northfitnesscamp', 
      label: 'Facebook',
      highlight: true 
    },
    { icon: <Instagram size={20} />, href: 'https://www.instagram.com/northfitnesscamp', label: 'Instagram' },
    { icon: <Twitter size={20} />, href: 'https://twitter.com/northfitness', label: 'Twitter' },
    { icon: <Youtube size={20} />, href: 'https://www.youtube.com/@northfitnesscamp', label: 'Youtube' },
    { icon: <MessageCircle size={20} />, href: 'https://wa.me/639629605748', label: 'WhatsApp' },
  ];

  return (
    <footer className="bg-black pt-24 pb-12 relative overflow-hidden border-t border-white/10">
      {/* Background Grid Lines */}
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div>
            <Logo className="h-20 mb-8" />
            <p className="text-gray-400 font-display font-bold text-sm mb-4 uppercase tracking-widest italic">
              "Train hard, stay consistent — only at North Fitness Camp!"
            </p>
            <p className="text-gray-500 mb-8 max-w-xs leading-relaxed text-sm">
              The premier fitness destination in Tarlac City. A 2-floor, 600sqm facility with top-tier equipment. Rebranded & Reloaded.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`flex items-center justify-center transition-all group shadow-lg overflow-hidden relative ${
                    social.highlight 
                      ? 'w-16 h-16 rounded-2xl bg-primary text-white border-2 border-white/20 hover:scale-110 shadow-[0_0_30px_rgba(255,0,0,0.4)]' 
                      : 'w-10 h-10 rounded-xl border border-white/10 bg-secondary text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5'
                  }`}
                  aria-label={social.label}
                >
                  {social.highlight && (
                    <motion.div 
                      className="absolute inset-0 bg-white/20"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                        repeatDelay: 2
                      }}
                    />
                  )}
                  <span className="relative z-10 group-hover:scale-110 transition-transform">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-display font-bold mb-8 text-white uppercase tracking-[0.3em]">QUICK LINKS</h4>
            <ul className="space-y-4">
              {['Programs', 'Coaches', 'Schedule', 'Testimonials', 'Enroll'].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="text-gray-500 hover:text-primary transition-colors text-sm font-medium flex items-center gap-2 group">
                    <span className="w-0 h-0.5 bg-primary group-hover:w-3 transition-all" />
                    {link === 'Enroll' ? 'Join Now' : link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-display font-bold mb-8 text-white uppercase tracking-[0.3em]">CONTACT INFO</h4>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <MapPin className="text-primary shrink-0" size={20} />
                <div className="text-gray-500 text-sm">
                  <p className="text-white font-bold mb-1">NORTH FITNESS CAMP</p>
                  <p>McArthur Highway, San Sebastian, Tarlac City</p>
                  <p className="text-[10px] mt-1 italic">Beside Hyundai, front of Hotel SOGO 🚗📍</p>
                  <p className="text-primary font-bold mt-2">Feel free to drop by! Stay Healthy! 😊</p>
                </div>
              </li>
              <li className="flex gap-4">
                <Phone className="text-primary shrink-0" size={20} />
                <span className="text-gray-500 text-sm">0962-960-5748</span>
              </li>
              <li className="flex gap-4">
                <Mail className="text-primary shrink-0" size={20} />
                <span className="text-gray-500 text-sm">thefitnesscamp23@gmail.com</span>
              </li>
              <li className="flex gap-4">
                <Clock className="text-primary shrink-0" size={20} />
                <div className="text-gray-500 text-sm">
                  <p>Mon-Fri: 6AM - 10PM</p>
                  <p>Sat: 6AM - 6PM</p>
                  <p className="text-primary font-bold">Sun: CLOSED</p>
                </div>
              </li>
            </ul>

            {/* Professional QR Code Section */}
            <div className="mt-8 pt-8 border-t border-white/10 hidden lg:block">
              <h4 className="text-[10px] font-display font-bold mb-4 text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Scan to Save Contact
              </h4>
              <div className="bg-white p-3 rounded-2xl inline-block shadow-[0_0_20px_rgba(255,0,0,0.15)] group relative overflow-hidden transition-all hover:scale-105">
                <div className="absolute inset-0 border-2 border-primary/20 rounded-2xl pointer-events-none group-hover:border-primary/50 transition-colors" />
                <QRCodeSVG
                  value="https://wa.me/639629605748"
                  size={120}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="H"
                  marginSize={1}
                  imageSettings={{
                    src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=200&auto=format&fit=crop",
                    x: undefined,
                    y: undefined,
                    height: 28,
                    width: 28,
                    excavate: true,
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-display font-bold mb-8 text-white uppercase tracking-[0.3em]">LOCATION</h4>
            <div className="w-full h-48 bg-black border border-white/10 grayscale hover:grayscale-0 transition-all duration-500 overflow-hidden rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] mb-4">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3846.54321!2d120.589!3d15.48!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396c1234567890!2sSan%20Sebastian%2C%20Tarlac%20City!5e0!3m2!1sen!2sph!4v1234567890" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
              📍 Front of Hotel Sogo, beside Hyundai san sebastian tarlac city.
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="py-10 border-t border-white/5 flex flex-wrap justify-center items-center gap-8 md:gap-16">
          <div className="flex items-center gap-4 opacity-80 hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.2)]">
              <ShieldCheck className="text-yellow-500" size={24} />
            </div>
            <div className="text-left">
              <p className="text-white text-xs font-bold uppercase tracking-widest">DTI Registered</p>
              <p className="text-yellow-500/70 text-[10px] uppercase tracking-tighter">Legitimate Business</p>
            </div>
          </div>
          <div className="flex items-center gap-4 opacity-80 hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.2)]">
              <Award className="text-yellow-500" size={24} />
            </div>
            <div className="text-left">
              <p className="text-white text-xs font-bold uppercase tracking-widest">Certified Coaches</p>
              <p className="text-yellow-500/70 text-[10px] uppercase tracking-tighter">Elite Specialists</p>
            </div>
          </div>
          <div className="flex items-center gap-4 opacity-80 hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.2)]">
              <ThumbsUp className="text-yellow-500" size={24} />
            </div>
            <div className="text-left">
              <p className="text-white text-xs font-bold uppercase tracking-widest">Top Rated Facility</p>
              <p className="text-yellow-500/70 text-[10px] uppercase tracking-tighter">Trusted in Tarlac</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/60 text-[10px] uppercase tracking-[0.3em] font-bold">
            © {new Date().getFullYear()} NORTH FITNESS CAMP. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-gray-600 text-[10px] uppercase tracking-[0.3em] font-bold hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-600 text-[10px] uppercase tracking-[0.3em] font-bold hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
