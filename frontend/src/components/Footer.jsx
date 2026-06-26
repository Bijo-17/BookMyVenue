

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Sparkles,
  MapPin,
  Mail,
  Phone,
  ArrowUp,
  Send,
  Heart,
  ChevronRight,
} from "lucide-react";

const QUICK_LINKS = [
  { label: "Explore Venues", to: "/" },
  { label: "Categories", to: "/" },
  { label: "Cities", to: "/" },
  { label: "Become a Host", to: "/" },
  { label: "About Us", to: "/" },
  { label: "Careers", to: "/" },
];

const SUPPORT_LINKS = [
  { label: "Help Center", to: "/" },
  { label: "FAQs", to: "/" },
  { label: "Contact Us", to: "/" },
  { label: "Terms of Service", to: "/" },
  { label: "Privacy Policy", to: "/" },
  { label: "Cancellation Policy", to: "/" },
];

const TOP_CITIES = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
  "Jaipur",
];

const SOCIALS = [
  { icon: 'Instagram', label: "Instagram", href: "#" },
  { icon: 'Facebook', label: "Facebook", href: "#" },
  { icon: 'Twitter', label: "Twitter", href: "#" },
  { icon: 'Linkedin', label: "LinkedIn", href: "#" },
  { icon: 'Youtube', label: "YouTube", href: "#" },
];

const Footer = ()=> {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      setSubscribed(false);
      return;
    }
    setError("");
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#EBE2E0] text-[#2D3436] overflow-hidden">
      {/* Decorative top gradient bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#990302] via-[#2D3436] to-[#990302]" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 pb-8">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#990302] to-[#2D3436] text-white shadow-lg group-hover:shadow-xl transition-shadow">
                <Sparkles size={20} strokeWidth={2.4} />
              </span>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-[#2D3436]">
                  BookMyVenue
                </span>
                <span className="text-xs text-[#990302] font-medium tracking-wide">
                  Find · Book · Celebrate
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-[#2D3436]/80 max-w-xs">
              India's most trusted venue booking platform. Discover handpicked
              spaces for weddings, parties, corporate events, and celebrations
              in 40+ cities.
            </p>

            {/* Newsletter */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#990302]/10">
              <h3 className="text-sm font-semibold text-[#2D3436] mb-1">
                Subscribe to our newsletter
              </h3>
              <p className="text-xs text-[#2D3436]/70 mb-4">
                Get exclusive venue deals and event planning tips.
              </p>
              <form onSubmit={handleSubscribe} className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your email"
                  className="w-full pl-4 pr-12 py-3 rounded-xl bg-[#EBE2E0]/50 border border-[#2D3436]/10 text-sm focus:outline-none focus:ring-2 focus:ring-[#990302]/30 focus:border-[#990302] placeholder:text-[#2D3436]/40 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-[#990302] text-white hover:bg-[#7a0202] active:scale-95 transition-all"
                  aria-label="Subscribe"
                >
                  <Send size={16} />
                </button>
              </form>
              {error && (
                <p className="mt-2 text-xs text-[#990302]">{error}</p>
              )}
              {subscribed && (
                <p className="mt-2 text-xs text-green-600 font-medium">
                  Thanks for subscribing!
                </p>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-[#2D3436] uppercase tracking-wider mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="group inline-flex items-center text-sm text-[#2D3436]/80 hover:text-[#990302] transition-colors"
                  >
                    <ChevronRight
                      size={14}
                      className="mr-1 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#990302]"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-[#2D3436] uppercase tracking-wider mb-5">
              Support
            </h3>
            <ul className="space-y-3">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="group inline-flex items-center text-sm text-[#2D3436]/80 hover:text-[#990302] transition-colors"
                  >
                    <ChevronRight
                      size={14}
                      className="mr-1 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#990302]"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Cities */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-[#2D3436] uppercase tracking-wider mb-5">
              Top Cities
            </h3>
            <div className="flex flex-wrap gap-2">
              {TOP_CITIES.map((city) => (
                <Link
                  key={city}
                  to="/"
                  className="px-3 py-1.5 text-xs font-medium rounded-full bg-white border border-[#2D3436]/10 text-[#2D3436]/80 hover:border-[#990302] hover:text-[#990302] hover:shadow-sm transition-all"
                >
                  {city}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-[#2D3436] uppercase tracking-wider mb-5">
              Get in Touch
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-[#2D3436]/10 text-[#990302] shrink-0">
                  <MapPin size={15} />
                </span>
                <span className="text-sm text-[#2D3436]/80">
                  123 Celebration Lane,
                  <br />
                  Mumbai, Maharashtra 400001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-[#2D3436]/10 text-[#990302] shrink-0">
                  <Phone size={15} />
                </span>
                <a
                  href="tel:+919876543210"
                  className="text-sm text-[#2D3436]/80 hover:text-[#990302] transition-colors"
                >
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-[#2D3436]/10 text-[#990302] shrink-0">
                  <Mail size={15} />
                </span>
                <a
                  href="mailto:hello@bookmyvenue.com"
                  className="text-sm text-[#2D3436]/80 hover:text-[#990302] transition-colors"
                >
                  hello@bookmyvenue.com
                </a>
              </li>
            </ul>

            {/* Socials */}
            <div className="mt-6">
              <h4 className="text-xs font-semibold text-[#2D3436]/70 mb-3">
                Follow us
              </h4>
              <div className="flex flex-wrap gap-2">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-white border border-[#2D3436]/10 text-[#2D3436]/70 hover:bg-[#990302] hover:text-white hover:border-[#990302] hover:-translate-y-0.5 transition-all"
                  >
                    <social.icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-gradient-to-r from-transparent via-[#2D3436]/20 to-transparent" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-center md:text-left text-[#2D3436]/60">
            © {new Date().getFullYear()} BookMyVenue. Made with{" "}
            <Heart
              size={12}
              className="inline text-[#990302] fill-[#990302]"
            />{" "}
            in India. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-xs text-[#2D3436]/60 hover:text-[#990302] transition-colors"
            >
              Terms
            </Link>
            <Link
              to="/"
              className="text-xs text-[#2D3436]/60 hover:text-[#990302] transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/"
              className="text-xs text-[#2D3436]/60 hover:text-[#990302] transition-colors"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>

      {/* Back to top */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-[#990302] text-white shadow-lg hover:bg-[#7a0202] hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all"
        aria-label="Back to top"
      >
        <ArrowUp size={20} />
      </button>
    </footer>
  );
}

export default Footer;