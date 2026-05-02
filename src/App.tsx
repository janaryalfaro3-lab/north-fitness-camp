/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Stats } from './components/Stats';
import { Programs } from './components/Programs';
import { Coaches } from './components/Coaches';
import { Schedule } from './components/Schedule';
import { Testimonials } from './components/Testimonials';
import { EnrollmentForm } from './components/EnrollmentForm';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { PageLoader, FloatingActions } from './components/FloatingActions';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Amenities } from './components/Amenities';
import { ChatBot } from './components/ChatBot';
import { BookingCalendar } from './components/BookingCalendar';

export default function App() {
  return (
    <ErrorBoundary>
      <div className="relative min-h-screen bg-zinc-950 text-white selection:bg-primary selection:text-background">
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,0,0,0.05),transparent_50%)] pointer-events-none" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_0%_50%,rgba(255,100,0,0.02),transparent_40%)] pointer-events-none" />
        <PageLoader />
        <Navbar />
        
        <main>
          <Hero />
          <About />
          <Amenities />
          <Stats />
          <Programs />
          <Coaches />
          <BookingCalendar />
          <Schedule />
          <Testimonials />
          <EnrollmentForm />
          <Newsletter />
        </main>
        
        <Footer />
        <FloatingActions />
        <ChatBot />
      </div>
    </ErrorBoundary>
  );
}
