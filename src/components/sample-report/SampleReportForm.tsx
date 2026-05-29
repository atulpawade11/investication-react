import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    User, Mail, Phone, MapPin, Globe,
    MessageSquare, Send, Loader2, ClipboardList,
    Building2, Hash, Layers
} from 'lucide-react';
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "sonner";
import { getSampleReportForm, submitSampleReport } from '@/services/sampleReportService';

export default function SubmitCaseForm() {
    const [formFields, setFormFields] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    const [formData, setFormData] = useState<any>({
        name: '',
        email: '',
        contact_number: '',
        city: '',
        state: '',
        postcode: '',
        country: '',
        category: '',
        details: '',
    });

    useEffect(() => {
        const fetchFields = async () => {
            try {
                const res = await getSampleReportForm();
                if (res.success && res.data.inputs) {
                    setFormFields(res.data.inputs);
                }
            } catch (err) {
                console.error("Error fetching form fields:", err);
            } finally {
                setFetching(false);
            }
        };
        fetchFields();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onCaptchaChange = (token: string | null) => {
        setCaptchaToken(token);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!captchaToken) {
            toast.error("Please complete the reCAPTCHA.");
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Submitting your request...");

        try {
            const payload = {
                ...formData,
                "g-recaptcha-response": captchaToken,
            };

            const res = await submitSampleReport(payload);
            if (res.success) {
                toast.success(res.message || "Request submitted successfully!", { id: toastId });
                setFormData({
                    name: '',
                    email: '',
                    contact_number: '',
                    city: '',
                    state: '',
                    postcode: '',
                    country: '',
                    category: '',
                    details: '',
                });
                setCaptchaToken(null);
                recaptchaRef.current?.reset();
            }
        } catch (err: any) {
            toast.error(err.message || "Submission failed. Please try again.", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading form details...</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 p-8 md:p-12"
        >
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-[#04063E] mb-4">Request a Sample Report</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Standard Fields */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Full Name *</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Email Address *</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Contact Number *</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="tel"
                                name="contact_number"
                                required
                                value={formData.contact_number}
                                onChange={handleChange}
                                placeholder="+1 (234) 567-890"
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Case Category / Type *</label>
                        <div className="relative">
                            <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                name="category"
                                required
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="e.g. Forensic Analysis"
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">City</label>
                        <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="New York"
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">State / Province</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="NY"
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Postcode</label>
                        <div className="relative">
                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                name="postcode"
                                value={formData.postcode}
                                onChange={handleChange}
                                placeholder="10001"
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Country *</label>
                        <div className="relative">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                name="country"
                                required
                                value={formData.country}
                                onChange={handleChange}
                                placeholder="United States"
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Case Details / Message *</label>
                    <div className="relative">
                        <MessageSquare className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                        <textarea
                            name="details"
                            required
                            value={formData.details}
                            onChange={handleChange}
                            placeholder="Please provide some context for the report..."
                            rows={5}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none"
                        />
                    </div>
                </div>

                <div className="flex flex-col items-center gap-6">
                    <div className="scale-90 md:scale-100">
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={import.meta.env.VITE_API_URL || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                            onChange={onCaptchaChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !captchaToken}
                        className="w-full md:w-auto min-w-[200px] bg-gradient-to-r from-[#04063E] to-blue-900 text-white font-bold py-4 px-10 rounded-2xl shadow-xl shadow-blue-900/10 hover:shadow-blue-900/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        <span>Submit Request</span>
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
