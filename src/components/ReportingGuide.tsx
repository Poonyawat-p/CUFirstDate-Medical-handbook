import { ShieldAlert, Radio, Phone, MapPin } from 'lucide-react';

export default function ReportingGuide() {
  return (
    <div id="reporting-guide-flowchart" className="bg-white border border-slate-200 rounded-lg p-4 md:p-6 shadow-sm space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-md font-bold text-slate-900 flex items-center gap-2 uppercase tracking-tight">
          <Radio className="w-5 h-5 text-blue-600 animate-pulse flex-shrink-0" />
          ผังกระบวนการ (Flowchart) การประเมินและแจ้งเหตุพยาบาล
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">แผนผังการประเมินอาการและช่องทางการสื่อสารสำหรับสตาฟทุกคนในงาน เพื่อความสะดวกรวดเร็วบนมือถือ</p>
      </div>

      {/* FLOWCHART CONTAINER */}
      <div className="flex flex-col items-center">
        {/* Step 0: Start node */}
        <div className="w-full max-w-md bg-slate-100 border border-slate-300 rounded-lg p-3 text-center shadow-sm relative z-10">
          <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-0.5">ขั้นตอนแรก</div>
          <h3 className="text-xs font-black text-slate-800 flex items-center justify-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-slate-600" />
            พบผู้ป่วย/เกิดอุบัติเหตุในงาน
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5 font-medium">เข้าประเมินและสังเกตอาการผู้ป่วยทันที</p>
        </div>

        {/* Connector Line 1 */}
        <div className="w-0.5 h-6 bg-slate-300"></div>

        {/* Decision Point */}
        <div className="w-full max-w-sm bg-blue-50 border-2 border-blue-200 rounded-xl p-3.5 text-center shadow-sm relative z-10">
          <div className="inline-block px-2 py-0.5 bg-blue-600 text-white text-[9px] font-black rounded-full uppercase tracking-wider mb-1.5">
            ตัดสินใจเลือกระดับอาการ
          </div>
          <h3 className="text-xs font-extrabold text-blue-900">
            ผู้ป่วยมีอาการอยู่ในระดับใด?
          </h3>
        </div>

        {/* Connector Line 2 & Branching visual */}
        <div className="w-0.5 h-6 bg-slate-300"></div>

        {/* 3 Branches Flow (Level 1, Level 2, Level 3) */}
        <div className="w-full flex flex-col gap-6 relative">
          
          {/* LEVEL 1 CARD (GREEN) */}
          <div className="relative">
            {/* Visual branching connectors */}
            <div className="absolute left-1/2 -top-6 bottom-0 w-0.5 bg-slate-200 -z-10 hidden md:block"></div>
            
            <div className="border-l-4 border-emerald-500 bg-emerald-50/20 rounded-r-lg p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 relative bg-white">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                    ระดับ 1: เจ็บป่วยเล็กน้อย
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">• ผู้ป่วยเดินได้เอง</span>
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 mb-1">
                  ปวดหัว, มีไข้, ตัวร้อน, แผลตื้นๆ, ท้องเสีย, คลื่นไส้เล็กน้อย
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  <span className="text-emerald-700 font-extrabold">👉 วิธีปฏิบัติ:</span> พาผู้ป่วยเดินหรือช่วยประคองเดินไปยัง <span className="underline font-bold text-slate-900">จุดพยาบาลที่ใกล้ที่สุด</span> ทันที เพื่อให้ได้รับการปฐมพยาบาล ทำแผล หรือให้ยารักษาเบื้องต้นอย่างถูกต้อง
                </p>
              </div>
              
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="w-full md:w-auto px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-md text-center flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span className="text-[11px] font-bold text-emerald-800">เดินส่งจุดพยาบาลที่ใกล้ที่สุด</span>
                </div>
              </div>
            </div>
          </div>

          {/* LEVEL 2 CARD (AMBER) */}
          <div className="relative">
            <div className="border-l-4 border-amber-500 bg-amber-50/20 rounded-r-lg p-4 border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between gap-4 bg-white">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-extrabold rounded-full uppercase tracking-wider animate-pulse">
                    ระดับ 2: เจ็บป่วยปานกลาง
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">• ผู้ป่วยเดินไม่สะดวก / นั่งพักในที่ร่ม</span>
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 mb-1">
                  ข้อเท้าพลิก/ข้อแพลง, หน้ามืด/เป็นลมแดด, มีแผลกว้างขยับตัวไม่สะดวก
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  <span className="text-amber-700 font-extrabold">👉 วิธีปฏิบัติ:</span> ให้ผู้ป่วยนั่งพักในที่ร่มก่อน แล้วโทรเรียกทีมงานจุดพยาบาลให้มาดู โดยจะมี <span className="underline font-bold text-slate-900">พยาบาลนิสิตเป็นคนเดินทางไปดูแลและประเมิน</span> อาการพร้อมกระเป๋ายาเคลื่อนที่ ณ จุดเกิดเหตุทันที
                </p>
              </div>
              
              <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2 justify-center lg:items-center">
                <div className="text-xs text-slate-400 font-bold hidden lg:block text-right pr-1">
                  สตาฟพยาบาลนิสิต <br /> เดินทางไปช่วยเหลือ
                </div>
                <a
                  href="tel:086-065-2723"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-mono font-bold rounded-lg text-xs shadow-sm transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>โทรแจ้ง ปุน#4</span>
                </a>
              </div>
            </div>
          </div>

          {/* LEVEL 3 CARD (RED) */}
          <div className="relative">
            <div className="border-l-4 border-red-500 bg-red-50/20 rounded-r-lg p-4 border border-slate-200 shadow-sm flex flex-col xl:flex-row justify-between gap-4 bg-white">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-extrabold rounded-full uppercase tracking-wider animate-pulse">
                    ระดับ 3: วิกฤต / รุนแรงสุด
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">• ห้ามเคลื่อนย้ายผู้ป่วยเองเด็ดขาด!</span>
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 mb-1">
                  ชักเกร็ง, หมดสติไม่รู้สึกตัว, ไม่หายใจ (ทำ CPR), กระดูกหักผิดรูปชัดเจน, แน่นหน้าอกรุนแรง
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  <span className="text-red-700 font-extrabold">👉 วิธีปฏิบัติ:</span> <span className="underline font-bold text-red-950">ห้ามเคลื่อนย้ายตัวผู้ป่วยเองโดยเด็ดขาด!</span> ให้เริ่มทำการกู้ชีพ (CPR) หากหมดสติไม่หายใจ และให้รีบ <span className="bg-red-100 font-extrabold px-1 text-red-950 rounded text-xs">โทรแจ้งพี่พยาบาลวิชาชีพโดยตรงทันที</span> เพื่อแจ้งพิกัดและอาการสำหรับนำเครื่อง AED หรือรถพยาบาลฉุกเฉินเข้ามาด่วนที่สุด
                </p>
              </div>
              
              <div className="flex-shrink-0 flex flex-col sm:flex-row xl:flex-col gap-2 justify-center">
                <a
                  href="tel:081-234-5678"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-mono font-bold rounded-lg text-xs shadow-sm transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>โทรพี่พยาบาล (เบอร์ 1)</span>
                </a>
                <a
                  href="tel:089-876-5432"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-500 hover:bg-red-600 active:scale-95 text-white font-mono font-bold rounded-lg text-xs shadow-sm transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>โทรพี่พยาบาล (เบอร์ 2)</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
