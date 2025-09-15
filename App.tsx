import React, { useState, useCallback, useRef } from 'react';
import { FormPanel } from './components/FormPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { Toast } from './components/Toast';
import type { FormData, QuoteData, ToastState } from './types';
import { getVehicleQuote } from './services/geminiService';
import { AppState } from './types';

const Feature: React.FC<{icon: string; title: string; children: React.ReactNode}> = ({icon, title, children}) => (
    <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mb-4 text-2xl">
            <i className={`fas ${icon}`}></i>
        </div>
        <div>
            <h3 className="font-bold text-lg text-slate-800">{title}</h3>
            <p className="text-sm text-slate-500 mt-1">{children}</p>
        </div>
    </div>
)

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INITIAL);
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'info' });
  const formSectionRef = useRef<HTMLDivElement>(null);

  const showToast = (message: string, type: ToastState['type'] = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 4000);
  };

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleGetQuote = useCallback(async (formData: FormData) => {
    setAppState(AppState.LOADING);
    setQuoteData(null);
    setError(null);

    try {
      const result = await getVehicleQuote(formData);
      setQuoteData(result);
      setAppState(AppState.SUCCESS);
      showToast('Quote generated successfully!', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error('Failed to get quote:', errorMessage);
      setError(errorMessage);
      setAppState(AppState.ERROR);
      showToast(errorMessage, 'error');
    }
  }, []);

  const handleNewQuote = () => {
    setAppState(AppState.INITIAL);
    setQuoteData(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white min-h-screen text-slate-900 antialiased">
      <Toast message={toast.message} type={toast.type} show={toast.show} />
      <main>
        {/* HERO SECTION */}
        <section className="relative text-center py-24 px-4 bg-white">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 -z-10"></div>
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-800">Instant, AI-Powered Cash Offers for Your Vehicle.</h1>
              <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-slate-600">Get a fair, data-driven valuation for your car in seconds. No haggling, no hassle.</p>
              <button onClick={scrollToForm} className="mt-8 bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold py-3.5 px-8 rounded-full text-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                Get My Free Quote
              </button>
            </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-800">A Smarter Way to Sell Your Car</h2>
              <p className="mt-2 text-slate-500 max-w-2xl mx-auto">Our process is simple, transparent, and powered by cutting-edge AI to give you the best possible offer.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
               <Feature icon="fa-keyboard" title="1. Submit Details">
                  Provide your vehicle's VIN, mileage, and current condition using our simple form.
              </Feature>
              <Feature icon="fa-cogs" title="2. AI Analysis">
                  Our advanced AI evaluates your vehicle against real-time market data in seconds.
              </Feature>
              <Feature icon="fa-tag" title="3. Receive Your Quote">
                  Get a detailed, transparent valuation and a firm offer right on your screen.
              </Feature>
            </div>
          </div>
        </section>

        {/* DYNAMIC QUOTE SECTION */}
        <div ref={formSectionRef} className="bg-white py-20 scroll-mt-10">
          { (appState === AppState.INITIAL || appState === AppState.LOADING) && 
            <FormPanel onGetQuote={handleGetQuote} isLoading={appState === AppState.LOADING} /> 
          }
          { (appState === AppState.SUCCESS || appState === AppState.ERROR) && 
            <ResultsPanel 
              appState={appState}
              quoteData={quoteData}
              error={error}
              onNewQuote={handleNewQuote}
            />
          }
        </div>
      </main>

       {/* FOOTER */}
      <footer className="bg-slate-800 text-slate-400 text-center py-8">
          <div className="max-w-6xl mx-auto px-4">
            <p>&copy; {new Date().getFullYear()} Vehicle Liquidation Application. All rights reserved.</p>
          </div>
      </footer>
    </div>
  );
};

export default App;
