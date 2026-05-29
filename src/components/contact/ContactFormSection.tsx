import { useState, useRef, useEffect } from "react";
import { ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { submitContactForm } from '@/services/contactService';
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "sonner";

export default function ContactFormSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    details: "",
  });
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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
    const toastId = toast.loading("Sending your message...");

    try {
      const payload = {
        ...form,
        "g-recaptcha-response": captchaToken,
      };

      const res = await submitContactForm(payload);
      if (res.success) {
        toast.success(res.message || "Message sent successfully!", { id: toastId });
        setForm({
          name: "",
          email: "",
          mobile: "",
          address: "",
          details: "",
        });
        setCaptchaToken(null);
        recaptchaRef.current?.reset();
      }
    } catch (err: any) {
      console.error("Caught error:", err);
      toast.error(err.message || "Failed to send message. Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white pb-20 border-t border-gray-50">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-4 text-3xl md:text-[30px] font-bold text-black">Drop Us a Line</h2>
          <p className="text-[#777777] text-[14px] font-regular">Have a question or comment? Use the form below to send us a message.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-1">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full name"
                required
                className="w-full p-4 bg-white border border-[#D9D9D9] font-regular text-[14px] rounded-lg outline-none focus:border-[#F6BA13] transition-colors"
              />
            </div>
            <div className="space-y-1">
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="w-full p-4 bg-white border-[#D9D9D9] font-regular text-[14px] border rounded-lg outline-none focus:border-[#F6BA13] transition-colors"
              />
            </div>
            <div className="space-y-1">
              <input
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="Mobile"
                required
                className="w-full p-4 bg-white border-[#D9D9D9] font-regular text-[14px] border rounded-lg outline-none focus:border-[#F6BA13] transition-colors"
              />
            </div>
            <div className="space-y-1">
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full p-4 bg-white border-[#D9D9D9] font-regular text-[14px] border rounded-lg outline-none focus:border-[#F6BA13] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <textarea
              name="details"
              rows={4}
              value={form.details}
              onChange={handleChange}
              placeholder="Query"
              required
              className="w-full p-4 bg-white border-[#D9D9D9] font-regular text-[14px] border rounded-lg outline-none focus:border-[#F6BA13] transition-colors"
            />
          </div>

          <div className="flex flex-col items-center justify-start gap-6 mt-2">
            {mounted && (
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={import.meta.env.VITE_API_URL || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"} 
                onChange={onCaptchaChange}
              />
            )}

            <button
              disabled={loading || (mounted && !captchaToken)}
              className="bg-gradient-to-r from-[#0B10A4] to-[#04063E] text-white px-10 py-3 rounded-full font-bold flex items-center justify-start gap-4 cursor-pointer border-none no-underline transition-all hover:opacity-90"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Submit"}
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
