import React, { useState, useEffect } from 'react';
import {
    FaTimes,
    FaSave,
    FaPlus,
    FaTrash,
    FaArrowLeft,
    FaCheck,
    FaImage,
    FaUsers,
    FaList,
    FaFont,
    FaFileAlt,
    FaEye,
    FaExternalLinkAlt
} from 'react-icons/fa';
import { FileUploader } from './FileUploader';
import config from '../../config';
import { Content, Event, TeamMember, Registration, MediaAsset } from '../../types/admin';

// Default / Empty States
const emptyEvent: Event = {
    id: '',
    title: '',
    date: '',
    time: '',
    description: '',
    image: null,
    category: 'Cultural',
    participationType: 'Solo',
    teamSize: '',
    coordinatorPhone: '', // Event coordinator contact
    isPassEvent: true, // Default to Pass-based pricing
    ticketTiers: [],
    entryFee: 0,
    rules: [],
    maxSlots: 100,
    registeredCount: 0
};

const emptyTeamMember: TeamMember = {
    name: '',
    role: '',
    category: 'Volunteers / Core Committee',
    image: null,
    instagram: '',
    linkedin: '',
    isActive: true,
    order: 0
};

const teamCategories = [
    'Faculty Coordinators',
    'Student Coordinators',
    'Vistara Club Members',
    'Cultural Team',
    'Technical Team',
    'Design & Media Team',
    'Volunteers / Core Committee'
];

