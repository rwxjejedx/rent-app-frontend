import { Building2, Mail, Phone, Instagram, Twitter, Facebook } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-white border-t border-slate-100 text-slate-600">
    <div className="mx-auto max-w-7xl px-4 pb-8 pt-14 md:px-8">
      <div className="mb-12 grid gap-10 md:grid-cols-4">

        {/* Brand */}
        <div className="md:col-span-1">
          <div className="mb-6 flex items-center gap-2.5">
            <Link to="/" className="flex items-center gap-2.5">
              <img src="/full-logo.png" className="h-9 w-auto" alt="anta.com" />
            </Link>
          </div>
          <p className="text-sm leading-relaxed text-slate-500 font-medium">
            Your trusted platform for discovering the perfect rental property across Indonesia.
          </p>
          <div className="mt-8 flex gap-3">
            {[Instagram, Twitter, Facebook].map((Icon, i) => (
              <button key={i} className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all hover:bg-slate-950 hover:text-white">
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-950">Explore</h4>
          <ul className="space-y-4 text-sm font-medium">
            {["All Properties", "Hotels", "Villas", "Apartments", "Resorts"].map(link => (
              <li key={link}>
                <a href="#" className="text-slate-500 transition-colors hover:text-slate-950">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-950">Company</h4>
          <ul className="space-y-4 text-sm font-medium">
            {["About Us", "Careers", "Blog", "Press", "Partners"].map(link => (
              <li key={link}>
                <a href="#" className="text-slate-500 transition-colors hover:text-slate-950">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-950">Contact</h4>
          <ul className="space-y-4 text-sm font-medium text-slate-500">
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-slate-400" />
              hello@anta.com
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-slate-400" />
              +62 812 9730 8567
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col items-center justify-between gap-6 border-t border-slate-100 pt-8 text-xs font-medium text-slate-400 md:flex-row">
        <p>© 2026 anta.com. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-950 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-950 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-950 transition-colors">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
