import React, { useState } from 'react';
import { FaCloudUploadAlt, FaCheck, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import config from '../../config';
import { Event } from '../../types/admin';

interface RegistrationFormProps {
    email?: string;
    onSubmit: (data: any) => void;
    selectedEvent?: Event | null; // Pass selected Event
    onClose?: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ email = '', onSubmit, selectedEvent, onClose }) => {
    const [formData, setFormData] = useState({
        email,
        isVeltechStudent: false,
        name: '',
        phone: '',
        degree: '',
        course: '',
        year: '',
        college: '',
        vmNumber: '',
        idCardUrl: '',
        paymentScreenshotUrl: '',
        eventId: selectedEvent?.id || '',
        eventName: selectedEvent?.title || 'General Pass'
    });

    const [uploadingId, setUploadingId] = useState(false);
    const [uploadingPayment, setUploadingPayment] = useState(false);

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => {
            const updates: any = { ...prev, [field]: value };
            // Auto-fill college for Vel Tech students
            if (field === 'isVeltechStudent' && value === true) {
                updates.college = 'Vel Tech Multitech';
            }
            if (field === 'isVeltechStudent' && value === false) {
                updates.college = '';
                updates.vmNumber = '';
                updates.idCardUrl = '';
            }
            return updates;
        });
    };

    const uploadFile = async (file: File, type: 'id' | 'payment') => {
        if (!file) return;

        const setUploading = type === 'id' ? setUploadingId : setUploadingPayment;
        setUploading(true);

        const data = new FormData();
        data.append('file', file);
        data.append('folder', 'registrations');

        try {
            const res = await fetch(`${config.API_URL}/upload`, {
                method: 'POST',
                body: data
            });
            const response = await res.json();

            if (response.success) {
                // Backend now returns full MediaAsset object in data, or url in root
                const fileUrl = response.data?.url || response.url;

                setFormData(prev => ({
                    ...prev,
                    [type === 'id' ? 'idCardUrl' : 'paymentScreenshotUrl']: fileUrl
                }));
            } else {
                alert("Upload failed. Please try again.");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Error uploading file.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.isVeltechStudent && (!formData.vmNumber || !formData.idCardUrl)) {
            alert("Vel Tech students must provide VM Number and upload ID Card.");
            return;
        }
        // Only require payment screenshot if it's NOT a free event (or logic can be adjusted based on event type)
        // For now assuming all registrations require payment proof unless free
        if (!formData.isVeltechStudent && (!formData.college || !formData.paymentScreenshotUrl)) {
            alert("Please provide College Name and Payment Screenshot.");
            return;
        }
        if (!formData.name || !formData.phone || !formData.degree || !formData.course) {
            alert("Please fill all required fields");
            return;
        }
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#111] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl my-8 relative"
            >
                <div className="p-6 md:p-8 border-b border-white/10">
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-white">Complete Your Registration</h2>
                    <p className="text-gray-400 mt-2 text-sm">
                        Event: <span className="text-purple-400 font-bold">{selectedEvent?.title || 'Festival Pass'}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Full Name *</label>
                            <input
                                required
                                type="text"
                                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none"
                                value={formData.name || ''}
                                onChange={(e) => handleChange('name', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Mobile Number *</label>
                            <input
                                required
                                type="tel"
                                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none"
                                value={formData.phone || ''}
                                onChange={(e) => handleChange('phone', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Email (Read Only)</label>
                            <input
                                type="email"
                                disabled
                                className="w-full bg-[#111] border border-white/5 rounded-lg p-3 text-gray-500 cursor-not-allowed"
                                value={email}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Degree *</label>
                            <select
                                required
                                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none"
                                value={formData.degree || ''}
                                onChange={(e) => handleChange('degree', e.target.value)}
                            >
                                <option value="">Select Degree</option>
                                <option value="B.E/B.Tech">B.E / B.Tech</option>
                                <option value="M.E/M.Tech">M.E / M.Tech</option>
                                <option value="Arts & Science">Arts & Science</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Course / Branch *</label>
                            <input
                                required
                                type="text"
                                placeholder="Ex: CSE, Mechanical, B.Com"
                                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none"
                                value={formData.course || ''}
                                onChange={(e) => handleChange('course', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Year of Study *</label>
                            <select
                                required
                                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none"
                                value={formData.year || ''}
                                onChange={(e) => handleChange('year', e.target.value)}
                            >
                                <option value="">Select Year</option>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                            </select>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-purple-900/10 border border-purple-500/20 space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <div
                                className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${formData.isVeltechStudent ? 'bg-purple-600 border-purple-600' : 'border-gray-500'
                                    }`}
                            >
                                {formData.isVeltechStudent && <FaCheck size={14} className="text-white" />}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={formData.isVeltechStudent}
                                onChange={(e) => handleChange('isVeltechStudent', e.target.checked)}
                            />
                            <span className="font-bold text-white">I am a Vel Tech Student</span>
                        </label>

                        <AnimatePresence>
                            {formData.isVeltechStudent ? (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="pt-4 border-t border-purple-500/20 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-purple-400 uppercase">VM Number (Required) *</label>
                                            <input
                                                type="text"
                                                placeholder="Ex: VM15894"
                                                className="w-full bg-[#111] border border-purple-500/30 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none"
                                                value={formData.vmNumber || ''}
                                                onChange={(e) => handleChange('vmNumber', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-purple-400 uppercase">Upload ID Card *</label>
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    id="id-upload"
                                                    onChange={(e) => uploadFile(e.target.files![0], 'id')}
                                                />
                                                <label
                                                    htmlFor="id-upload"
                                                    className={`w-full flex items-center justify-center gap-2 p-3 border border-dashed rounded-lg cursor-pointer transition-colors ${formData.idCardUrl
                                                        ? 'border-green-500 bg-green-500/10 text-green-400'
                                                        : 'border-purple-500/30 bg-[#111] hover:bg-purple-900/10 text-gray-400'
                                                        }`}
                                                >
                                                    {uploadingId ? (
                                                        <span className="animate-pulse flex items-center gap-2"><FaSpinner size={16} className="animate-spin" /> Uploading...</span>
                                                    ) : formData.idCardUrl ? (
                                                        <>
                                                            <FaCheck size={18} /> ID Card Uploaded
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FaCloudUploadAlt size={18} /> Upload ID
                                                        </>
                                                    )}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="pt-4 border-t border-purple-500/20 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">College Name *</label>
                                            <input
                                                type="text"
                                                placeholder="Enter your college name"
                                                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none"
                                                value={formData.college || ''}
                                                onChange={(e) => handleChange('college', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Payment Screenshot *</label>
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    id="pay-upload"
                                                    onChange={(e) => uploadFile(e.target.files![0], 'payment')}
                                                />
                                                <label
                                                    htmlFor="pay-upload"
                                                    className={`w-full flex items-center justify-center gap-2 p-3 border border-dashed rounded-lg cursor-pointer transition-colors ${formData.paymentScreenshotUrl
                                                        ? 'border-green-500 bg-green-500/10 text-green-400'
                                                        : 'border-white/20 bg-[#111] hover:bg-white/5 text-gray-400'
                                                        }`}
                                                >
                                                    {uploadingPayment ? (
                                                        <span className="animate-pulse flex items-center gap-2"><FaSpinner size={16} className="animate-spin" /> Uploading...</span>
                                                    ) : formData.paymentScreenshotUrl ? (
                                                        <>
                                                            <FaCheck size={18} /> Screenshot Uploaded
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FaCloudUploadAlt size={18} /> Upload Screenshot
                                                        </>
                                                    )}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        type="submit"
                        disabled={uploadingId || uploadingPayment}
                        className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                    >
                        {uploadingId || uploadingPayment ? 'Uploading Files...' : 'Submit Registration'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};
