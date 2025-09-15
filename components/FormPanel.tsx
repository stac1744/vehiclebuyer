import React, { useState } from 'react';
import type { FormData } from '../types';

interface FormPanelProps {
  onGetQuote: (formData: FormData) => void;
  isLoading: boolean;
}

const FormSection: React.FC<{ title: string; icon: string; children: React.ReactNode }> = ({ title, icon, children }) => (
  <section className="pt-6 border-t border-slate-200 first:pt-0 first:border-none">
    <h2 className="text-slate-700 font-semibold text-base flex items-center gap-3 mb-5">
      <i className={`fas ${icon} text-indigo-500 w-5 text-center`} aria-hidden="true"></i>
      {title}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
      {children}
    </div>
  </section>
);

const InputGroup: React.FC<{ label: string; id: string; error?: string; children: React.ReactNode }> = ({ label, id, error, children }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium mb-1.5 text-slate-600">
      {label}
    </label>
    {children}
    {error && <div className="text-red-600 text-xs mt-1.5">{error}</div>}
  </div>
);

export const FormPanel: React.FC<FormPanelProps> = ({ onGetQuote, isLoading }) => {
  const [formState, setFormState] = useState({
    vin: '',
    mileage: '',
    powertrainCondition: 'Run & Drive',
    hasTitle: 'Yes',
    hasCatalytic: 'Yes',
    hasAluminumWheels: 'Yes',
    hasBattery: 'Yes',
    needsTowing: 'No',
    hasKey: 'Yes',
    sellerName: '',
    sellerEmail: '',
    sellerPhone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'USA',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    if(errors[name]) {
      setErrors(prev => ({...prev, [name]: ''}))
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formState.vin || !/^[A-HJ-NPR-Z0-9]{17}$/i.test(formState.vin)) newErrors.vin = 'Please enter a valid 17-character VIN.';
    if (!formState.mileage || +formState.mileage < 0 || +formState.mileage > 2000000) newErrors.mileage = 'Please enter a valid mileage.';
    if (!formState.sellerName.trim() || formState.sellerName.length < 2) newErrors.sellerName = 'Please enter your full name.';
    if (!formState.sellerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.sellerEmail)) newErrors.sellerEmail = 'Please enter a valid email address.';
    if (!formState.sellerPhone.replace(/\D/g, '') || formState.sellerPhone.replace(/\D/g, '').length < 10) newErrors.sellerPhone = 'Please enter a valid phone number.';
    if (!formState.street.trim() || formState.street.length < 3) newErrors.street = 'Please enter a street address.';
    if (!formState.city.trim() || formState.city.length < 2) newErrors.city = 'Please enter a city.';
    if (!formState.state.trim() || formState.state.length < 2) newErrors.state = 'Please enter a state/province.';
    if (!formState.postalCode.trim() || formState.postalCode.length < 4) newErrors.postalCode = 'Please enter a postal code.';
    if (!formState.country.trim() || formState.country.length < 2) newErrors.country = 'Please enter a country.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const formData: FormData = {
        vin: formState.vin.toUpperCase(),
        mileage: parseInt(formState.mileage, 10),
        powertrainCondition: formState.powertrainCondition,
        hasTitle: formState.hasTitle,
        hasCatalytic: formState.hasCatalytic,
        hasAluminumWheels: formState.hasAluminumWheels,
        hasBattery: formState.hasBattery,
        needsTowing: formState.needsTowing,
        hasKey: formState.hasKey,
        sellerName: formState.sellerName,
        sellerEmail: formState.sellerEmail,
        sellerPhone: formState.sellerPhone,
        sellerAddress: {
          street: formState.street,
          city: formState.city,
          state: formState.state,
          postalCode: formState.postalCode,
          country: formState.country,
        },
      };
      onGetQuote(formData);
    }
  };
  
  const commonInputClasses = `w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-400`;
  const errorInputClasses = `border-red-500 ring-1 ring-red-500 bg-red-50`;

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800">Tell Us About Your Vehicle</h2>
        <p className="text-slate-500 mt-2">Fill out the details below to get your instant AI-powered quote.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200/80">
        <form onSubmit={handleSubmit} noValidate className="space-y-8">
          <FormSection title="Vehicle Information" icon="fa-car">
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                  <InputGroup label="VIN (Vehicle Identification Number)" id="vin" error={errors.vin}>
                    <input type="text" id="vin" name="vin" value={formState.vin} onChange={handleChange} placeholder="Enter 17-character VIN" maxLength={17} required className={`${commonInputClasses} ${errors.vin && errorInputClasses} uppercase`} />
                  </InputGroup>
                  <InputGroup label="Current Mileage" id="mileage" error={errors.mileage}>
                    <input type="number" id="mileage" name="mileage" value={formState.mileage} onChange={handleChange} placeholder="e.g., 125000" min="0" required className={`${commonInputClasses} ${errors.mileage && errorInputClasses}`} />
                  </InputGroup>
              </div>
          </FormSection>
          
          <FormSection title="Vehicle Condition" icon="fa-clipboard-check">
            {Object.entries({
              powertrainCondition: { label: 'Powertrain', options: ['Run & Drive', 'Inoperable', 'Not Running', 'Parts Only'] },
              hasTitle: { label: 'Title?', options: ['Yes', 'No'] },
              hasCatalytic: { label: 'Catalytic Converter?', options: ['Yes', 'No'] },
              hasAluminumWheels: { label: 'Aluminum Wheels?', options: ['Yes', 'No'] },
              hasBattery: { label: 'Battery?', options: ['Yes', 'No'] },
              needsTowing: { label: 'Towing?', options: ['No', 'Yes'] },
              hasKey: { label: 'Key?', options: ['Yes', 'No'] },
            }).map(([key, { label, options }]) => (
              <InputGroup key={key} label={label} id={key}>
                <select id={key} name={key} value={formState[key as keyof typeof formState]} onChange={handleChange} className={commonInputClasses}>
                  {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </InputGroup>
            ))}
          </FormSection>

          <FormSection title="Seller Details" icon="fa-user-check">
            <InputGroup label="Full Name" id="sellerName" error={errors.sellerName}>
              <input type="text" id="sellerName" name="sellerName" value={formState.sellerName} onChange={handleChange} required className={`${commonInputClasses} ${errors.sellerName && errorInputClasses}`} placeholder="Jane Doe" />
            </InputGroup>
            <InputGroup label="Email Address" id="sellerEmail" error={errors.sellerEmail}>
              <input type="email" id="sellerEmail" name="sellerEmail" value={formState.sellerEmail} onChange={handleChange} required className={`${commonInputClasses} ${errors.sellerEmail && errorInputClasses}`} placeholder="you@example.com" />
            </InputGroup>
            <InputGroup label="Phone Number" id="sellerPhone" error={errors.sellerPhone}>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">+1</span>
                <input type="tel" id="sellerPhone" name="sellerPhone" value={formState.sellerPhone} onChange={handleChange} placeholder="(555) 123-4567" required className={`${commonInputClasses} ${errors.sellerPhone && errorInputClasses} pl-7`} />
              </div>
            </InputGroup>
             <InputGroup label="Street Address" id="street" error={errors.street}>
              <input type="text" id="street" name="street" value={formState.street} onChange={handleChange} required className={`${commonInputClasses} ${errors.street && errorInputClasses}`} placeholder="123 Main St" />
            </InputGroup>
            <InputGroup label="City" id="city" error={errors.city}>
              <input type="text" id="city" name="city" value={formState.city} onChange={handleChange} required className={`${commonInputClasses} ${errors.city && errorInputClasses}`} placeholder="Anytown" />
            </InputGroup>
            <InputGroup label="State/Province" id="state" error={errors.state}>
              <input type="text" id="state" name="state" value={formState.state} onChange={handleChange} required className={`${commonInputClasses} ${errors.state && errorInputClasses}`} placeholder="CA" />
            </InputGroup>
            <InputGroup label="Postal Code" id="postalCode" error={errors.postalCode}>
              <input type="text" id="postalCode" name="postalCode" value={formState.postalCode} onChange={handleChange} required className={`${commonInputClasses} ${errors.postalCode && errorInputClasses}`} placeholder="90210" />
            </InputGroup>
            <InputGroup label="Country" id="country" error={errors.country}>
              <input type="text" id="country" name="country" value={formState.country} onChange={handleChange} required className={`${commonInputClasses} ${errors.country && errorInputClasses}`} />
            </InputGroup>
          </FormSection>
          
          <div className="pt-6 border-t border-slate-200">
            <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold py-3.5 px-6 rounded-xl text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin" aria-hidden="true"></i>
                  Calculating...
                </>
              ) : (
                <>
                  <i className="fas fa-wand-magic-sparkles" aria-hidden="true"></i>
                  Generate Instant Quote
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
