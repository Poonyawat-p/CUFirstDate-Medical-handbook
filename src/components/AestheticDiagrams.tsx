import { Activity, Thermometer, Wind, Zap } from 'lucide-react';

export function RiceDiagram() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 md:p-6 shadow-sm">
      <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-1.5 uppercase tracking-tight">
        <Activity className="w-4 h-4 text-blue-600" />
        หลักการปฐมพยาบาล R-I-C-E (สำหรับข้อเท้าแพลง/เคล็ด)
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center font-extrabold text-sm mx-auto mb-2 border border-indigo-100">R</div>
          <div className="text-xs font-bold text-slate-900">Rest (พัก)</div>
          <p className="text-[10px] text-slate-500 mt-1">หยุดเดิน ลงน้ำหนักเท้าข้างที่เจ็บ</p>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="w-8 h-8 rounded bg-sky-50 text-sky-600 flex items-center justify-center font-extrabold text-sm mx-auto mb-2 border border-sky-100">I</div>
          <div className="text-xs font-bold text-slate-900">Ice (ประคบเย็น)</div>
          <p className="text-[10px] text-slate-500 mt-1">ประคบเย็นครั้งละ 15-20 นาที ลดบวม</p>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="w-8 h-8 rounded bg-amber-50 text-amber-600 flex items-center justify-center font-extrabold text-sm mx-auto mb-2 border border-amber-100">C</div>
          <div className="text-xs font-bold text-slate-900">Compression (พัน)</div>
          <p className="text-[10px] text-slate-500 mt-1">พันผ้ายืดพยุงข้อเท้าให้กระชับ</p>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center font-extrabold text-sm mx-auto mb-2 border border-emerald-100">E</div>
          <div className="text-xs font-bold text-slate-900">Elevation (ยกสูง)</div>
          <p className="text-[10px] text-slate-500 mt-1">ยกขาสูงหนุนเหนือระดับหัวใจ</p>
        </div>
      </div>
    </div>
  );
}

export function HeatstrokeDiagram() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 md:p-6 shadow-sm">
      <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-1.5 uppercase tracking-tight">
        <Thermometer className="w-4 h-4 text-red-500" />
        สัญญาณเตือนภาวะอันตราย: เพลียแดด vs ลมแดด (Heat Stroke)
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Heat Exhaustion */}
        <div className="p-4 bg-amber-50/30 border border-amber-200 rounded-lg space-y-2">
          <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
            <Wind className="w-4 h-4 text-amber-500" />
            เพลียแดด (Heat Exhaustion)
          </div>
          <ul className="text-xs text-amber-700 space-y-1 list-disc pl-4 font-semibold">
            <li>ตัวรุมๆ อุณหภูมิต่ำกว่า 40°C</li>
            <li><strong className="text-amber-900">เหงื่อออกเยอะมาก</strong> ตัวเปียก</li>
            <li>เวียนศีรษะ ปวดหัว อ่อนเพลีย</li>
            <li>ชีพจรเต้นเร็ว อ่อนแรง</li>
          </ul>
          <p className="text-[10px] text-amber-600 bg-white border border-amber-100 rounded-md p-2 mt-2">
            <strong>วิธีรักษา:</strong> ย้ายเข้าที่ร่ม เช็ดตัว จิบน้ำเกลือแร่หรือน้ำเย็น
          </p>
        </div>

        {/* Heat Stroke */}
        <div className="p-4 bg-red-50 border border-red-100 rounded-lg space-y-2">
          <div className="flex items-center gap-1.5 text-red-900 font-bold text-xs">
            <Zap className="w-4 h-4 text-red-500 animate-pulse" />
            ลมแดด (Heat Stroke) - วิกฤต!
          </div>
          <ul className="text-xs text-red-700 space-y-1 list-disc pl-4 font-semibold">
            <li>ตัวร้อนจัด อุณหภูมิร่างกายสูงเกิน 40°C</li>
            <li><strong className="text-red-950">ไม่มีเหงื่อออกเลย ผิวแห้งและแดง</strong></li>
            <li>สับสน ซึม ชักเกร็ง หรือหมดสติ</li>
            <li>ชีพจรเต้นเร็ว แรงสม่ำเสมอ</li>
          </ul>
          <p className="text-[10px] text-red-900 bg-white border border-red-200 rounded-md p-2 mt-2 font-bold">
            ⚠️ วิธีรักษา: นำส่งโรงพยาบาลด่วน! ย้ายเข้าที่ร่ม ถอดเสื้อผ้า เช็ดตัวย้อนรูขุมขน ประคบรักแร้ ขาหนีบ คอ ด้วยเจลเย็น
          </p>
        </div>
      </div>
    </div>
  );
}
