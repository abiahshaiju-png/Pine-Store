import React, { useState, useEffect } from 'react';
import { PaymentSettings } from '../types';

interface SettingsTabProps {
    settings: PaymentSettings;
    onSave: (settings: PaymentSettings) => void;
}

const FormInput = ({ label, id, ...props }: { label: string; id: string; [key: string]: any }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="mt-1">
            <input
                id={id}
                name={id}
                className="block w-full rounded-md shadow-sm sm:text-sm focus:ring-green-500 focus:border-green-500 border-gray-300"
                {...props}
            />
        </div>
    </div>
);


export const SettingsTab: React.FC<SettingsTabProps> = ({ settings, onSave }) => {
    const [formState, setFormState] = useState<PaymentSettings>(settings);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        setFormState(settings);
    }, [settings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formState);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800">Payment Gateway Settings</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Enter your credentials for your payment provider (e.g., Stripe, Razorpay). This is a demo and values are stored locally.
                    </p>
                </div>
                
                <FormInput
                    label="Payment Gateway API Key"
                    id="gatewayApiKey"
                    type="password"
                    placeholder="sk_test_..."
                    value={formState.gatewayApiKey}
                    onChange={handleChange}
                />
            </form>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800">Bank Account for Payouts</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        This is the bank account where you will receive payments from your sales.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                        label="Account Holder Name"
                        id="bankAccountName"
                        placeholder="The Pine Store"
                        value={formState.bankAccountName}
                        onChange={handleChange}
                    />
                    <FormInput
                        label="Account Number"
                        id="bankAccountNumber"
                        placeholder="0000123456789"
                        value={formState.bankAccountNumber}
                        onChange={handleChange}
                    />
                    <FormInput
                        label="IFSC Code"
                        id="bankIfscCode"
                        placeholder="BANK0001234"
                        value={formState.bankIfscCode}
                        onChange={handleChange}
                        className="md:col-span-2"
                    />
                </div>
                 <div className="flex items-center justify-end gap-4 pt-4">
                    {showSuccess && (
                        <p className="text-green-600 font-medium" role="status">
                            Settings saved successfully!
                        </p>
                    )}
                    <button
                        type="submit"
                        className="py-2 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                        Save Settings
                    </button>
                </div>
            </form>
        </div>
    );
};
