import { useState } from 'react';
import Header from './components/Header';
import InteractiveMap from './components/InteractiveMap';
import ReportingGuide from './components/ReportingGuide';
import MedicalGuideSection from './components/MedicalGuideSection';
import IncidentLogger from './components/IncidentLogger';
import { RiceDiagram, HeatstrokeDiagram } from './components/AestheticDiagrams';
import { contactsData } from './contacts';
import { 
  LayoutGrid, MapPin, Radio, ShieldAlert, BookOpen, HeartHandshake, 
  Phone, PhoneCall, Download, FileText, ChevronRight, Users 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type TabId = 'guides' | 'schedule' | 'report' | 'record' | 'diagrams' | 'contacts';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('guides');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('จุดอำนวยการลานบรม');

  const tabs = [
    { id: 'guides', label: 'คู่มือ 18 อาการ', icon: BookOpen, count: 18 },
    { id: 'schedule', label: 'ตารางเวร & จุดสตาฟ', icon: MapPin },
    { id: 'report', label: 'วิทยุสื่อสาร & แจ้งเหตุ', icon: Radio },
    { id: 'record', label: 'บันทึกเคส & การใช้ยา', icon: FileText },
    { id: 'diagrams', label: 'ภาพประกอบรักษา', icon: HeartHandshake },
    { id: 'contacts', label: 'เบอร์ติดต่อด่วน', icon: Phone },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Main Header Card */}
        <Header />

        {/* Info banners about emergency procedures (Always visible at top for high priority safety) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
          <div className="flex items-start gap-3">
            <span className="p-2 bg-blue-50 text-blue-600 rounded flex-shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-xs font-bold text-slate-900">กรณีไม่หายใจ / ไม่มีชีพจร (CPR)</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                ทำ CPR (กดหน้าอก) ทันที ความลึก 5-6 ซม. ความเร็ว 100-120 ครั้งต่อนาที ตามจังหวะเพลง <strong>คุกกี้เสี่ยงทาย-BNK48</strong> และเรียกหา <strong>AED</strong> ทันที!
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="p-2 bg-red-50 text-red-600 rounded flex-shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-xs font-bold text-slate-900">กรณีเกิดอาการชักเกร็ง</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                เคลียร์พื้นที่ปลอดภัย รองนุ่มใต้หัวจับนอนตะแคง <strong>ห้ามงัดปากหรือยัดอะไรเข้าปากผู้ป่วยเด็ดขาด!</strong> เพราะอาจอุดตันหลอดลมและฟันหักได้
              </p>
            </div>
          </div>
        </div>

        {/* Quick horizontal tab-bar for mobile screens (Sticky) */}
        <div className="block md:hidden sticky top-0 z-40 -mx-4 px-4 py-2 bg-slate-50/95 backdrop-blur-sm border-b border-slate-200">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-3.5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {'count' in tab && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Layout: Sidebar + main content */}
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Left Sidebar Menu (visible on md screens & above) */}
          <aside className="hidden md:block w-64 flex-shrink-0 space-y-4">
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm sticky top-6 space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  เมนูนำทางรวดเร็ว
                </h3>
              </div>
              
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-2'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950 pl-3'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span>{tab.label}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {'count' in tab && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                            isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {tab.count}
                          </span>
                        )}
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                      </div>
                    </button>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                <a
                  href="https://drive.google.com/drive/folders/1LXZfF7kmWrWZ00SS0Ng7nsQ_e-kzkjDg?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded shadow text-xs transition-all active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ดาวน์โหลด PDF ฉบับเต็ม</span>
                </a>
                <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                  สแกนหรือเปิดคู่มือเพื่อบันทึกเก็บไว้อ่านออฟไลน์ได้ทุกเมื่อ
                </p>
              </div>
            </div>
          </aside>

          {/* Right main panel with dynamic transitions */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                {/* 1. First Aid guidelines tab */}
                {activeTab === 'guides' && (
                  <MedicalGuideSection
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                  />
                )}

                {/* 2. Map and Shift Schedule tab */}
                {activeTab === 'schedule' && (
                  <InteractiveMap
                    selectedLocation={selectedLocation}
                    onLocationSelect={setSelectedLocation}
                  />
                )}

                {/* 3. Reporting protocol tab */}
                {activeTab === 'report' && (
                  <ReportingGuide />
                )}

                {/* 3.5. Record case / Medicine Usage tab */}
                {activeTab === 'record' && (
                  <IncidentLogger />
                )}

                {/* 4. Diagrams tab */}
                {activeTab === 'diagrams' && (
                  <div className="space-y-6">
                    <div className="bg-white border border-slate-200 rounded-lg p-4 md:p-6 shadow-sm">
                      <h2 className="text-md font-bold text-slate-900 flex items-center gap-2 uppercase tracking-tight mb-2">
                        <HeartHandshake className="w-5 h-5 text-blue-600" />
                        ภาพประกอบและหลักปฏิบัติการปฐมพยาบาลเชิงลึก
                      </h2>
                      <p className="text-xs text-slate-500">
                        ผังและอินโฟกราฟิกแบบสรุปใจความสำคัญ สำหรับเคสฉุกเฉินเฉพาะด้าน
                      </p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <RiceDiagram />
                      <HeatstrokeDiagram />
                    </div>
                  </div>
                )}

                {/* 5. Contacts tab with dial buttons */}
                {activeTab === 'contacts' && (
                  <div className="bg-white border border-slate-200 rounded-lg p-4 md:p-6 shadow-sm space-y-6">
                    <div>
                      <h2 className="text-md font-bold text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                        <PhoneCall className="w-5 h-5 text-blue-600" />
                        รายชื่อเบอร์โทรศัพท์ฉุกเฉินและประสานงานหลัก
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        หากกำลังเปิดผ่านบราวเซอร์มือถือ สามารถกดแตะที่เบอร์โทรหรือปุ่มเพื่อเรียกเบอร์โทรออกได้ทันทีเพื่อลดเวลา
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {contactsData.map((contact, i) => (
                        <div 
                          key={i} 
                          className="flex flex-col justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg shadow-sm hover:border-slate-300 transition-all hover:bg-slate-100/50"
                        >
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <h3 className="text-sm font-bold text-slate-900">{contact.name}</h3>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">
                              {contact.description}
                            </p>
                          </div>
                          
                          <a
                            href={`tel:${contact.phone}`}
                            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold rounded-md shadow transition-all active:scale-95 text-xs text-center"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            โทรออกด่วน: {contact.phone}
                          </a>
                        </div>
                      ))}
                    </div>

                    {/* Official Duty Table from Image */}
                    <div className="pt-6 border-t border-slate-200 space-y-4">
                      <div>
                        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                          <Users className="w-4.5 h-4.5 text-blue-600" />
                          ตารางเวรเจ้าหน้าที่พยาบาลวิชาชีพและพนักงานขับรถพยาบาล (Official)
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                          ข้อมูลจัดตั้งเวรประจำตำแหน่งงานภายนอก (โรงพยาบาลจุฬาลงกรณ์ / สภากาชาดไทย) วันที่ 18 ก.ค. 2569 (CU First Date 2026)
                        </p>
                      </div>

                      <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-sm">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
                              <th className="py-2.5 px-3 border-r border-slate-200">วัน/เดือน/ปี เวลา</th>
                              <th className="py-2.5 px-3 border-r border-slate-200">กิจกรรม</th>
                              <th className="py-2.5 px-3 border-r border-slate-200">ผู้ปฏิบัติงานหลัก</th>
                              <th className="py-2.5 px-3">สถานที่ปฏิบัติงาน</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
                            <tr className="hover:bg-slate-50/50">
                              <td className="py-3 px-3 align-middle border-r border-slate-200 whitespace-nowrap bg-slate-50/30">
                                <span className="font-bold text-slate-900">18 ก.ค. 69</span>
                                <div className="text-[10px] text-slate-500 mt-0.5">08:00 - 12:00 น.</div>
                              </td>
                              <td className="py-3 px-3 align-middle border-r border-slate-200 font-bold text-slate-900">CU First Date 2026</td>
                              <td className="py-3 px-3 align-middle border-r border-slate-200 space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <span className="px-1.5 py-0.5 bg-red-50 text-red-700 text-[9px] font-black rounded border border-red-100">RN</span>
                                  <span className="font-bold">ลลิตา อุตมวาทิน</span>
                                  <a href="tel:0623955397" className="text-blue-600 hover:underline font-mono ml-auto bg-blue-50/50 px-2 py-0.5 rounded text-[10px] font-bold">062-3955397</a>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[9px] font-black rounded border border-amber-100">PN</span>
                                  <span className="font-bold">ปาณิสรา ราชพิบูลย์</span>
                                  <a href="tel:0845935462" className="text-blue-600 hover:underline font-mono ml-auto bg-blue-50/50 px-2 py-0.5 rounded text-[10px] font-bold">084-5935462</a>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-[9px] font-black rounded border border-slate-200">Amb</span>
                                  <span className="font-bold">ชัยวัฒน์ น้อยแสม</span>
                                  <a href="tel:0923347897" className="text-blue-600 hover:underline font-mono ml-auto bg-blue-50/50 px-2 py-0.5 rounded text-[10px] font-bold">092-3347897</a>
                                </div>
                              </td>
                              <td className="py-3 px-3 align-middle font-bold text-slate-900 bg-slate-50/30">ลาน 2 รัชกาล</td>
                            </tr>
                            <tr className="hover:bg-slate-50/50">
                              <td className="py-3 px-3 align-middle border-r border-slate-200 whitespace-nowrap bg-slate-50/30">
                                <span className="font-bold text-slate-900">18 ก.ค. 69</span>
                                <div className="text-[10px] text-slate-500 mt-0.5">08:00 - 20:00 น.</div>
                              </td>
                              <td className="py-3 px-3 align-middle border-r border-slate-200 font-bold text-slate-900">CU First Date 2026</td>
                              <td className="py-3 px-3 align-middle border-r border-slate-200 space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <span className="px-1.5 py-0.5 bg-red-50 text-red-700 text-[9px] font-black rounded border border-red-100">RN</span>
                                  <span className="font-bold">ชมัยพร สุทธินันสนีย์</span>
                                  <a href="tel:0988908241" className="text-blue-600 hover:underline font-mono ml-auto bg-blue-50/50 px-2 py-0.5 rounded text-[10px] font-bold">098-8908241</a>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[9px] font-black rounded border border-amber-100">PN</span>
                                  <span className="font-bold">ประภาพร สิทธิอมร</span>
                                  <a href="tel:0649268586" className="text-blue-600 hover:underline font-mono ml-auto bg-blue-50/50 px-2 py-0.5 rounded text-[10px] font-bold">064-9268586</a>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-[9px] font-black rounded border border-slate-200">Amb</span>
                                  <span className="font-bold">ไพโรจน์ แก้วมนูญ</span>
                                  <a href="tel:0877618098" className="text-blue-600 hover:underline font-mono ml-auto bg-blue-50/50 px-2 py-0.5 rounded text-[10px] font-bold">087-7618098</a>
                                </div>
                              </td>
                              <td className="py-3 px-3 align-middle font-bold text-slate-900 bg-slate-50/30">หอประชุมจุฬาฯ</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Quick advice for coordinators */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                      <h4 className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-blue-600" />
                        แนวทางการวิทยุแจ้งเหตุพยาบาล (จำลองลำดับความสำคัญ)
                      </h4>
                      <p className="text-xs text-blue-800 leading-relaxed font-semibold">
                        • ลำดับ 1 (วิกฤต): ชัก / หมดสติ / ไม่หายใจ / สงสัยโรคหลอดเลือดสมอง (Stroke) → ให้หนึ่งคนในจุดเริ่ม CPR และอีกคนโทรแจ้งพี่พยาบาลด่วนที่สุดและแจ้งขอ AED <br />
                        • ลำดับ 2 (บาดเจ็บหนัก): กระดูกหักผิดรูป / ข้อเท้าแพลงรุนแรงยืนไม่ไหว / แผลกว้างฉีกขาด → วิทยุเรียกหน่วยโมบายพยาบาลให้นำอุปกรณ์มาทำแผล ณ จุดเกิดเหตุ <br />
                        • ลำดับ 3 (เจ็บป่วยทั่วไป): เป็นลมแดดระดับเบา / ตะคริว / หน้ามืด / แผลถลอกตื้น → ปฐมพยาบาลเบื้องต้นตามคู่มือ หากทุเลาลงแล้วให้คนไข้มาพักที่จุดพยาบาลหลัก (ลานบรม)
                      </p>
                    </div>

                    {/* Google Drive files container */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-blue-600" />
                          มีคู่มือแบบละเอียดและแผนภาพพิมพับได้
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          คุณสามารถดาวน์โหลดเอกสาร PDF และแผนพยาบาลของจุฬาฯ เก็บใส่เครื่องได้โดยตรง
                        </p>
                      </div>
                      <a
                        href="https://drive.google.com/drive/folders/1LXZfF7kmWrWZ00SS0Ng7nsQ_e-kzkjDg?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded transition-all shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>เปิดไดรฟ์เก็บไฟล์คู่มือ</span>
                      </a>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>

        </div>

        {/* Footer */}
        <footer className="text-center py-10 border-t border-slate-200">
          <p className="text-xs text-slate-400">
            พยาบาล 101 — จุฬาลงกรณ์มหาวิทยาลัย (CU First Date 2026)
          </p>
          <div className="flex justify-center gap-4 mt-2 mb-3">
            <a
              href="https://drive.google.com/drive/folders/1LXZfF7kmWrWZ00SS0Ng7nsQ_e-kzkjDg?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline flex items-center gap-1 font-bold"
            >
              <Download className="w-3 h-3" /> ดาวน์โหลดไฟล์ PDF บน Google Drive
            </a>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            อ้างอิงคู่มือปฐมพยาบาล สภากาชาดไทย, แนวทาง Basic Life Support (TRC), กรมควบคุมโรค กระทรวงสาธารณสุข, และสพฉ.
          </p>
        </footer>

      </div>
    </div>
  );
}
