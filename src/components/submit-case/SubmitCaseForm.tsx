import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    User, Mail, Phone, Globe, MapPin,
    MessageSquare, Send, Loader2, Layers
} from 'lucide-react';
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "sonner";
import { submitSampleReport, getQuoteData } from '@/services/sampleReportService';

export default function SubmitCaseForm() {
    const [loading, setLoading] = useState(false);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    const [formData, setFormData] = useState<any>({
        name: '',
        email: '',
        contact_number: '',
        address: '',
        country: '',
        'Case/Report_Type': '',
        details: '',
    });

    const [categories, setCategories] = useState<any[]>([]);
    const [inputs, setInputs] = useState<any[]>([]);

    const [files, setFiles] = useState<{ [key: string]: File | null }>({
        nda: null, nda2: null, nda3: null,
        nda4: null, nda5: null, nda6: null
    });

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getQuoteData();
                if (res.success) {
                    setCategories(res.data.categories || []);
                    setInputs(res.data.inputs || []);
                }
            } catch (err) {
                console.error("Failed to fetch quote data", err);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        if (e.target.files && e.target.files[0]) {
            setFiles(prev => ({ ...prev, [key]: e.target.files![0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!captchaToken) {
            toast.error("Please complete the reCAPTCHA.");
            return;
        }

        setLoading(true);
        try {
            const submitData = new FormData();
            Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
            Object.keys(files).forEach(key => {
                if (files[key]) submitData.append(key, files[key] as File);
            });
            submitData.append("g-recaptcha-response", captchaToken);

            const res = await submitSampleReport(submitData);
            if (res.success) {
                toast.success("Submitted successfully!");
                setFormData({ name: '', email: '', contact_number: '', address: '', country: '', 'Case/Report_Type': '', details: '' });
                setFiles({ nda: null, nda2: null, nda3: null, nda4: null, nda5: null, nda6: null });
                recaptchaRef.current?.reset();
            }
        } catch (err: any) {
            toast.error("Submission failed.");
        } finally {
            setLoading(false);
        }
    };

    // UI Helpers based on screenshot 2
    const labelStyle = "text-sm font-bold text-gray-700 ml-1 mb-2 block";
    const inputContainer = "relative flex items-center";
    const iconStyle = "absolute left-4 text-gray-400 w-5 h-5";
    const fieldStyle = "w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 text-gray-700";

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-6xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-50"
        >
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                        <label className={labelStyle}>Full Name *</label>
                        <div className={inputContainer}>
                            <User className={iconStyle} />
                            <input type="text" name="name" placeholder="John Doe" onChange={handleChange} value={formData.name} required className={fieldStyle} />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className={labelStyle}>Email Address *</label>
                        <div className={inputContainer}>
                            <Mail className={iconStyle} />
                            <input type="email" name="email" placeholder="john@example.com" onChange={handleChange} value={formData.email} required className={fieldStyle} />
                        </div>
                    </div>

                    {/* Dynamic Inputs */}
                    {inputs.map((input) => {
                        if (input.name === 'details' || input.name === 'Case/Report_Type') return null;

                        let Icon = Phone;
                        if (input.name === 'address') Icon = MapPin;
                        if (input.name === 'country') Icon = Globe;

                        return (
                            <div key={input.id}>
                                <label className={labelStyle}>{input.label} {input.required ? '*' : ''}</label>
                                <div className={inputContainer}>
                                    <Icon className={iconStyle} />
                                    <input
                                        type={input.type === 1 ? "text" : "text"}
                                        name={input.name}
                                        placeholder={input.placeholder}
                                        onChange={handleChange}
                                        value={formData[input.name] || ''}
                                        required={!!input.required}
                                        className={fieldStyle}
                                    />
                                </div>
                            </div>
                        );
                    })}

                    {/* Case Type/Category */}
                    <div>
                        <label className={labelStyle}>Case Category / Type *</label>
                        <div className={inputContainer}>
                            <Layers className={iconStyle} />
                            <select name="Case/Report_Type" onChange={handleChange} value={formData['Case/Report_Type']} required className={fieldStyle}>
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Details */}
                {inputs.find(i => i.name === 'details') && (
                    <div>
                        <label className={labelStyle}>{inputs.find(i => i.name === 'details').label} *</label>
                        <div className="relative">
                            <MessageSquare className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                            <textarea
                                name="details"
                                placeholder={inputs.find(i => i.name === 'details').placeholder}
                                rows={4}
                                onChange={handleChange}
                                value={formData.details}
                                required
                                className={`${fieldStyle} resize-none`}
                            />
                        </div>
                    </div>
                )}

                {/* 6 Upload Fields (Grid from Screenshot 1, Styling from Screenshot 2) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                    {[1, 2, 3, 4, 5, 6].map((num) => {
                        const fileKey = num === 1 ? 'nda' : `nda${num}`;
                        return (
                            <div key={num} className="space-y-2">
                                <label className="text-xs font-bold text-[#04063E] uppercase tracking-wider ml-1">Document {num}</label>
                                <input
                                    type="file"
                                    onChange={(e) => handleFileChange(e, fileKey)}
                                    className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                />
                                <p className="text-[10px] text-[#F9A01B] font-bold leading-tight ml-1">
                                    ** Only doc, docx, pdf, rtf, txt, zip, rar files are allowed
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Footer Section */}
                <div className="flex flex-col items-center gap-8 pt-6">
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={import.meta.env.VITE_API_URL || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                        onChange={(token) => setCaptchaToken(token)}
                    />
                    <button
                        type="submit"
                        disabled={loading || !captchaToken}
                        className="w-full md:w-auto min-w-[220px] bg-[#04063E] text-white font-bold py-4 px-10 rounded-2xl shadow-lg hover:bg-black hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        <span>Submit Case</span>
                    </button>
                </div>
            </form>
        </motion.div>
    );
}