interface AdminPanelProps {
    content: Content;
    setContent: (content: Content) => void;
    events: Event[];
    setEvents: (events: Event[]) => void;
    isOpen: boolean;
    onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ content, setContent, events, setEvents, isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('general');
    const [isAddingEvent, setIsAddingEvent] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newEvent, setNewEvent] = useState<Event>(emptyEvent);

    const [newGalleryUrl, setNewGalleryUrl] = useState('');
    const [newRule, setNewRule] = useState('');
    const [newFaq, setNewFaq] = useState({ question: '', answer: '' });

    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [newTeamMember, setNewTeamMember] = useState<TeamMember>(emptyTeamMember);
    const [isAddingTeamMember, setIsAddingTeamMember] = useState(false);
    const [editingTeamId, setEditingTeamId] = useState<string | null>(null);

    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [isLoadingRegs, setIsLoadingRegs] = useState(false);
    const [selectedEventFilter, setSelectedEventFilter] = useState<string>('all'); // 'all' or eventId

    // Registration View Modal State
    const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);

    useEffect(() => {
        if (isOpen) {
            if (activeTab === 'registrations') fetchRegistrations();
            if (activeTab === 'team') fetchTeamMembers();
        }
    }, [isOpen, activeTab]);

    const fetchTeamMembers = async () => {
        try {
            const res = await fetch(`${config.API_URL}/team`);
            const data = await res.json();
            if (data.success) setTeamMembers(data.data);
        } catch (error) {
            console.error("Failed to fetch team", error);
        }
    };

    const fetchRegistrations = async () => {
        setIsLoadingRegs(true);
        try {
            const res = await fetch(`${config.API_URL}/admin/registrations`);
            const data = await res.json();
            if (data.success) {
                setRegistrations(data.data);
            }
        } catch (error) {
            console.error("Failed to load registrations", error);
        }
        setIsLoadingRegs(false);
    };

    const saveContentToBackend = async (newContent: Content, silent = false) => {
        try {
            // 🛡️ SANITIZATION: Ensure all media assets are objects before sending
            const sanitizedContent = { ...newContent };

            // 1. Sanitize Gallery Images
            if (Array.isArray(sanitizedContent.galleryImages)) {
                sanitizedContent.galleryImages = sanitizedContent.galleryImages.map(img => {
                    // @ts-ignore - handling string legacy data
                    if (typeof img === 'string') {
                        const urlString = img as string;
                        // Auto-detect type roughly
                        const isVid = urlString.match(/\.(mp4|webm|ogg)$/i);
                        return { url: urlString, type: isVid ? 'video' : 'image' } as MediaAsset;
                    }
                    return img;
                }).filter(Boolean); // Remove nulls/undefined
            }

            // 2. Sanitize Hero Media
            // @ts-ignore - handling string legacy data
            if (sanitizedContent.heroBackgroundMedia && typeof sanitizedContent.heroBackgroundMedia === 'string') {
                const img = sanitizedContent.heroBackgroundMedia as unknown as string;
                const isVid = img.match(/\.(mp4|webm|ogg)$/i);
                sanitizedContent.heroBackgroundMedia = { url: img, type: isVid ? 'video' : 'image' } as MediaAsset;
            }

            const res = await fetch(`${config.API_URL}/content/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: sanitizedContent }),
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json.error || "Server Error");

            if (!silent) alert("Changes Saved to Database!");
        } catch (error: any) {
            console.error("Failed to save content", error);
            alert(`Error saving content: ${error.message}`);
        }
    };

    const saveEventsToBackend = async (newEvents: Event[]) => {
        try {
            await fetch(`${config.API_URL}/events/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ events: newEvents }),
            });
        } catch (error) {
            console.error("Failed to save events", error);
        }
    };

    const saveTeamToBackend = async (members: TeamMember[]) => {
        try {
            await fetch(`${config.API_URL}/team/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teamMembers: members }),
            });
        } catch (error: any) {
            console.error("Failed to save team", error);
            alert(`Failed to save team changes: ${error.message}`);
        }
    };

    // --- Registration Verification ---
    const handleVerifyRegistration = async (reg: Registration) => {
        // Optimistic Update
        const updatedRegs = registrations.map(r => r._id === reg._id ? { ...r, isActive: true } : r);
        setRegistrations(updatedRegs);
        if (selectedRegistration && selectedRegistration._id === reg._id) {
            setSelectedRegistration({ ...selectedRegistration, isActive: true });
        }

        try {
            await fetch(`${config.API_URL}/admin/verify-registration`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ registrationId: reg._id, isActive: true })
            });
            console.log("Verified user:", reg.name);
            // alert(`User ${reg.name} Verified!`); // Optional: Remove alert for smoother UX
        } catch (error) {
            console.error("Verification failed", error);
            alert("Verification failed");
            // Revert optimistic update
            setRegistrations(registrations);
        }
    };


    if (!isOpen) return null;

    const handleContentChange = (key: keyof Content, value: any) => {
        setContent({ ...content, [key]: value });
    };

    const handlePriceChange = (tier: string, value: string) => {
        const numValue = parseInt(value) || 0;
        setContent({
            ...content,
            ticketPrices: {
                ...content.ticketPrices,
                [tier]: numValue
            }
        });
    };

    const handleAddGalleryItem = async () => {
        if (newGalleryUrl.trim()) {
            const currentImages = content.galleryImages || [];
            const newImage: MediaAsset = { url: newGalleryUrl.trim(), type: 'image' };
            const updatedImages = [...currentImages, newImage];
            const newContentObj = { ...content, galleryImages: updatedImages };
            setContent(newContentObj);
            setNewGalleryUrl('');
            await saveContentToBackend(newContentObj, true);
        }
    };

    const handleDeleteGalleryItem = async (index: number) => {
        if (window.confirm("Delete this image permanently?")) {
            const currentImages = content.galleryImages || [];
            const updatedGallery = currentImages.filter((_, i) => i !== index);
            const newContentObj = { ...content, galleryImages: updatedGallery };
            setContent(newContentObj);
            await saveContentToBackend(newContentObj, true);
        }
    };

    const handleAddFaq = () => {
        if (newFaq.question.trim() && newFaq.answer.trim()) {
            const currentFaqs = content.faqs || [];
            const updatedFaqs = [...currentFaqs, newFaq];
            const newContentObj = { ...content, faqs: updatedFaqs };
            setContent(newContentObj);
            setNewFaq({ question: '', answer: '' });
        }
    };

    const handleDeleteFaq = (index: number) => {
        const currentFaqs = content.faqs || [];
        const updatedFaqs = currentFaqs.filter((_, i) => i !== index);
        const newContentObj = { ...content, faqs: updatedFaqs };
        setContent(newContentObj);
    };

    const handleDeleteEvent = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            const updatedEvents = events.filter((e) => e.id !== id);
            setEvents(updatedEvents);
            await saveEventsToBackend(updatedEvents);
        }
    };

    const handleEditEvent = (event: Event) => {
        setNewEvent({
            ...event,
            ticketTiers: event.ticketTiers || [],
            rules: event.rules || [],
            maxSlots: event.maxSlots || 100,
            registeredCount: event.registeredCount || 0,
            // Ensure defaults for new fields
            isPassEvent: event.isPassEvent !== undefined ? event.isPassEvent : true,
            entryFee: event.entryFee || 0
        });
        setEditingId(event.id);
        setIsAddingEvent(true);
    };

    const handleSaveEvent = () => {
        if (!newEvent.title || !newEvent.description) {
            alert("Please fill in all required fields (Title, Description)");
            return;
        }

        let updatedEvents;
        if (editingId) {
            updatedEvents = events.map((e) =>
                e.id === editingId ? { ...newEvent, id: editingId, image: newEvent.image || e.image } : e
            );
        } else {
            const eventToAdd: Event = {
                ...newEvent,
                id: Date.now().toString(),
                image:
                    newEvent.image ||
                    { url: 'https://images.unsplash.com/photo-1514525253440-b393452e8d03?q=80&w=2070&auto=format&fit=crop', type: 'image' }
            };
            updatedEvents = [...events, eventToAdd];
        }

        setEvents(updatedEvents);
        saveEventsToBackend(updatedEvents);
        alert("Event Saved Successfully!");
        resetForm();
    };

    const resetForm = () => {
        setIsAddingEvent(false);
        setNewEvent(emptyEvent);
        setEditingId(null);
        setNewRule('');
    };

    const toggleTicketTier = (tier: string) => {
        if (newEvent.ticketTiers.includes(tier)) {
            setNewEvent({ ...newEvent, ticketTiers: newEvent.ticketTiers.filter((t) => t !== tier) });
        } else {
            setNewEvent({ ...newEvent, ticketTiers: [...newEvent.ticketTiers, tier] });
        }
    };

    const handleAddRule = () => {
        if (newRule.trim()) {
            setNewEvent({ ...newEvent, rules: [...(newEvent.rules || []), newRule.trim()] });
            setNewRule('');
        }
    };

    const handleRemoveRule = (index: number) => {
        setNewEvent({ ...newEvent, rules: newEvent.rules.filter((_, i) => i !== index) });
    };

    // --- TEAM MEMBER LOGIC ---

    const cancelTeamEdit = () => {
        setIsAddingTeamMember(false);
        setNewTeamMember(emptyTeamMember);
        setEditingTeamId(null);
    };

    const handleEditTeamMember = (member: TeamMember) => {
        setNewTeamMember({ ...member });
        setEditingTeamId(member._id || member.id || null);
        setIsAddingTeamMember(true);
    };

    const handleDeleteTeamMember = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this team member?")) {
            const updatedTeam = teamMembers.filter((m) => (m._id || m.id) !== id);
            setTeamMembers(updatedTeam);
            await saveTeamToBackend(updatedTeam);
        }
    };

    const handleSaveTeamMember = async () => {
        if (!newTeamMember.name || !newTeamMember.role) {
            alert("Name and Role are required!");
            return;
        }

        let updatedTeam;
        if (editingTeamId) {
            updatedTeam = teamMembers.map((m) =>
                (m._id || m.id) === editingTeamId ? { ...newTeamMember, _id: editingTeamId } : m
            );
        } else {
            updatedTeam = [...teamMembers, { ...newTeamMember }];
        }

        setTeamMembers(updatedTeam);
        await saveTeamToBackend(updatedTeam);
        alert("Team Member Saved!");
        cancelTeamEdit();
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-2 md:p-6 text-white">
            <div className="bg-[#111] border border-white/10 w-full max-w-6xl h-full md:max-h-[90vh] overflow-hidden rounded-2xl flex flex-col shadow-2xl relative">

                {/* HEADER */}
                <div className="p-4 md:p-6 border-b border-white/10 flex justify-between items-center bg-[#151515]">
                    <div className="flex items-center gap-3">
                        {isAddingEvent && (
                            <button
                                onClick={resetForm}
                                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                                title="Back"
                            >
                                <FaArrowLeft size={20} className="text-gray-400" />
                            </button>
                        )}
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                {isAddingEvent ? (editingId ? 'Edit Event' : 'Create New Event') : 'Admin Dashboard'}
                            </h2>
                            <p className="text-gray-400 text-xs md:text-sm">
                                {isAddingEvent ? 'Enter event details below' : 'Manage website content dynamically'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                        title="Close"
                    >
                        <FaTimes size={24} />
                    </button>
                </div>

                {/* NAVIGATION TABS */}
                {!isAddingEvent && !isAddingTeamMember && (
                    <div className="flex border-b border-white/10 overflow-x-auto">
                        {['general', 'events', 'registrations', 'team', 'faq'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 min-w-[120px] py-4 text-sm font-medium transition-colors capitalize ${activeTab === tab
                                    ? 'bg-purple-600/20 text-purple-400 border-b-2 border-purple-500'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {tab === 'general' ? 'General Settings' : tab === 'faq' ? 'Manage FAQs' : tab}
                            </button>
                        ))}
                    </div>
                )}

                {/* CONTENT AREA */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#0f0f0f]">
                    {/* --- GENERAL SETTINGS --- */}
                    {activeTab === 'general' && (
                        <div className="space-y-6 max-w-4xl mx-auto">
                            <div className="p-6 bg-[#1a1a1a] rounded-xl border border-white/5 space-y-4">
                                <h3 className="text-xl font-bold text-white mb-4">Global Preferences</h3>

                                <div className="flex items-center justify-between p-4 bg-[#222] rounded-lg">
                                    <div>
                                        <h4 className="font-bold text-white">Enable Ticket Pass System</h4>
                                        <p className="text-sm text-gray-400">If enabled, events can be linked to Diamond/Gold/Silver passes.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={content.isTicketPassEnabled !== false}
                                            onChange={(e) => {
                                                const newVal = e.target.checked;
                                                setContent({ ...content, isTicketPassEnabled: newVal });
                                                saveContentToBackend({ ...content, isTicketPassEnabled: newVal }, true);
                                            }}
                                        />
                                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                    </label>
                                </div>
                            </div>

                            {/* Ticket Prices */}
                            <div className="p-6 bg-[#1a1a1a] rounded-xl border border-white/5 space-y-4">
                                <h3 className="text-xl font-bold text-white mb-4">Ticket Prices</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {['diamond', 'gold', 'silver'].map((tier) => (
                                        <div key={tier} className="space-y-2">
                                            <label className="text-gray-400 text-sm capitalize">{tier} Pass (₹)</label>
                                            <input
                                                type="number"
                                                value={content.ticketPrices?.[tier] || 0}
                                                onChange={(e) => {
                                                    const newPrices = { ...(content.ticketPrices || {}), [tier]: parseInt(e.target.value) || 0 };
                                                    const newContent = { ...content, ticketPrices: newPrices };
                                                    setContent(newContent);
                                                    saveContentToBackend(newContent, true);
                                                }}
                                                className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Configuration */}
                            <div className="p-6 bg-[#1a1a1a] rounded-xl border border-white/5 space-y-4">
                                <h3 className="text-xl font-bold text-white mb-4">Payment Configuration</h3>

                                <div className="space-y-2">
                                    <label className="text-gray-400 text-sm">UPI ID</label>
                                    <input
                                        type="text"
                                        value={content.upiId || ''}
                                        onChange={(e) => {
                                            const newContent = { ...content, upiId: e.target.value };
                                            setContent(newContent);
                                            saveContentToBackend(newContent, true);
                                        }}
                                        className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                                        placeholder="yourname@upi"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <FileUploader
                                        label="Payment QR Code"
                                        initialUrl={content.qrCodeUrl ? { url: content.qrCodeUrl, type: 'image' } : null}
                                        onUpload={(asset) => {
                                            if (asset) {
                                                const newContent = { ...content, qrCodeUrl: asset.url };
                                                setContent(newContent);
                                                saveContentToBackend(newContent, true);
                                            }
                                        }}
                                        folder="payment"
                                    />
                                    {content.qrCodeUrl && (
                                        <div className="mt-2">
                                            <p className="text-xs text-gray-400 mb-2">Current QR Code:</p>
                                            <img src={content.qrCodeUrl} alt="Payment QR" className="w-48 h-48 object-contain bg-white rounded-lg p-2" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={() => saveContentToBackend(content)}
                                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white shadow-lg shadow-purple-900/40 hover:scale-105 transition-transform flex items-center gap-2"
                                >
                                    <FaSave size={20} /> Save All Changes
                                </button>
                            </div>
                        </div>
                    )}


                    {/* --- REGISTRATION LIST VIEW --- */}
                    {activeTab === 'registrations' && !isAddingEvent && !isAddingTeamMember && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold">
                                    {selectedEventFilter === 'all'
                                        ? `All Registrations (${registrations.length})`
                                        : `${events.find(e => e.id === selectedEventFilter)?.title || 'Event'} Registrations (${registrations.filter(r => r.eventId === selectedEventFilter).length})`
                                    }
                                </h3>
                                <div className="flex gap-2">
                                    {selectedEventFilter !== 'all' && (
                                        <button
                                            onClick={() => setSelectedEventFilter('all')}
                                            className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition-colors"
                                        >
                                            ← Back to Events
                                        </button>
                                    )}
                                    <button
                                        onClick={fetchRegistrations}
                                        className="text-sm bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition-colors"
                                    >
                                        Refresh
                                    </button>
                                </div>
                            </div>

                            {isLoadingRegs ? (
                                <div className="text-center py-20 text-gray-400">Loading registrations...</div>
                            ) : selectedEventFilter === 'all' ? (
                                /* SHOW EVENT CARDS */
                                <div>
                                    <p className="text-gray-400 text-sm mb-4">Select an event to view its registrations</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {/* All Registrations Card */}
                                        <div
                                            onClick={() => setSelectedEventFilter('all-list')}
                                            className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-6 cursor-pointer hover:scale-105 transition-transform group"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-bold text-white text-lg">All Registrations</h4>
                                                <FaList className="text-purple-400 text-2xl" />
                                            </div>
                                            <p className="text-3xl font-bold text-white mb-2">{registrations.length}</p>
                                            <p className="text-sm text-gray-300">Total registrations across all events</p>
                                            <div className="mt-4 flex items-center gap-2 text-purple-300 text-sm group-hover:text-purple-200">
                                                <span>View All</span>
                                                <FaArrowLeft className="rotate-180" />
                                            </div>
                                        </div>

                                        {/* Individual Event Cards */}
                                        {events.map(event => {
                                            const eventRegs = registrations.filter(r => r.eventId === event.id);
                                            const verifiedCount = eventRegs.filter(r => r.isActive).length;
                                            const pendingCount = eventRegs.length - verifiedCount;

                                            return (
                                                <div
                                                    key={event.id}
                                                    onClick={() => setSelectedEventFilter(event.id)}
                                                    className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 cursor-pointer hover:border-purple-500/50 hover:scale-105 transition-all group"
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-white text-lg mb-1 line-clamp-1">{event.title}</h4>
                                                            <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded uppercase tracking-wider">
                                                                {event.category}
                                                            </span>
                                                        </div>
                                                        <FaUsers className="text-gray-400 text-xl ml-2" />
                                                    </div>

                                                    <div className="space-y-2 mb-4">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-2xl font-bold text-white">{eventRegs.length}</span>
                                                            <span className="text-xs text-gray-400">registrations</span>
                                                        </div>
                                                        <div className="flex gap-2 text-xs">
                                                            <span className="text-green-400">✓ {verifiedCount} verified</span>
                                                            <span className="text-yellow-400">⏳ {pendingCount} pending</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-purple-400 text-sm group-hover:text-purple-300">
                                                        <span>View Registrations</span>
                                                        <FaArrowLeft className="rotate-180" />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                /* SHOW REGISTRATION TABLE FOR SELECTED EVENT */
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10 text-gray-500 text-sm">
                                                <th className="p-3">Name</th>
                                                <th className="p-3">College</th>
                                                <th className="p-3">Event/Pass</th>
                                                <th className="p-3">Status</th>
                                                <th className="p-3">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(selectedEventFilter === 'all-list'
                                                ? registrations
                                                : registrations.filter(r => r.eventId === selectedEventFilter)
                                            ).map(reg => (
                                                <tr key={reg._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="p-3 font-medium">{reg.name}</td>
                                                    <td className="p-3 text-sm text-gray-400">{reg.college}</td>
                                                    <td className="p-3 text-sm text-purple-400">{reg.eventName || 'N/A'}</td>
                                                    <td className="p-3">
                                                        {reg.isActive ? (
                                                            <span className="text-green-500 text-xs px-2 py-1 bg-green-500/10 rounded-full font-bold">Verified</span>
                                                        ) : (
                                                            <span className="text-yellow-500 text-xs px-2 py-1 bg-yellow-500/10 rounded-full font-bold">Pending</span>
                                                        )}
                                                    </td>
                                                    <td className="p-3">
                                                        <button
                                                            onClick={() => setSelectedRegistration(reg)}
                                                            className="p-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg flex items-center gap-2 text-xs transition-colors"
                                                        >
                                                            <FaEye size={14} /> View Details
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {(selectedEventFilter === 'all-list'
                                        ? registrations
                                        : registrations.filter(r => r.eventId === selectedEventFilter)
                                    ).length === 0 && (
                                            <div className="text-center py-10 text-gray-500">
                                                No registrations found for this event yet.
                                            </div>
                                        )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* --- TEAM MEMBER FORM --- */}
                    {isAddingTeamMember ? (
                        <div className="space-y-6 max-w-3xl mx-auto">
                            <h3 className="text-xl font-bold text-white mb-4">{editingTeamId ? 'Edit Team Member' : 'Add Team Member'}</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-gray-400 text-sm">Full Name</label>
                                    <input
                                        type="text"
                                        value={newTeamMember.name}
                                        onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })}
                                        className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-gray-400 text-sm">Role / Designation</label>
                                    <input
                                        type="text"
                                        value={newTeamMember.role}
                                        onChange={(e) => setNewTeamMember({ ...newTeamMember, role: e.target.value })}
                                        className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-gray-400 text-sm">Category</label>
                                <select
                                    value={newTeamMember.category}
                                    onChange={(e) => setNewTeamMember({ ...newTeamMember, category: e.target.value })}
                                    className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                                >
                                    {teamCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-gray-400 text-sm">Instagram Link (Optional)</label>
                                    <input
                                        type="text"
                                        value={newTeamMember.instagram}
                                        onChange={(e) => setNewTeamMember({ ...newTeamMember, instagram: e.target.value })}
                                        className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-gray-400 text-sm">LinkedIn Link (Optional)</label>
                                    <input
                                        type="text"
                                        value={newTeamMember.linkedin}
                                        onChange={(e) => setNewTeamMember({ ...newTeamMember, linkedin: e.target.value })}
                                        className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <FileUploader
                                        label="Profile Photo"
                                        initialUrl={newTeamMember.image}
                                        onUpload={(asset) => setNewTeamMember({ ...newTeamMember, image: asset })}
                                        folder="team"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-[#1a1a1a] p-3 rounded-lg border border-white/5">
                                <input
                                    type="checkbox"
                                    id="isActiveParams"
                                    checked={newTeamMember.isActive !== false}
                                    onChange={(e) => setNewTeamMember({ ...newTeamMember, isActive: e.target.checked })}
                                    className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
                                />
                                <label htmlFor="isActiveParams" className="text-white font-medium cursor-pointer">
                                    Is Active Member?
                                </label>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button onClick={cancelTeamEdit} className="px-6 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">Cancel</button>
                                <button onClick={handleSaveTeamMember} className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 flex items-center gap-2 font-bold transition-colors">
                                    <FaSave size={18} /> Save Team Member
                                </button>
                            </div>
                        </div>
                    ) : isAddingEvent ? (
                        /* --- EVENT FORM --- */
                        <div className="space-y-6 max-w-3xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-gray-400 text-sm">Event Title *</label>
                                    <input
                                        type="text"
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                        className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-gray-400 text-sm">Category *</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Cultural, Technical, Workshop, etc."
                                        value={newEvent.category}
                                        onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                                        className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-gray-400 text-sm">Coordinator Phone</label>
                                    <input
                                        type="tel"
                                        placeholder="Ex: +91 9876543210"
                                        value={newEvent.coordinatorPhone || ''}
                                        onChange={(e) => setNewEvent({ ...newEvent, coordinatorPhone: e.target.value })}
                                        className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <FileUploader
                                    label="Event Media (Image/Video)"
                                    initialUrl={newEvent.image}
                                    onUpload={(asset) => setNewEvent({ ...newEvent, image: asset })}
                                    folder="events"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-gray-400 text-sm">Description *</label>
                                <textarea
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                    className="w-full h-32 bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 resize-none"
                                />
                            </div>

                            {/* --- NEW PRICING TOGGLE --- */}
                            <div className="p-4 bg-[#1a1a1a] rounded-xl border border-white/5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-white text-sm uppercase tracking-wider text-purple-400">
                                        Event Pricing Logic
                                    </h4>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <span className="text-sm text-gray-400">{newEvent.isPassEvent ? 'Pass-Based (Tiered)' : 'Manual Price'}</span>
                                        <input
                                            type="checkbox"
                                            className="toggle-checkbox hidden"
                                            checked={!!newEvent.isPassEvent}
                                            onChange={(e) => setNewEvent({ ...newEvent, isPassEvent: e.target.checked })}
                                        />
                                        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${newEvent.isPassEvent ? 'bg-purple-600' : 'bg-gray-600'}`}>
                                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${newEvent.isPassEvent ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </div>
                                    </label>
                                </div>

                                {newEvent.isPassEvent ? (
                                    /* SHOW TICKET TIERS */
                                    <div className="space-y-3">
                                        <label className="text-xs text-gray-400">Select which passes grant access to this event:</label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {['Diamond', 'Gold', 'Silver'].map((tier) => (
                                                <label
                                                    key={tier}
                                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${newEvent.ticketTiers.includes(tier)
                                                        ? 'bg-purple-900/20 border-purple-500'
                                                        : 'bg-[#222] border-white/5 hover:border-white/20'
                                                        }`}
                                                >
                                                    <div
                                                        className={`w-5 h-5 rounded flex items-center justify-center border ${newEvent.ticketTiers.includes(tier)
                                                            ? 'bg-purple-600 border-purple-600'
                                                            : 'border-gray-500'
                                                            }`}
                                                    >
                                                        {newEvent.ticketTiers.includes(tier) && <FaCheck size={12} className="text-white" />}
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        className="hidden"
                                                        checked={newEvent.ticketTiers.includes(tier)}
                                                        onChange={() => toggleTicketTier(tier)}
                                                    />
                                                    <div>
                                                        <span className="text-white font-bold block">{tier} Pass</span>
                                                        <span className="text-gray-500 text-xs">Allow access</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    /* SHOW MANUAL PRICE INPUT */
                                    <div className="space-y-2">
                                        <label className="text-gray-400 text-sm">Entry Fee (₹)</label>
                                        <input
                                            type="number"
                                            value={newEvent.entryFee}
                                            onChange={(e) => setNewEvent({ ...newEvent, entryFee: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                                            placeholder="0 for Free"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-[#1a1a1a] rounded-xl border border-white/5 space-y-4">
                                <h4 className="font-bold text-white text-sm uppercase tracking-wider text-purple-400 flex items-center gap-2">
                                    <FaUsers size={16} /> Registration Limits
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-gray-400 text-sm">Max Slots (Capacity)</label>
                                        <input
                                            type="number"
                                            value={newEvent.maxSlots}
                                            onChange={(e) =>
                                                setNewEvent({ ...newEvent, maxSlots: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-400 text-sm">Current Registrations (Simulate)</label>
                                        <input
                                            type="number"
                                            value={newEvent.registeredCount}
                                            onChange={(e) =>
                                                setNewEvent({ ...newEvent, registeredCount: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-[#1a1a1a] rounded-xl border border-white/5 space-y-4">
                                <h4 className="font-bold text-white text-sm uppercase tracking-wider text-purple-400">
                                    Participation Details
                                </h4>
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex items-center gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                checked={newEvent.participationType === 'Solo'}
                                                onChange={() =>
                                                    setNewEvent({ ...newEvent, participationType: 'Solo', teamSize: '' })}
                                                className="accent-purple-500"
                                            />
                                            <span className="text-white">Solo</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                checked={newEvent.participationType === 'Team'}
                                                onChange={() =>
                                                    setNewEvent({ ...newEvent, participationType: 'Team' })}
                                                className="accent-purple-500"
                                            />
                                            <span className="text-white">Team</span>
                                        </label>
                                    </div>
                                    {newEvent.participationType === 'Team' && (
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={newEvent.teamSize || ''}
                                                onChange={(e) => setNewEvent({ ...newEvent, teamSize: e.target.value })}
                                                placeholder="Ex: 2-6 members"
                                                className="w-full bg-[#222] border border-white/10 rounded-lg p-2 text-white text-sm focus:outline-none focus:border-purple-500"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-gray-400 text-sm flex items-center gap-2">
                                    <FaList size={16} /> Rules & Guidelines
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newRule}
                                        onChange={(e) => setNewRule(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddRule()}
                                        placeholder="Enter a rule..."
                                        className="flex-1 bg-[#222] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                                    />
                                    <button
                                        onClick={handleAddRule}
                                        className="px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center justify-center"
                                    >
                                        <FaPlus size={20} />
                                    </button>
                                </div>
                                {newEvent.rules && newEvent.rules.length > 0 && (
                                    <div className="mt-2 space-y-2">
                                        {newEvent.rules.map((rule, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-3 bg-[#1a1a1a] p-3 rounded-lg border border-white/5"
                                            >
                                                <span className="text-purple-500 font-bold">•</span>
                                                <p className="flex-1 text-sm text-gray-300">{rule}</p>
                                                <button
                                                    onClick={() => handleRemoveRule(index)}
                                                    className="text-red-500 hover:text-red-400 p-1"
                                                >
                                                    <FaTrash size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4 pt-4 pb-8">
                                <button onClick={handleSaveEvent} className="w-full py-4 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold transition-colors">
                                    Save Event
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                        </>
                    )}

                    {/* --- EVENTS LIST --- */}
                    {activeTab === 'events' && !isAddingEvent && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white">Manage Events</h3>
                                <button
                                    onClick={() => { resetForm(); setIsAddingEvent(true); }}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-bold"
                                >
                                    <FaPlus size={18} /> Add Event
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {events.map((event) => (
                                    <div key={event.id} className="bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden group hover:border-purple-500/50 transition-colors">
                                        <div className="h-40 bg-black/50 relative overflow-hidden">
                                            {event.image?.url ? (
                                                <img src={event.image.url} alt={event.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                                            )}
                                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEditEvent(event)} className="p-2 bg-white/10 backdrop-blur-md rounded-lg hover:bg-white/20 text-white"><FaFont size={14} /></button>
                                                <button onClick={() => handleDeleteEvent(event.id)} className="p-2 bg-red-500/80 backdrop-blur-md rounded-lg hover:bg-red-600 text-white"><FaTrash size={14} /></button>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-bold text-white truncate">{event.title}</h4>
                                                <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded uppercase tracking-wider">{event.category}</span>
                                            </div>
                                            <p className="text-gray-400 text-xs line-clamp-2 mb-3">{event.description}</p>
                                            <div className="flex items-center gap-4 text-xs text-gray-400">
                                                <span>📅 {event.date}</span>
                                                <span>👥 {event.registeredCount}/{event.maxSlots}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- TEAM LIST --- */}
                    {activeTab === 'team' && !isAddingTeamMember && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white">Team Members</h3>
                                <button
                                    onClick={() => { cancelTeamEdit(); setIsAddingTeamMember(true); }}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-bold"
                                >
                                    <FaPlus size={18} /> Add Member
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {teamMembers.map((member) => (
                                    <div key={member._id} className="bg-[#1a1a1a] border border-white/5 rounded-xl p-4 flex items-center gap-4 group">
                                        <div className={`w-12 h-12 rounded-full overflow-hidden border-2 ${member.isActive ? 'border-green-500' : 'border-gray-600'}`}>
                                            {member.image?.url ? <img src={member.image.url} alt={member.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-700" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-white text-sm truncate">{member.name}</h4>
                                            <p className="text-xs text-gray-400 truncate">{member.role}</p>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEditTeamMember(member)} className="p-1.5 hover:bg-white/10 rounded text-gray-300 hover:text-white"><FaFont size={14} /></button>
                                            <button onClick={() => handleDeleteTeamMember(member._id!)} className="p-1.5 hover:bg-red-500/20 rounded text-red-400"><FaTrash size={14} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* --- REGISTRATION DETAILS MODAL --- */}
            {
                selectedRegistration && (
                    <div className="fixed inset-0 z-[150] bg-black/80 flex items-center justify-center p-4">
                        <div className="bg-[#181818] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h3 className="text-xl font-bold">Registration Details</h3>
                                <button onClick={() => setSelectedRegistration(null)} className="p-2 hover:bg-white/10 rounded-full"><FaTimes size={20} /></button>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase">Applicant</label>
                                        <p className="text-lg font-bold">{selectedRegistration.name}</p>
                                        <p className="text-sm text-gray-400">{selectedRegistration.email}</p>
                                        <p className="text-sm text-gray-400">{selectedRegistration.phone}</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-lg">
                                        <label className="text-xs text-gray-500 uppercase mb-2 block">College Info</label>
                                        <p className="text-sm font-bold text-white mb-1">{selectedRegistration.college}</p>
                                        <p className="text-xs text-gray-400">{selectedRegistration.degree} - {selectedRegistration.course} ({selectedRegistration.year})</p>
                                        {selectedRegistration.isVeltechStudent && (
                                            <p className="mt-2 text-xs text-purple-400 font-mono">ID: {selectedRegistration.vmNumber}</p>
                                        )}
                                    </div>
                                    <div className="p-4 bg-purple-900/10 border border-purple-500/20 rounded-lg">
                                        <label className="text-xs text-purple-400 uppercase mb-1 block">Registered For</label>
                                        <p className="font-bold text-white text-lg">{selectedRegistration.eventName || 'Legacy Registration'}</p>
                                        <p className="text-xs text-gray-500 font-mono">{selectedRegistration.eventId}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs text-gray-500 uppercase">Payment Proof / ID Card</label>
                                    {selectedRegistration.paymentScreenshotUrl ? (
                                        <div className="rounded-xl overflow-hidden border border-white/10 group relative">
                                            <img
                                                src={selectedRegistration.paymentScreenshotUrl}
                                                alt="Payment Screenshot"
                                                className="w-full h-auto object-contain bg-black"
                                            />
                                            <a
                                                href={selectedRegistration.paymentScreenshotUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 hover:bg-black/80"
                                            >
                                                Open Full <FaExternalLinkAlt size={12} />
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="h-40 bg-white/5 rounded-xl flex items-center justify-center text-gray-500 text-sm">
                                            No Payment Screenshot
                                        </div>
                                    )}

                                    {selectedRegistration.idCardUrl && (
                                        <div className="mt-4">
                                            <label className="text-xs text-gray-500 uppercase mb-2 block">College ID</label>
                                            <div className="h-24 rounded-lg overflow-hidden border border-white/10 relative">
                                                <img src={selectedRegistration.idCardUrl} alt="ID Card" className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-[#151515]">
                                {selectedRegistration.isActive ? (
                                    <span className="px-4 py-3 bg-green-500/20 text-green-500 font-bold rounded-xl flex items-center gap-2">
                                        <FaCheck size={18} /> Verified
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => handleVerifyRegistration(selectedRegistration)}
                                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-green-900/20"
                                    >
                                        <FaCheck size={18} /> Verify & Activate User
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};
