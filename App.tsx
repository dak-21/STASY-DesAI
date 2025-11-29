import React from 'react';
import { Shield, Eye, Radio, Zap, Activity, Users, Lock, ChevronRight, PlayCircle, MapPin, Building2, Music, Flag, Upload } from 'lucide-react';
import { Header } from './components/Header';
import { DashboardDemo } from './components/DashboardDemo';

export default function App() {
  return (
    <div className="min-h-screen font-sans text-brand-dark">
      <Header />
      
      {/* 1. Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-brand-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#FFD70030_0%,_transparent_40%)]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold mb-8 animate-slide-up">
              <span className="w-2 h-2 bg-yellow-600 rounded-full animate-pulse"></span>
              Live Crowd Intelligence v2.0
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-brand-dark mb-6 leading-tight animate-slide-up" style={{animationDelay: '0.1s'}}>
              AI That Prevents Stampedes <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600">Before They Spread.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto animate-slide-up" style={{animationDelay: '0.2s'}}>
              STASY analyzes video feeds to detect dangerous surges and instantly alert authorities. Upload footage to simulate our crowd risk engine.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{animationDelay: '0.3s'}}>
              <a href="#demo" className="px-8 py-4 bg-brand-dark text-white rounded-full font-bold text-lg hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl flex items-center gap-2">
                <Upload size={20} /> Upload & Analyze
              </a>
              <a href="#how-it-works" className="px-8 py-4 bg-white text-brand-dark border-2 border-gray-100 rounded-full font-bold text-lg hover:border-brand-yellow hover:bg-yellow-50 transition-all flex items-center gap-2">
                <PlayCircle size={20} /> How It Works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How It Works */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Autonomous Crowd Safety</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Seamlessly integrates with your existing infrastructure to provide military-grade situational awareness.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-200 border-t-2 border-dashed border-gray-300 z-0"></div>

            {[
              { icon: Eye, title: "1. Upload / Stream", desc: "Ingest video footage from CCTV or drone feeds for instant processing." },
              { icon: Activity, title: "2. Detect", desc: "AI identifies abnormal surges, bottlenecks, and compression risks instantly." },
              { icon: Radio, title: "3. Alert", desc: "Automatically routes coordinates and action plans to nearest police & medical units." }
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border-2 border-transparent group-hover:border-brand-yellow">
                  <step.icon className="w-10 h-10 text-brand-dark" />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Live Demo Section */}
      <section id="demo" className="py-24 bg-brand-dark text-white relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 bg-brand-yellow rounded-full blur-[100px]"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600 rounded-full blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <div className="flex items-center gap-2 text-brand-yellow font-mono text-sm mb-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                </span>
                SYSTEM ACTIVE
              </div>
              <h2 className="text-4xl font-display font-bold">Video Threat Analysis</h2>
              <p className="text-gray-400 mt-2">Upload footage to run the Crowd Density Engine</p>
            </div>
            <div className="mt-4 md:mt-0">
               <button className="text-sm border border-gray-700 hover:border-brand-yellow px-4 py-2 rounded-lg transition-colors text-gray-300">
                  View Full Dashboard
               </button>
            </div>
          </div>

          <DashboardDemo />
          
        </div>
      </section>

      {/* 4. Technology Grid */}
      <section id="technology" className="py-24 bg-white">
        <div className="container mx-auto px-6">
           <div className="grid lg:grid-cols-2 gap-16 items-center">
             <div>
               <h2 className="text-4xl font-display font-bold mb-6">Built on Advanced <br/>Computer Vision</h2>
               <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                 STASY uses proprietary motion pattern recognition to differentiate between normal crowd flow and dangerous compression waves. Our risk scoring system adapts to venue topology in real-time.
               </p>
               
               <div className="space-y-6">
                 {[
                   { title: "Predictive Modeling", desc: "Forecasts crowd movement 15 minutes in advance." },
                   { title: "Privacy First", desc: "Analyzes silhouettes and vectors, not faces. GDPR Compliant." },
                   { title: "Latency < 200ms", desc: "Edge computing capabilities for instant alert generation." }
                 ].map((item, i) => (
                   <div key={i} className="flex gap-4">
                     <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center shrink-0">
                       <Zap className="w-6 h-6 text-yellow-600" />
                     </div>
                     <div>
                       <h4 className="font-bold text-lg">{item.title}</h4>
                       <p className="text-gray-600">{item.desc}</p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 translate-y-8">
                  <div className="bg-gray-900 p-6 rounded-2xl text-white">
                    <div className="text-4xl font-bold text-brand-yellow mb-2">99.8%</div>
                    <div className="text-sm text-gray-400">Detection Accuracy</div>
                  </div>
                  <div className="bg-yellow-100 p-6 rounded-2xl">
                    <div className="text-4xl font-bold text-gray-900 mb-2">3s</div>
                    <div className="text-sm text-gray-600">Average Alert Time</div>
                  </div>
                </div>
                <div className="space-y-4">
                   <div className="bg-gray-100 p-6 rounded-2xl">
                    <div className="text-4xl font-bold text-gray-900 mb-2">500+</div>
                    <div className="text-sm text-gray-600">Events Monitored</div>
                  </div>
                   <div className="bg-gray-900 p-6 rounded-2xl text-white">
                    <div className="text-4xl font-bold text-brand-yellow mb-2">24/7</div>
                    <div className="text-sm text-gray-400">Autonomous Uptime</div>
                  </div>
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* 6. Use Cases */}
      <section id="use-cases" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold mb-4">Protecting Every Gathering</h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Music, title: "Music Festivals", desc: "Prevent stage rush and mosh pit density risks." },
              { icon: Building2, title: "Stadiums", desc: "Manage entry/exit bottlenecks effectively." },
              { icon: Flag, title: "Political Rallies", desc: "Monitor VIP zones and large scale movements." },
              { icon: MapPin, title: "Religious Events", desc: "Safe pilgrimage and procession management." }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 border border-gray-100">
                <div className="w-12 h-12 bg-gray-900 text-white rounded-lg flex items-center justify-center mb-6">
                  <item.icon size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Integrations & Security */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 text-center">
            <div className="flex flex-col md:flex-row justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2 text-xl font-bold text-gray-400"><Users /> PartnerNet</div>
                <div className="flex items-center gap-2 text-xl font-bold text-gray-400"><Lock /> SecureCam</div>
                <div className="flex items-center gap-2 text-xl font-bold text-gray-400"><Activity /> CityGrid</div>
                <div className="flex items-center gap-2 text-xl font-bold text-gray-400"><Eye /> VisionAI</div>
            </div>
            
            <div className="mt-20 inline-flex items-center gap-2 text-green-600 bg-green-50 px-6 py-3 rounded-full text-sm font-semibold">
                <Shield className="w-5 h-5" />
                Enterprise Grade Security & GDPR Compliant
            </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-yellow">
        <div className="container mx-auto px-6 text-center">
           <h2 className="text-4xl font-display font-bold text-brand-dark mb-8">Ready to secure your next event?</h2>
           <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-8 py-4 bg-brand-dark text-white rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform">
                Get Started Now
              </button>
              <button className="px-8 py-4 bg-white text-brand-dark rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform">
                Talk to Sales
              </button>
           </div>
        </div>
      </section>
      
      <footer className="bg-brand-dark text-gray-400 py-12 text-center text-sm">
        <p>&copy; 2024 Team desAI. All rights reserved.</p>
      </footer>
    </div>
  );
}