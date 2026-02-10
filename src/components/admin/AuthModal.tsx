import React, { useState } from 'react';
import { FaTimes, FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import config from '../../config';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: (token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
    const [email, setEmail] = useState(''); // Just for UI, backend only checks password
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password) {
            setError('Password required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${config.API_URL}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await res.json();

            if (data.success) {
                onLoginSuccess(data.token);
            } else {
                setError(data.message || 'Invalid Password');
            }
        } catch (err) {
            console.error(err);
            setError('Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#111] border border-purple-500/20 w-full max-w-md rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.15)] relative overflow-hidden"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white transition-colors"
                >
                    <FaTimes size={20} />
                </button>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="font-display text-3xl font-bold text-white mb-2">
                            ADMIN ACCESS
                        </h2>
                        <p className="text-gray-400 text-sm">
                            Enter secure password to continue
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Passphrase</label>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && <p className='text-red-500 text-sm text-center'>{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-lg shadow-lg shadow-purple-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="animate-pulse">Verifying...</span>
                            ) : (
                                <>
                                    Access Dashboard <FaArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};
