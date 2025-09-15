import React from 'react';
import type { QuoteData } from '../types';
import { AppState } from '../types';
import { ActionButton } from './ActionButton';

interface ResultsPanelProps {
  appState: AppState;
  quoteData: QuoteData | null;
  error: string | null;
  onNewQuote: () => void;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

const ErrorState: React.FC<{ error: string | null; onNewQuote: () => void }> = ({ error, onNewQuote }) => (
    <div className="flex flex-col justify-center items-center text-center h-full p-4 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-4xl mb-6">
            <i className="fas fa-xmark"></i>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Valuation Failed</h2>
        <p className="text-slate-500 mt-2 max-w-sm">
            We couldn't generate a quote. {error || 'An unexpected error occurred.'}
        </p>
        <div className="mt-8 w-full max-w-xs">
            <ActionButton onClick={onNewQuote} icon="fa-arrow-rotate-left" text="Try Again" className="bg-slate-700 hover:bg-slate-800 text-white w-full" />
        </div>
    </div>
);

const StatCard: React.FC<{title: string, value: string, icon: string, iconColor: string}> = ({title, value, icon, iconColor}) => (
    <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-center gap-4 transition-all hover:border-slate-300 hover:shadow-sm">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-opacity-10 ${iconColor.replace('text-', 'bg-')}`}>
            <i className={`fas ${icon} ${iconColor}`}></i>
        </div>
        <div>
            <div className="text-sm text-slate-500">{title}</div>
            <div className="font-bold text-lg text-slate-800">{value}</div>
        </div>
    </div>
)

const SuccessState: React.FC<{ quoteData: QuoteData; onNewQuote: () => void }> = ({ quoteData, onNewQuote }) => (
    <div className="animate-fade-in">
        <header className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Your Quote is Ready!</h2>
            <p className="text-slate-500 mt-1">{`${quoteData.vehicle_year} ${quoteData.vehicle_make} ${quoteData.vehicle_model}`}</p>
        </header>
        
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-center rounded-3xl p-8 mb-8 shadow-2xl shadow-indigo-200">
            <div className="text-lg font-medium opacity-80">Final Vehicle Value</div>
            <div className="text-5xl lg:text-6xl font-extrabold my-2 tracking-tight">{formatCurrency(quoteData.final_vehicle_value)}</div>
            <p className="text-sm opacity-70">This is our estimated offer for your vehicle.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <StatCard title="Gross Value" value={formatCurrency(quoteData.gross_vehicle_value)} icon="fa-sack-dollar" iconColor="text-green-500" />
            <StatCard title="Total Deductions" value={formatCurrency(quoteData.total_deductions)} icon="fa-arrow-trend-down" iconColor="text-red-500" />
        </div>
        
        {quoteData.deductions && quoteData.deductions.length > 0 && (
            <div>
                <h3 className="font-bold text-slate-700 mb-3 text-lg">Deduction Details</h3>
                <ul className="space-y-2 text-sm bg-white p-4 rounded-xl border border-slate-200/80">
                    {quoteData.deductions.map((d, i) => (
                        <li key={i} className="flex justify-between items-center p-2.5 rounded-lg hover:bg-slate-50">
                            <span className="text-slate-600">{d.reason}</span>
                            <span className="font-bold text-slate-800">{formatCurrency(d.amount)}</span>
                        </li>
                    ))}
                </ul>
            </div>
        )}
        
        <div className="mt-8 border-t border-slate-200 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ActionButton onClick={() => alert('Offer Accepted! We will be in touch shortly.')} icon="fa-check-circle" text="Accept Quote" className="bg-green-600 hover:bg-green-700 text-white"/>
                <ActionButton onClick={onNewQuote} icon="fa-arrow-rotate-left" text="Start New Quote" className="bg-slate-200 hover:bg-slate-300 text-slate-700"/>
            </div>
        </div>
    </div>
);


export const ResultsPanel: React.FC<ResultsPanelProps> = ({ appState, quoteData, error, onNewQuote }) => {
  const renderContent = () => {
    switch (appState) {
      case AppState.SUCCESS:
        return quoteData ? <SuccessState quoteData={quoteData} onNewQuote={onNewQuote} /> : <ErrorState error="Quote data is missing." onNewQuote={onNewQuote} />;
      case AppState.ERROR:
        return <ErrorState error={error} onNewQuote={onNewQuote} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto px-4">
      {renderContent()}
    </div>
  );
};
