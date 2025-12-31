import React from 'react';

const Footer = ({ languages }) => {
  const Column = ({ title, links }) => (
    <div>
      <h4 className="text-[10px] text-white font-bold uppercase mb-4 tracking-[0.2em]">{title}</h4>
      <ul className="text-xs text-slate-500 space-y-2.5">
        {links.map(l => (
          <li key={l} className="hover:text-blue-500 cursor-pointer transition-colors">{l}</li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="bg-[#020617] border-t border-slate-800 pt-16 pb-8 px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
        
        <div className="col-span-2 md:col-span-1">
          <h2 className="font-black text-white text-xl tracking-tighter mb-4">ZENIN<span className="text-blue-500">LABS</span></h2>
          <div className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-xl">
             <p className="text-blue-500 text-[9px] font-bold uppercase mb-1">Spread the word</p>
             <h4 className="text-xs font-bold text-white mb-2 uppercase">Refer a Friend</h4>
             <button className="text-[9px] bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg font-bold transition-all">INVITE NOW</button>
          </div>
        </div>

        <Column title="Company" links={["Home", "About", "Affiliate", "Businesses"]} />
        <Column title="Resources" links={["Blog", "Support", "Contact", "FAQs"]} />
        <Column title="Languages" links={languages.map(l => l.toUpperCase())} />
        <Column title="Subjects" links={["Data Science", "Web Dev", "AI", "Software Dev"]} />
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-900 pt-8 text-[10px] text-slate-600 flex justify-between uppercase font-bold tracking-widest">
        <span>© 2025 ZeninLabs Inc.</span>
        <div className="flex gap-6">
          <span className="hover:text-white cursor-pointer">Privacy Policy</span>
          <span className="hover:text-white cursor-pointer">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
