import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Send, Loader2 } from 'lucide-react';
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "sonner";
import { sendContact } from '@/services/contactService';

interface QueryFormProps {
  serviceTitle?: string;
}

export default function QueryForm({ serviceTitle }: QueryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    const toastId = toast.loading("Sending your query...");

    try {
      const payload = {
        ...formData,
        subject: "Inquiry",
        "g-recaptcha-response": captchaToken,
      };

      const res = await sendContact(payload);
      if (res.success) {
        toast.success(res.message || "Contact message sent successfully!", { id: toastId });
        setFormData({
          name: '',
          phone: '',
          email: '',
          message: ''
        });
        setCaptchaToken(null);
        recaptchaRef.current?.reset();
      }
    } catch (err: any) {
      console.error("Caught error:", err);
      toast.error(err.message || "Failed to send query. Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
      <div className="flex items-center gap-2 mb-6 border-b pb-2">
        <Send size={18} className="text-[#044782]" />
        <h3 className="text-lg font-bold text-gray-800">Ask Your Query</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-bold text-gray-700 ml-1 block mb-1 uppercase">Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#044782] focus:border-[#044782]"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-gray-700 ml-1 block mb-1 uppercase">Mobile</label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter mobile number"
            className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#044782] focus:border-[#044782]"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-gray-700 ml-1 block mb-1 uppercase">E-mail</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#044782] focus:border-[#044782]"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-gray-700 ml-1 block mb-1 uppercase">Query</label>
          <textarea
            name="message"
            required
            value={formData.message}
            onChange={handleChange}
            placeholder={serviceTitle ? `Enter your query about ${serviceTitle}...` : "Type your query here..."}
            className="w-full border border-gray-200 rounded-lg p-2.5 text-sm h-28 focus:outline-none focus:ring-1 focus:ring-[#044782] focus:border-[#044782] resize-none"
          />
        </div>

        <div className="flex justify-center py-2 scale-90 origin-center">
          {mounted && (
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_API_URL || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
              onChange={onCaptchaChange}
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading || (mounted && !captchaToken)}
          className="w-full bg-gradient-to-r from-[#0B10A4] to-[#04063E] text-white px-10 py-3 rounded-full font-bold flex items-center justify-center gap-4 cursor-pointer border-none no-underline transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : "Submit Query"} <ChevronRight size={16} />
        </button>
      </form>
    </div>
  );
}
