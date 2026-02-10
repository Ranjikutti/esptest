import React, { useState } from 'react';
import { FaCheck, FaCloudUploadAlt, FaArrowRight, FaShieldAlt, FaTimes, FaQrcode } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface TicketPrices {
    diamond: number;
    gold: number;
    silver: number;
}

interface TicketPortalProps {
    prices: TicketPrices;
    upiId: string;
    qrCodeUrl: string;
    onClose: () => void;
}

export const TicketPortal: React.FC<TicketPortalProps> = ({ prices, upiId, qrCodeUrl, onClose }) => {
    const [selectedTier, setSelectedTier] = useState<string | null>(null);
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Fallback prices to avoid crashes if content not loaded
    const safePrices = prices || { silver: 0, gold: 0, diamond: 0 };

    const tiers = [
        {
            name: 'Silver',
            price: safePrices.silver,
            color: 'from-gray-300 to-slate-400',
            features: ['Access to Cultural Events', 'General Entry', 'Food Coupons (Start)']
        },
        {
            name: 'Gold',
            price: safePrices.gold,
            color: 'from-yellow-300 to-amber-500',
            features: ['Access to Proshows', 'Front Row Seats (Zone B)', 'Merchandise Kit', 'All Silver Benefits']
        },
        {
            name: 'Diamond',
            price: safePrices.diamond,
            color: 'from-cyan-300 to-blue-500',
            features: ['VIP Access All Areas', 'Meet & Greet', 'Backstage Access', 'Premium Food', 'All Gold Benefits']
        }
    ];

    const handlePaymentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPaymentProof(e.target.files[0]);
        }
    };

    const handleSubmit = () => {
        if (!paymentProof) return;
        setIsSubmitting(true);
        // Simulate submission - in real app would verify this
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 2000);
    };

    if (isSuccess) {
        return (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-[#111] border border-green-500/30 p-8 rounded-2xl max-w-md w-full text-center"
                >
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaShieldAlt size={40} className="text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Registration Successful!</h2>
                    <p className="text-gray-400 mb-6">
                        Your payment proof for the <span className="text-green-400 font-bold">{selectedTier} Pass</span> has been
                        submitted. We will verify and email your ticket shortly.
                    </p>
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200"
                    >
                        Return to Home
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md overflow-y-auto">
            <div className="min-h-screen py-12 px-4 flex flex-col items-center">
                <div className="w-full max-w-6xl relative">
                    <button
                        onClick={onClose}
                        className="absolute top-0 right-0 p-2 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors"
                    >
                        <FaTimes size={24} />
                    </button>

                    <div className="text-center mb-12">
                        <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                            CHOOSE YOUR <span className="text-purple-500">ACCESS</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Select a pass tier to unlock the ultimate fest experience. Verify your student status for potential
                            discounts.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {tiers.map((tier) => (
                            <div
                                key={tier.name}
                                onClick={() => setSelectedTier(tier.name)}
                                className={`relative bg-[#111] rounded-2xl p-6 border transition-all cursor-pointer group ${selectedTier === tier.name
                                    ? 'border-purple-500 scale-105 shadow-[0_0_30px_rgba(168,85,247,0.3)]'
                                    : 'border-white/10 hover:border-white/30'
                                    }`}
                            >
                                <div className={`absolute inset-x-0 top-0 h-2 rounded-t-2xl bg-gradient-to-r ${tier.color}`} />
                                <h3 className="text-2xl font-bold text-white mt-4">{tier.name}</h3>
                                <div className="text-3xl font-bold text-white mt-2 mb-6">₹{tier.price}</div>

                                <ul className="space-y-3 mb-8">
                                    {tier.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3 text-gray-400 text-sm">
                                            <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                                                <FaCheck size={12} className="text-purple-400" />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div
                                    className={`w-full py-3 rounded-lg text-center font-bold transition-colors ${selectedTier === tier.name
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-white/5 text-gray-400 group-hover:bg-white/10'
                                        }`}
                                >
                                    {selectedTier === tier.name ? 'Selected' : 'Select Pass'}
                                </div>
                            </div>
                        ))}
                    </div>

                    <AnimatePresence>
                        {selectedTier && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="max-w-3xl mx-auto bg-[#1a1a1a] border border-white/10 rounded-2xl p-8"
                            >
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <FaCloudUploadAlt size={20} className="text-purple-400" />
                                    Upload Payment Proof
                                </h3>

                                <div className="flex flex-col md:flex-row gap-8 items-start mb-6">
                                    <div className="bg-black/40 p-6 rounded-xl border border-white/5 flex-1 w-full">
                                        <div className="text-center mb-6">
                                            <p className="text-sm text-gray-400 mb-1">Total Amount to Pay</p>
                                            <p className="text-4xl font-bold text-white">
                                                ₹{tiers.find((t) => t.name === selectedTier)?.price}
                                            </p>
                                        </div>

                                        {qrCodeUrl && (
                                            <div className="flex justify-center mb-4">
                                                <div className="bg-white p-2 rounded-lg">
                                                    <img src={qrCodeUrl} alt="Payment QR" className="w-32 h-32 object-contain" />
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-center gap-2 bg-white/5 p-3 rounded-lg border border-white/5">
                                            <div className="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center">
                                                <FaQrcode size={16} className="text-purple-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400">UPI ID</p>
                                                <p className="font-mono text-sm text-purple-300 select-all">{upiId}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 w-full flex flex-col justify-between self-stretch">
                                        <label
                                            className={`flex flex-col items-center justify-center w-full flex-1 min-h-[160px] border-2 border-dashed rounded-lg cursor-pointer transition-colors ${paymentProof ? 'border-green-500 bg-green-500/10' : 'border-gray-600 hover:border-purple-500 hover:bg-white/5'
                                                }`}
                                        >
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center p-4">
                                                {paymentProof ? (
                                                    <>
                                                        <FaCheck className="w-10 h-10 text-green-500 mb-3" />
                                                        <p className="text-sm text-green-400 font-bold">{paymentProof.name}</p>
                                                        <p className="text-xs text-green-500/70 mt-1">Click to change</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaCloudUploadAlt className="w-10 h-10 text-gray-400 mb-3" />
                                                        <p className="text-sm text-gray-300 font-bold mb-1">Upload Screenshot</p>
                                                        <p className="text-xs text-gray-500">Supported: JPG, PNG</p>
                                                    </>
                                                )}
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" onChange={handlePaymentUpload} />
                                        </label>

                                        <button
                                            onClick={handleSubmit}
                                            disabled={!paymentProof || isSubmitting}
                                            className="w-full py-4 mt-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white shadow-lg shadow-purple-900/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                        >
                                            {isSubmitting ? 'Verifying...' : 'Complete Purchase'} <FaArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-center text-xs text-gray-500">
                                    Please ensure the Transaction ID is visible in your screenshot. Verification may take up to 24 hours.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
