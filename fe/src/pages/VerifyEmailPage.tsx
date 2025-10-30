import React, { useState } from 'react';
import axios from 'axios';

export function VerifyEmailPage() {
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (code.length !== 6) {
            setMessage('Please enter a 6-digit code.');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const route="http://localhost:3000";
            const response = await axios.post(`${route}/email/verify`, { code },{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("accessToken")}`
                }
            });
            setMessage(response.data.message || '✅ Email verified successfully!');
        } catch (error: any) {
            setMessage(error.response?.data?.message || '❌ Invalid or expired code.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
                <h1 className="text-2xl font-semibold text-center mb-6">
                    Email Verification
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Enter your 6-digit code
                        </label>
                        <input
                            type="text"
                            value={code}
                            maxLength={6}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="------"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {isLoading ? 'Verifying...' : 'Verify Code'}
                    </button>
                </form>

                {message && (
                    <p
                        className={`text-center mt-4 ${
                            message.includes('✅') ? 'text-green-600' : 'text-red-500'
                        }`}
                    >
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}
