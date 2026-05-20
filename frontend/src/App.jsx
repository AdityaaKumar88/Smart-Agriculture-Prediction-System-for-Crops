import './index.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import CropYield from './components/CropYield';
import SoilHealth from './components/SoilHealth';
import Weather from './components/Weather';
import IndiaMap from './components/IndiaMap';
import Analytics from './components/Analytics';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';

export default function App() {
  return (
    <div className="min-h-screen bg-[#030b05]">
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <CropYield />
        <SoilHealth />
        <Weather />
        <IndiaMap />
        <Analytics />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
