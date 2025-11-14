import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Link, useSearchParams} from "react-router-dom";
import { routes } from "../constants/routes.ts";

export function VerifyEmailPage() {
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");


    const route = "http://localhost:3000";

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (code.length !== 6) {
            setMessage('Please enter a 6-digit code.');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const response = await axios.post(
                `${route}/email/verify`,
                { email:email,code }
            );
            alert('Email verified successfully!');
            setMessage(response.data.message || '✅ Email verified successfully!');
            window.location.href = routes.LOGIN;
        } catch (error: any) {
            setMessage(error.response?.data?.message || '❌ Invalid or expired code.');
        } finally {
            setIsLoading(false); // 👈 re-enable Verify button
        }
    };

    const handleResend = async () => {
        if (cooldown > 0) return; // safety check

        setIsResending(true);
        setMessage('');

        try {
            const response = await axios.post(
                `${route}/email/resend-verification`,
                {
                    email: email
                }
            ); //odi triba makint local storage i iz statea vadit
            setMessage(response.data.message || '✅ Verification token sent.');

            // ⏲️ Start cooldown (30 seconds)
            setCooldown(30);
        } catch (error: any) {
            setMessage(error.response?.data?.message || '❌ Could not send verification token.');
        } finally {
            setIsResending(false);
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
                            disabled={isLoading} // disable typing while verifying
                        />
                    </div>

                    {/* ✅ Verify button — disabled while waiting for response */}
                    <button
                        type="submit"
                        disabled={isLoading || isResending}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {isLoading ? 'Verifying...' : 'Verify Code'}
                    </button>

                    {/* ✅ Resend button — disabled during cooldown */}
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={isResending || cooldown > 0 || isLoading}
                        className="w-full mt-2 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition disabled:opacity-50"
                    >
                        {isResending
                            ? 'Sending...'
                            : cooldown > 0
                                ? `Resend available in ${cooldown}s`
                                : 'Resend verification token'}
                    </button>
                </form>

                <Link to={routes.LOGIN}>
                    <button className="mt-4 w-full text-sm text-blue-600 hover:underline">
                        Back To Login
                    </button>
                </Link>

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
