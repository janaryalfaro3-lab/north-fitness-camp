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
import { PromoVideo } from './components/PromoVideo';

export default function App() {
  return (
    <ErrorBoundary>
      <div className="relative min-h-screen bg-background text-white selection:bg-primary selection:text-background">
        <PageLoader />
        <Navbar />
        
        <main>
          <Hero />
          <PromoVideo />
          <About />
          <Amenities />
          <Stats />
          <Programs />
          <Coaches />
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
