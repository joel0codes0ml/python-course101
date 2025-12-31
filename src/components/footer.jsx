import React from 'react';

const Footer = ({ languages }) => (
  <footer className="bg-[#0b0f1a] border-t border-slate-800 pt-16 pb-8 px-8">
    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
      <div className="col-span-2 md:col-span-1">
        <h2 className="font-bold text-white mb-4">CODDY<span className="text-blue-500">CLONE</span></h2>
        <button className="text-[10px] bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold">REFER A FRIEND</button>
      </div>
      <FooterCol title="Company" links={["Home", "About", "Affiliate", "Businesses"]} />
      <FooterCol title="Resources" links={["Blog", "Support", "Contact", "FAQs"]} />
      <FooterCol title="Languages" links={languages.map(l => l.toUpperCase())} />
      <FooterCol title="Subjects" links={["Data Science", "Web Dev", "AI", "Software Dev"]} />
    </div>
    <div className="max-w-7xl mx-auto border-t border-slate-900 pt-8 text-[10px] text-slate-600 flex justify-between">
      <span>© 2025 CoddyClone Inc.</span>
      <div className="flex gap-4"><span>Privacy</span><span>Terms</span></div>
    </div>
  </footer>
);

const FooterCol = ({ title, links }) => (
  <div>
    <h4 className="text-[10px] text-white font-bold uppercase mb-4 tracking-widest">{title}</h4>
    <ul className="text-xs text-slate-500 space-y-2">
      {links.map(l => <li key={l} className="hover:text-blue-500 cursor-pointer">{l}</li>)}
    </ul>
  </div>
);

export default Footer;
