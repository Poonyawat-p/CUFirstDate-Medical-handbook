import { useState } from 'react';
import { MapPin, Users, Clock, ShieldAlert, ChevronDown } from 'lucide-react';
import { Shift } from '../types';
import { nurseShifts } from '../data';

interface InteractiveMapProps {
  onLocationSelect?: (location: string) => void;
  selectedLocation?: string;
}

export default function InteractiveMap({ onLocationSelect, selectedLocation }: InteractiveMapProps) {
  const [activeTab, setActiveTab] = useState<'map' | 'list'>('map');

  const locations = [
    { id: 'จุดอำนวยการลานบรม', name: 'ลานบรม (จุดอำนวยการ)', x: 120, y: 150, color: 'bg-emerald-500' },
    { id: 'จุดลงทะเบียน', name: 'จุดลงทะเบียน', x: 280, y: 80, color: 'bg-amber-500' },
    { id: 'บ่อน้ำลานจอด', name: 'บ่อน้ำลานจอด', x: 220, y: 220, color: 'bg-sky-500' },
    { id: 'หอประชุม (วิศวะ)', name: 'หอประชุม (วิศวะ)', x: 80, y: 280, color: 'bg-indigo-500' },
    { id: 'หอประชุม (อักษร)', name: 'หอประชุม (อักษร)', x: 340, y: 240, color: 'bg-purple-500' },
    { id: 'สวนร้อยปี', name: 'สวนร้อยปี', x: 200, y: 340, color: 'bg-rose-500' },
  ];

  const handleLocationClick = (locId: string) => {
    // Normalize or match location id
    let targetLoc = locId;
    if (locId === 'บ่อน้ำลานจอด') {
      targetLoc = 'บ่อน้ำลานจอด (ชุดที่ 1)';
    }
    if (onLocationSelect) {
      onLocationSelect(targetLoc);
    }
  };

  const getShiftForLocation = (locationName: string) => {
    return nurseShifts.filter(s => s.location.startsWith(locationName) || locationName.startsWith(s.location));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 md:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h2 className="text-md font-bold text-slate-900 flex items-center gap-2 uppercase tracking-tight">
            <MapPin className="w-5 h-5 text-blue-600" />
            ผังพยาบาลและตารางเวรที่ปฏิบัติหน้าที่
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">คลิกบนแผนที่หรือเลือกจุด เพื่อดูเจ้าหน้าที่พยาบาลที่ประจำการ</p>
        </div>

        <div className="inline-flex bg-slate-50 p-1 rounded-lg self-end sm:self-auto border border-slate-200">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'map'
                ? 'bg-white text-slate-900 border border-slate-200/50 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            แผนที่แบบย่อ
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'list'
                ? 'bg-white text-slate-900 border border-slate-200/50 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            ตารางเวรทั้งหมด
          </button>
        </div>
      </div>

      {activeTab === 'map' ? (
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span>📍 แตะเลือกจุดเพื่อแสดงทีมสตาฟและช่วงเวลาทำงาน (ไม่ต้องเลื่อนหน้าจอ)</span>
            </div>
            
            <div className="space-y-2.5">
              {locations.map((loc) => {
                const isSelected = !!selectedLocation && (selectedLocation.startsWith(loc.id) || loc.id.startsWith(selectedLocation));
                const shifts = getShiftForLocation(loc.id);
                const activeStaffCount = shifts.reduce((acc, s) => acc + s.leadsAndMembers.length, 0);

                return (
                  <div
                    key={loc.id}
                    className={`border rounded-lg transition-all duration-200 overflow-hidden ${
                      isSelected
                        ? 'border-blue-300 bg-blue-50/20 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Header bar / button */}
                    <button
                      onClick={() => {
                        if (isSelected) {
                          if (onLocationSelect) onLocationSelect('');
                        } else {
                          handleLocationClick(loc.id);
                        }
                      }}
                      className="w-full flex items-center justify-between p-3.5 text-left cursor-pointer gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className={`w-3 h-3 rounded-full flex-shrink-0 ${
                          isSelected ? 'bg-blue-600 animate-pulse' : loc.color || 'bg-blue-500'
                        }`} />
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs font-extrabold ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
                            {loc.name}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                            {shifts.length} กะเวลา • รวมสตาฟหมุนเวียน {activeStaffCount} คน
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 flex-shrink-0">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          isSelected 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {activeStaffCount} คน
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                          isSelected ? 'rotate-180 text-blue-600' : ''
                        }`} />
                      </div>
                    </button>

                    {/* Inline expanded content under the clicked box */}
                    {isSelected && (
                      <div className="px-4 pb-4 border-t border-slate-100 pt-3.5 bg-white/70 space-y-3.5">
                        {shifts.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {shifts.map((shift, i) => (
                              <div key={i} className="bg-slate-50/50 border border-slate-200/80 rounded-lg p-3.5 shadow-sm">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2.5">
                                  <Clock className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                                  <span>กะเวลา: {shift.time}</span>
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="text-[9px] text-slate-400 font-extrabold uppercase flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    <span>ทีมสตาฟเวรปฐมพยาบาล</span>
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {shift.leadsAndMembers.map((member, index) => (
                                      <span
                                        key={index}
                                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold border ${
                                          member.isHead
                                            ? 'bg-blue-50 border-blue-200 text-blue-700 font-extrabold shadow-sm'
                                            : 'bg-white border-slate-200 text-slate-600'
                                        }`}
                                      >
                                        {member.isHead && <span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />}
                                        <span>{member.name}</span>
                                        {member.isHead && <span className="text-[8px] bg-blue-100 text-blue-800 px-1 rounded font-extrabold ml-0.5">Head</span>}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-slate-400 text-xs">
                            ไม่มีตารางเวรในจุดนี้ในช่วงนี้
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50/50 border border-slate-200 rounded-lg p-3 text-[11px] text-slate-500 leading-relaxed flex items-start gap-2">
              <span className="text-blue-500 font-bold">💡 คำแนะนำการเรียกสตาฟ:</span>
              <span>แตะเลือกจุดที่เกิดเหตุได้ทันทีเพื่อสแกนดูสตาฟเวรประจำกะนั้นๆ หากต้องการประสานงานสามารถแจ้งผ่านวิทยุช่อง 4 (ปุน#4)</span>
            </div>

            <div className="p-3 bg-red-50 border border-red-150 rounded-lg flex gap-2.5 items-start">
              <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[11px] font-extrabold text-red-950 uppercase tracking-wide">กรณีเกิดเหตุฉุกเฉินร้ายแรง!</h4>
                <p className="text-[10px] text-red-800 mt-0.5 leading-relaxed font-semibold">
                  ห้ามเคลื่อนย้ายผู้ป่วยเองโดยเด็ดขาด ให้แจ้งผ่านวิทยุสื่อสาร VR ประจำจุด หรือติดต่อพี่พยาบาลด่วนที่สุด
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Full schedule table list formatted to use minimal bytes and screen estate */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase">
                <th className="py-3 px-2">ช่วงเวลา</th>
                <th className="py-3 px-2">จุดประจำการ</th>
                <th className="py-3 px-2">หัวหน้ากะ (Head)</th>
                <th className="py-3 px-2">สตาฟพยาบาลร่วมเวร</th>
              </tr>
            </thead>
            <tbody>
              {nurseShifts.map((shift, idx) => {
                const head = shift.leadsAndMembers.find(m => m.isHead)?.name || '-';
                const members = shift.leadsAndMembers.filter(m => !m.isHead).map(m => m.name).join(', ');
                return (
                  <tr
                    key={idx}
                    onClick={() => handleLocationClick(shift.location)}
                    className={`border-b border-slate-100 hover:bg-slate-50/50 cursor-pointer transition-all ${
                      selectedLocation === shift.location ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <td className="py-3 px-2 font-semibold text-slate-900">{shift.time}</td>
                    <td className="py-3 px-2 text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-blue-500" />
                      {shift.location}
                    </td>
                    <td className="py-3 px-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        {head}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-slate-500">{members}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
