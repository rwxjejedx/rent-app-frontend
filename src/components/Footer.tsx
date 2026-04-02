import { Building2, Mail, Phone, Instagram, Twitter, Facebook } from "lucide-react";

const Footer = () => (
  <footer className="bg-navy-gradient text-white">
    <div className="mx-auto max-w-7xl px-4 pb-8 pt-14 md:px-8">
      <div className="mb-12 grid gap-10 md:grid-cols-4">

        {/* Brand */}
        <div className="md:col-span-1">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-gradient">
              <Building2 className="h-5 w-5 text-[var(--color-navy-950)]" />
            </div>
            <span className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>StayEase</span>
          </div>
          <p className="text-sm leading-relaxed text-white/60">
            Your trusted platform for discovering the perfect rental property across Indonesia.
          </p>
          <div className="mt-5 flex gap-3">
            {[Instagram, Twitter, Facebook].map((Icon, i) => (
              <button key={i} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/60 transition hover:bg-white/20 hover:text-white">
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/40">Explore</h4>
          <ul className="space-y-2.5 text-sm">
            {["All Properties", "Hotels", "Villas", "Apartments", "Resorts"].map(link => (
              <li key={link}>
                <a href="#" className="text-white/60 transition hover:text-white">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/40">Company</h4>
          <ul className="space-y-2.5 text-sm">
            {["About Us", "Careers", "Blog", "Press", "Partners"].map(link => (
              <li key={link}>
                <a href="#" className="text-white/60 transition hover:text-white">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/40">Contact</h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-[var(--color-gold-400)]" />
              hello@stayease.id
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-[var(--color-gold-400)]" />
              +62 21 1234 5678
            </li>
          </ul>
          <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-xs font-semibold text-white/80">List your property</p>
            <p className="mt-0.5 text-xs text-white/50">Join 10,000+ landlords on StayEase</p>
            <button className="mt-3 w-full rounded-lg bg-gold-gradient py-2 text-xs font-bold text-[var(--color-navy-950)]">
              Become a Tenant →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row">
        <p>© 2026 StayEase. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white/70">Privacy Policy</a>
          <a href="#" className="hover:text-white/70">Terms of Service</a>
          <a href="#" className="hover:text-white/70">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
