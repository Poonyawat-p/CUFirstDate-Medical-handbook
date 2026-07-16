import { useState, useEffect } from 'react';
import { ShieldAlert, PhoneCall, BookOpen, Download, Phone } from 'lucide-react';
import { contactsData } from '../contacts';

export default function Header() {
  const [isPastAfternoonShift, setIsPastAfternoonShift] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      // Target time: 18 July 2026, 13:00:00 ICT (Thailand time)
      const targetTime = new Date('2026-07-18T13:00:00+07:00');
      setIsPastAfternoonShift(new Date() >= targetTime);
    };
    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Take first 4 contacts (2 RNs + 2 PNs), and filter out morning shift (08:00 - 12:00) if current time is past 13:00 of 18/07/2026
  const quickContacts = contactsData.slice(0, 4).filter(contact => {
    if (isPastAfternoonShift) {
      return !contact.description.includes('08:00 - 12:00');
    }
    return true;
  });

  const punContact = contactsData.find(c => c.name.includes('ปุญ'));

  return (
    <header className="bg-white text-slate-800 border-l-4 border-blue-600 border-t border-r border-b border-slate-200 rounded-lg p-6 relative overflow-hidden shadow-sm">
      <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
              พยาบาล 101 — CU First Date 2026
            </div>
            <a
              href="https://drive.google.com/drive/folders/1LXZfF7kmWrWZ00SS0Ng7nsQ_e-kzkjDg?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold border border-blue-200 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>ดาวน์โหลด PDF คู่มือฉบับเต็ม</span>
            </a>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 mb-1 font-sans">
            คู่มือการรักษาพยาบาลและขั้นตอนแจ้งเหตุเบื้องต้น
          </h1>
          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            เว็บไซต์ขนาดเล็กที่ออกแบบมาให้โหลดง่ายเป็นพิเศษ ประหยัดการใช้ปริมาณข้อมูลมือถือ (เน็ตต่ำ) สำหรับสตาฟและพยาบาลนิสิตจำนวน 50 คน ใช้ในการเปิดเป็นแนวทางการทำงานและปฐมพยาบาลในวันงานของจุฬาฯ
          </p>
        </div>

        {/* Quick Contacts Panel */}
        <div className="w-full lg:w-auto bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col gap-3 min-w-[280px]">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <PhoneCall className="w-3 h-3 text-slate-500" />
            แตะโทรออกเหตุด่วน (คลิกโทรได้ทันที)
          </div>
          
          <div className="space-y-2">
            {quickContacts.map((contact, i) => (
              <div key={i} className="flex justify-between items-center text-xs gap-3">
                <div className="min-w-0">
                  <span className="text-slate-700 font-bold block truncate">{contact.name}</span>
                  <span className="text-[10px] text-slate-400 block truncate">{contact.description}</span>
                </div>
                <a 
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-mono font-bold hover:bg-emerald-100 border border-emerald-200 transition-all flex-shrink-0 text-[11px]"
                >
                  <Phone className="w-3 h-3 text-emerald-600" />
                  {contact.phone}
                </a>
              </div>
            ))}

            {punContact && (
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs gap-3">
                <div className="min-w-0">
                  <span className="text-blue-950 font-extrabold block truncate flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    {punContact.name}
                  </span>
                  <span className="text-[10px] text-blue-600 font-semibold block truncate">
                    {punContact.description}
                  </span>
                </div>
                <a 
                  href={`tel:${punContact.phone}`}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-100 text-blue-700 font-mono font-bold hover:bg-blue-200 border border-blue-200 transition-all flex-shrink-0 text-[11px]"
                >
                  <Phone className="w-3 h-3 text-blue-600" />
                  {punContact.phone}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick notice of bolded emergency items */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span>ข้อมูลอิงตามคู่มือปฐมพยาบาล สภากาชาดไทย และ Basic Life Support (TRC)</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-rose-600">
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          <span>หัวข้ออักษรหนา <strong className="text-slate-900 font-bold underline">ลมแดด / ชัก / CPR / Stroke</strong> ให้รีบแจ้งพี่พยาบาลทันที!</span>
        </div>
      </div>
    </header>
  );
}
