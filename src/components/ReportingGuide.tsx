import { useState } from 'react';
import { ShieldAlert, Send, Copy, Check, Radio } from 'lucide-react';

export default function ReportingGuide() {
  const [reporterName, setReporterName] = useState('');
  const [location, setLocation] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [allergies, setAllergies] = useState('');
  const [phone, setPhone] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopyText = (type: 'vr' | 'line') => {
    let text = '';
    const nameStr = reporterName || '[ระบุชื่อผู้แจ้ง]';
    const locStr = location || '[ระบุสถานที่เกิดเหตุละเอียด]';
    const symStr = symptoms || '[ระบุอาการผู้ป่วย]';
    const algStr = allergies || '[ระบุประวัติแพ้ยา/โรคประจำตัว]';
    const phoneStr = phone || '[ระบุเบอร์ติดต่อ]';

    if (type === 'vr') {
      text = `แจ้งเหตุพยาบาลจาก ${nameStr} / พิกัด: ${locStr} / อาการผู้ป่วย: ${symStr} / ประวัติแพ้ยา-โรคประจำตัว: ${algStr} / เบอร์ติดต่อกลับ: ${phoneStr} / ว.2 เปลี่ยน!`;
    } else {
      text = `🚨 **แจ้งเหตุฝ่ายพยาบาล** 🚨\n• **ผู้แจ้งเหตุ:** ${nameStr}\n• **สถานที่เกิดเหตุ:** ${locStr}\n• **อาการเบื้องต้น:** ${symStr}\n• **ยาที่แพ้/โรคประจำตัว:** ${algStr}\n• **ช่องทางการติดต่อกลับ:** ${phoneStr}`;
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 md:p-6 shadow-sm">
      <div className="border-b border-slate-200 pb-4 mb-6">
        <h2 className="text-md font-bold text-slate-900 flex items-center gap-2 uppercase tracking-tight">
          <Radio className="w-5 h-5 text-blue-600 animate-pulse" />
          ขั้นตอนการแจ้งเหตุทางวิทยุ (VR) หรือโทรศัพท์มือถือ
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">การแจ้งเหตุที่รวดเร็ว ชัดเจน ช่วยลดอัตราการสูญเสียและทำให้รักษาได้ทันท่วงที</p>
      </div>

      {/* Protocol flow cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">1</span>
            <h3 className="text-sm font-bold text-emerald-900">เจ็บป่วยเล็กน้อย (ผู้ป่วยเดินได้)</h3>
            <p className="text-xs text-emerald-700 mt-1 mb-4">เช่น ปวดหัว, มีไข้ต่ำ, แผลถลอกตื้นๆ, ท้องเสียไม่รุนแรง</p>
          </div>
          <div className="text-[11px] font-semibold bg-emerald-100/50 text-emerald-800 rounded-md p-2.5">
            <strong>วิธีปฏิบัติ:</strong> พาผู้ป่วยมายัง <span className="font-bold text-emerald-900">จุดพยาบาลใกล้ที่สุด</span> เพื่อทำแผล/ให้ยา
          </div>
        </div>

        <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-amber-100 text-amber-800 text-xs font-bold mb-3">2</span>
            <h3 className="text-sm font-bold text-amber-900">เจ็บป่วยปานกลาง (ผู้ป่วยเดินไม่ได้)</h3>
            <p className="text-xs text-amber-700 mt-1 mb-4">เช่น ข้อเท้าพลิกหรือแพลง, มีแผลเหวอะหวะที่เท้า, เป็นลมหมดสติชั่วครู่</p>
          </div>
          <div className="text-[11px] font-semibold bg-amber-100/50 text-amber-800 rounded-md p-2.5">
            <strong>วิธีปฏิบัติ:</strong> <span className="font-bold text-amber-900">แจ้งพยาบาลทาง VR หรือมือถือทันที</span> ให้มาปฐมพยาบาล ณ จุดเกิดเหตุ
          </div>
        </div>

        <div className="bg-red-50/55 border border-red-100 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-red-100 text-red-800 text-xs font-bold mb-3">3</span>
            <h3 className="text-sm font-bold text-red-900">อุบัติเหตุร้ายแรง (วิกฤต)</h3>
            <p className="text-xs text-red-700 mt-1 mb-4">เช่น โดนสัตว์มีพิษกัด, ชักกระตุก, กระดูกหักหรือผิดรูป, โรคประจำตัวกำเริบ</p>
          </div>
          <div className="text-[11px] font-semibold bg-red-100/50 text-red-800 rounded-md p-2.5">
            <strong>วิธีปฏิบัติ:</strong> <span className="font-bold text-red-900">ห้ามเคลื่อนย้ายผู้ป่วย!</span> แจ้งขอข่ายฉุกเฉินและรถพยาบาลทันที
          </div>
        </div>
      </div>

      {/* Interactive Form for copy reporting template */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 md:p-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-4 flex items-center gap-1.5">
          <Send className="w-4 h-4 text-blue-600" />
          เครื่องมือช่วยร่างคำแจ้งเหตุฉุกเฉิน
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">ชื่อผู้แจ้งเหตุ</label>
            <input
              type="text"
              placeholder="เช่น โมเดล#3"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">สถานที่เกิดเหตุละเอียด</label>
            <input
              type="text"
              placeholder="เช่น บ่อน้ำ ข้างเต็นท์อำนวยการ"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">อาการที่สังเกตเห็น</label>
            <input
              type="text"
              placeholder="เช่น ขาพลิก บวม แดง เดินไม่ได้"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">ยาที่แพ้/โรคประจำตัว (ถ้ามี)</label>
            <input
              type="text"
              placeholder="เช่น ไม่มี / แพ้ยาพารา"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">เบอร์ติดต่อกลับ</label>
            <input
              type="tel"
              placeholder="เช่น 08x-xxx-xxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-5">
          <button
            onClick={() => handleCopyText('vr')}
            className="flex-1 inline-flex justify-center items-center gap-1.5 px-4 py-2.5 rounded-md bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 active:scale-95 transition-all shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            คัดลอกส่งวิทยุสตาฟ (VR)
          </button>
          <button
            onClick={() => handleCopyText('line')}
            className="flex-1 inline-flex justify-center items-center gap-1.5 px-4 py-2.5 rounded-md bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
            คัดลอกส่งเข้ากลุ่ม Line
          </button>
        </div>
      </div>
    </div>
  );
}
