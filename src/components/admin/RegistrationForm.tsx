import React, { useState } from 'react';
import { FaCloudUploadAlt, FaCheck, FaSpinner, FaPlus, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import config from '../../config';
import { Event } from '../../types/admin';

interface RegistrationFormProps {
    email?: string;
    onSubmit: (data: any) => void;
    selectedEvent?: Event | null;
    onClose?: () => void;
    upiId?: string;
    qrCodeUrl?: string;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ email = '', onSubmit, selectedEvent, onClose, upiId = '', qrCodeUrl = '' }) => {
    const isSoloEvent = selectedEvent?.participationType === 'Solo';
    const isTeamEvent = selectedEvent?.participationType === 'Team';

    // Parse team size with better handling
    let maxTeamSize = 4; // default
    if (selectedEvent?.teamSize) {
        const parsed = parseInt(selectedEvent.teamSize.toString());
        if (!isNaN(parsed) && parsed > 0) {
            maxTeamSize = parsed;
        }
    }

    console.log('RegistrationForm - Event:', selectedEvent?.title);
    console.log('RegistrationForm - Team Size (raw):', selectedEvent?.teamSize);
    console.log('RegistrationForm - Max Team Size (parsed):', maxTeamSize);

    const [formData, setFormData] = useState({
        email,
        eventId: selectedEvent?.id || '',
        eventName: selectedEvent?.title || 'General Pass',
        participationType: selectedEvent?.participationType || 'Solo',

        // Solo fields
        name: '',
        phone: '',
        college: '',
        department: '',
        degree: '',
        course: '',
        year: '',
        idCardUrl: '',

        // Team fields
        teamName: '',
        teamMembers: [{ name: '', phone: '' }],
        teamLeaderIdCardUrl: '',

        // Payment
        paymentScreenshotUrl: ''
    });

    const [uploadingIdCard, setUploadingIdCard] = useState(false);
    const [uploadingPayment, setUploadingPayment] = useState(false);

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleTeamMemberChange = (index: number, field: 'name' | 'phone', value: string) => {
        const updatedMembers = [...formData.teamMembers];
        updatedMembers[index][field] = value;
        setFormData(prev => ({ ...prev, teamMembers: updatedMembers }));
    };

    const addTeamMember = () => {
        if (formData.teamMembers.length < maxTeamSize) {
            setFormData(prev => ({
                ...prev,
                teamMembers: [...prev.teamMembers, { name: '', phone: '' }]
            }));
        }
    };

    const removeTeamMember = (index: number) => {
        if (formData.teamMembers.length > 1) {
            const updatedMembers = formData.teamMembers.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, teamMembers: updatedMembers }));
        }
    };

    const uploadFile = async (file: File, type: 'idCard' | 'teamLeaderIdCard' | 'payment') => {
        if (!file) return;

        if (type === 'idCard') setUploadingIdCard(true);
        else if (type === 'teamLeaderIdCard') setUploadingIdCard(true);
        else setUploadingPayment(true);

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
                const fileUrl = response.data?.url || response.url;
                if (type === 'idCard') {
                    setFormData(prev => ({ ...prev, idCardUrl: fileUrl }));
                } else if (type === 'teamLeaderIdCard') {
                    setFormData(prev => ({ ...prev, teamLeaderIdCardUrl: fileUrl }));
                } else {
                    setFormData(prev => ({ ...prev, paymentScreenshotUrl: fileUrl }));
                }
            } else {
                alert("Upload failed. Please try again.");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Error uploading file.");
        } finally {
            if (type === 'idCard' || type === 'teamLeaderIdCard') setUploadingIdCard(false);
            else setUploadingPayment(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isSoloEvent) {
            if (!formData.name || !formData.phone || !formData.college || !formData.department ||
                !formData.degree || !formData.course || !formData.year || !formData.idCardUrl ||
                !formData.paymentScreenshotUrl) {
                alert("Please fill all required fields for solo registration");
                return;
            }
        } else if (isTeamEvent) {
            if (!formData.teamName || !formData.college || !formData.department ||
                !formData.degree || !formData.course || !formData.year ||
                !formData.teamLeaderIdCardUrl || !formData.paymentScreenshotUrl) {
                alert("Please fill all required team fields");
                return;
            }

            const allMembersValid = formData.teamMembers.every(member => member.name && member.phone);
            if (!allMembersValid) {
                alert("Please fill all team member names and phone numbers");
                return;
            }
        }

        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md overflow-y-auto">
            <div className="w-full min-h-screen md:min-h-0 md:py-8 flex items-start md:items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#111] border-0 md:border border-white/10 w-full md:max-w-3xl md:mx-4 rounded-none md:rounded-2xl shadow-2xl relative min-w-0"
                >
                    <div className="p-3 md:p-8 border-b border-white/10 relative">
                        {onClose && (
                            <button
                                type="button"
                                onClick={onClose}
                                className="absolute top-3 right-3 md:top-8 md:right-8 text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
                                aria-label="Close"
                            >
                                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                        <h2 className="font-display text-lg md:text-3xl font-bold text-white pr-10">Complete Your Registration</h2>
                        <p className="text-gray-400 mt-1 md:mt-2 text-xs md:text-sm">
                            Event: <span className="text-purple-400 font-bold">{selectedEvent?.title || 'Festival Pass'}</span>
                            {selectedEvent?.participationType && (
                                <span className="ml-2 text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">
                                    {selectedEvent.participationType}
                                </span>
                            )}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-3 md:p-8 space-y-3 md:space-y-6">
                        {isSoloEvent && (
                            <>
                                {/* Solo Event Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs md:text-sm font-bold text-gray-500 uppercase">Full Name *</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 md:p-3.5 text-sm md:text-base text-white focus:border-purple-500 focus:outline-none"
                                            value={formData.name || ''}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs md:text-sm font-bold text-gray-500 uppercase">Mobile Number *</label>
                                        <input
                                            required
                                            type="tel"
                                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 md:p-3.5 text-sm md:text-base text-white focus:border-purple-500 focus:outline-none"
                                            value={formData.phone || ''}
                                            onChange={(e) => handleChange('phone', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs md:text-sm font-bold text-gray-500 uppercase">Email Address *</label>
                                        <input
                                            required
                                            type="email"
                                            placeholder="Enter your email"
                                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 md:p-3.5 text-sm md:text-base text-white placeholder:text-gray-600 focus:border-purple-500 focus:outline-none"
                                            value={formData.email || ''}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs md:text-sm font-bold text-gray-500 uppercase">College Name *</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Enter your college name"
                                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 md:p-3.5 text-sm md:text-base text-white placeholder:text-gray-600 focus:border-purple-500 focus:outline-none"
                                            value={formData.college || ''}
                                            onChange={(e) => handleChange('college', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs md:text-sm font-bold text-gray-500 uppercase">Department *</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Ex: Computer Science"
                                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 md:p-3.5 text-sm md:text-base text-white placeholder:text-gray-600 focus:border-purple-500 focus:outline-none"
                                            value={formData.department || ''}
                                            onChange={(e) => handleChange('department', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs md:text-sm font-bold text-gray-500 uppercase">Degree *</label>
                                        <select
                                            required
                                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 md:p-3.5 text-sm md:text-base text-white focus:border-purple-500 focus:outline-none"
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
                                        <label className="text-xs md:text-sm font-bold text-gray-500 uppercase">Course / Branch *</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Ex: CSE, Mechanical, B.Com"
                                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 md:p-3.5 text-sm md:text-base text-white placeholder:text-gray-600 focus:border-purple-500 focus:outline-none"
                                            value={formData.course || ''}
                                            onChange={(e) => handleChange('course', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs md:text-sm font-bold text-gray-500 uppercase">Year of Study *</label>
                                        <select
                                            required
                                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 md:p-3.5 text-sm md:text-base text-white focus:border-purple-500 focus:outline-none"
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
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs md:text-sm font-bold text-gray-500 uppercase">ID Card Upload *</label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                id="id-upload"
                                                onChange={(e) => e.target.files && uploadFile(e.target.files[0], 'idCard')}
                                            />
                                            <label
                                                htmlFor="id-upload"
                                                className={`w-full flex items-center justify-center gap-2 p-4 md:p-5 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${formData.idCardUrl
                                                    ? 'border-green-500 bg-green-500/10 text-green-400'
                                                    : 'border-white/20 bg-[#111] hover:bg-white/5 text-gray-400'
                                                    }`}
                                            >
                                                {uploadingIdCard ? (
                                                    <span className="animate-pulse flex items-center gap-2 text-sm md:text-base"><FaSpinner size={18} className="animate-spin" /> Uploading...</span>
                                                ) : formData.idCardUrl ? (
                                                    <>
                                                        <FaCheck size={18} /> <span className="text-sm md:text-base">ID Card Uploaded</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaCloudUploadAlt size={20} /> <span className="text-sm md:text-base">Upload ID Card</span>
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {isTeamEvent && (
                            <>
                                {/* Team Event Fields */}
                                <div className="grid grid-cols-1 gap-3 md:gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs md:text-sm font-bold text-gray-500 uppercase">Team Name *</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Enter your team name"
                                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 md:p-3.5 text-sm md:text-base text-white placeholder:text-gray-600 focus:border-purple-500 focus:outline-none"
                                            value={formData.teamName || ''}
                                            onChange={(e) => handleChange('teamName', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs md:text-sm font-bold text-gray-500 uppercase">
                                                Team Members * ({formData.teamMembers.length}/{maxTeamSize})
                                            </label>
                                            {formData.teamMembers.length < maxTeamSize && (
                                                <button
                                                    type="button"
                                                    onClick={addTeamMember}
                                                    className="text-xs md:text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-lg hover:bg-purple-500/30 flex items-center gap-1"
                                                >
                                                    <FaPlus size={12} /> Add Member
                                                </button>
                                            )}
                                        </div>

                                        {formData.teamMembers.map((member, index) => (
                                            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-black/40 rounded-lg border border-white/5">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-500">Member {index + 1} Name *</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        placeholder="Full name"
                                                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                                                        value={member.name}
                                                        onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-gray-500">Phone Number *</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            required
                                                            type="tel"
                                                            placeholder="Phone number"
                                                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                                                            value={member.phone}
                                                            onChange={(e) => handleTeamMemberChange(index, 'phone', e.target.value)}
                                                        />
                                                        {formData.teamMembers.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeTeamMember(index)}
                                                                className="bg-red-500/20 text-red-400 px-3 rounded-lg hover:bg-red-500/30"
                                                            >
                                                                <FaTrash size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs md:text-sm font-bold text-gray-500 uppercase">Team Leader Email *</label>
                                        <input
                                            required
                                            type="email"
                                            placeholder="Enter team leader email"
                                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 md:p-3.5 text-sm md:text-base text-white placeholder:text-gray-600 focus:border-purple-500 focus:outline-none"
                                            value={formData.email || ''}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="space-y-2">
                                            <label className="text-xs md:text-sm font-bold text-gray-500 uppercase">College Name *</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Enter college name"
                                                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 md:p-3.5 text-sm md:text-base text-white placeholder:text-gray-600 focus:border-purple-500 focus:outline-none"
                                                value={formData.college || ''}
                                                onChange={(e) => handleChange('college', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs md:text-sm font-bold text-gray-500 uppercase">Department *</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Ex: Computer Science"
                                                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 md:p-3.5 text-sm md:text-base text-white placeholder:text-gray-600 focus:border-purple-500 focus:outline-none"
                                                value={formData.department || ''}
                                                onChange={(e) => handleChange('department', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs md:text-sm font-bold text-gray-500 uppercase">Degree *</label>
                                            <select
                                                required
                                                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 md:p-3.5 text-sm md:text-base text-white focus:border-purple-500 focus:outline-none"
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
                                            <label className="text-xs md:text-sm font-bold text-gray-500 uppercase">Course / Branch *</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Ex: CSE, Mechanical"
                                                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 md:p-3.5 text-sm md:text-base text-white placeholder:text-gray-600 focus:border-purple-500 focus:outline-none"
                                                value={formData.course || ''}
                                                onChange={(e) => handleChange('course', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs md:text-sm font-bold text-gray-500 uppercase">Year of Study *</label>
                                            <select
                                                required
                                                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 md:p-3.5 text-sm md:text-base text-white focus:border-purple-500 focus:outline-none"
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

                                    <div className="space-y-2">
                                        <label className="text-xs md:text-sm font-bold text-gray-500 uppercase">Team Leader ID Card *</label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                id="team-leader-id-upload"
                                                onChange={(e) => e.target.files && uploadFile(e.target.files[0], 'teamLeaderIdCard')}
                                            />
                                            <label
                                                htmlFor="team-leader-id-upload"
                                                className={`w-full flex items-center justify-center gap-2 p-4 md:p-5 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${formData.teamLeaderIdCardUrl
                                                    ? 'border-green-500 bg-green-500/10 text-green-400'
                                                    : 'border-white/20 bg-[#111] hover:bg-white/5 text-gray-400'
                                                    }`}
                                            >
                                                {uploadingIdCard ? (
                                                    <span className="animate-pulse flex items-center gap-2 text-sm md:text-base"><FaSpinner size={18} className="animate-spin" /> Uploading...</span>
                                                ) : formData.teamLeaderIdCardUrl ? (
                                                    <>
                                                        <FaCheck size={18} /> <span className="text-sm md:text-base">ID Card Uploaded</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaCloudUploadAlt size={20} /> <span className="text-sm md:text-base">Upload Leader ID Card</span>
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Payment Section - Common for both */}
                        <div className="grid grid-cols-1 gap-3 md:gap-6">
                            <div className="space-y-2">
                                <label className="text-xs md:text-sm font-bold text-gray-500 uppercase">Payment Information</label>
                                <div className="bg-black/40 p-3 md:p-4 rounded-lg border border-white/5 space-y-3">
                                    {qrCodeUrl && (
                                        <div className="flex justify-center">
                                            <div className="bg-white p-2 rounded-lg">
                                                <img src={qrCodeUrl} alt="Payment QR" className="w-28 h-28 md:w-32 md:h-32 object-contain" />
                                            </div>
                                        </div>
                                    )}
                                    {upiId && (
                                        <div className="text-center">
                                            <p className="text-xs text-gray-400 mb-1">UPI ID</p>
                                            <p className="font-mono text-sm md:text-base text-purple-300 select-all break-all px-2">{upiId}</p>
                                        </div>
                                    )}
                                    <p className="text-xs text-gray-500 text-center">Scan QR or use UPI ID to make payment</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs md:text-sm font-bold text-gray-500 uppercase">Payment Screenshot *</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        id="pay-upload"
                                        onChange={(e) => e.target.files && uploadFile(e.target.files[0], 'payment')}
                                    />
                                    <label
                                        htmlFor="pay-upload"
                                        className={`w-full flex items-center justify-center gap-2 p-4 md:p-5 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${formData.paymentScreenshotUrl
                                            ? 'border-green-500 bg-green-500/10 text-green-400'
                                            : 'border-white/20 bg-[#111] hover:bg-white/5 text-gray-400'
                                            }`}
                                    >
                                        {uploadingPayment ? (
                                            <span className="animate-pulse flex items-center gap-2 text-sm md:text-base"><FaSpinner size={18} className="animate-spin" /> Uploading...</span>
                                        ) : formData.paymentScreenshotUrl ? (
                                            <>
                                                <FaCheck size={18} /> <span className="text-sm md:text-base">Screenshot Uploaded</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaCloudUploadAlt size={20} /> <span className="text-sm md:text-base">Upload Screenshot</span>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={uploadingIdCard || uploadingPayment}
                            className="w-full bg-white text-black font-bold py-3.5 md:py-4 text-sm md:text-base rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 active:scale-[0.98] touch-manipulation"
                        >
                            {uploadingIdCard || uploadingPayment ? 'Uploading Files...' : 'Submit Registration'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};
