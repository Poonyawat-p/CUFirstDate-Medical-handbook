import { useState, useMemo } from 'react';
import { ShieldAlert, ChevronDown, Search, Filter, AlertOctagon, HeartHandshake, Eye, Bandage, Zap, Star } from 'lucide-react';
import { FirstAidItem } from '../types';
import { firstAidGuidelines } from '../data';

interface MedicalGuideSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
}

const iconMap: { [key: string]: any } = {
  Bandage,
  Eye,
  Zap,
  HeartHandshake,
};

export default function MedicalGuideSection({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: MedicalGuideSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const categories = [
    { id: 'all', name: 'ทั้งหมด' },
    { id: 'emergency', name: 'วิกฤต/ฉุกเฉิน 🚨' },
    { id: 'injury', name: 'บาดแผลและการบาดเจ็บ' },
    { id: 'illness', name: 'อาการเจ็บป่วยทั่วไป' },
    { id: 'general', name: 'ทั่วไป' },
  ];

  const filteredGuidelines = useMemo(() => {
    return firstAidGuidelines.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        (selectedCategory === 'emergency' && item.isCritical) ||
        item.category === selectedCategory;

      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.symptoms && item.symptoms.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        item.guideline.some(g => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.extraNote && item.extraNote.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 md:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="min-w-0 flex-1">
          <h2 className="text-md font-bold text-slate-900 flex items-start gap-2 uppercase tracking-tight break-words">
            <HeartHandshake className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <span className="flex-1 min-w-0">คู่มือการรักษาพยาบาลเบื้องต้น (18 อาการ)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed break-words">กดที่แต่ละหัวข้อเพื่อขยายดูวิธีการประเมิน อาการ และวิธีการรักษาทันที</p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input in-component */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="ค้นหาตามชื่ออาการ อาการแสดง หรือขั้นตอนการรักษาพยาบาล..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-slate-50/50 border border-slate-200 rounded-md pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
        />
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredGuidelines.length > 0 ? (
          filteredGuidelines.map((item) => {
            const isExpanded = expandedId === item.id;
            const IconComponent = iconMap[item.iconName] || Star;
            return (
              <div
                key={item.id}
                className={`border rounded-lg transition-all ${
                  item.isCritical
                    ? 'border-red-100 hover:border-red-200 bg-red-50/10'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                {/* Header */}
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="w-full flex items-center justify-between p-4 text-left transition-colors cursor-pointer min-w-0 gap-2"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <span
                      className={`p-2 rounded flex-shrink-0 ${
                        item.isCritical ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <span className={`text-xs font-bold break-words ${item.isCritical ? 'text-red-950' : 'text-slate-900'}`}>
                          {item.title}
                        </span>
                        {item.isCritical && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-extrabold animate-pulse uppercase tracking-wider flex-shrink-0">
                            🚨 วิกฤต/ฉุกเฉิน
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 truncate">
                        {item.symptoms?.join(', ')}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-slate-200 pt-4 bg-slate-50/50 rounded-b-lg space-y-4">
                    {/* Symptoms block */}
                    {item.symptoms && (
                      <div className="space-y-2 bg-white p-3.5 rounded-lg border border-slate-100 shadow-sm">
                        <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          อาการแสดงเบื้องต้น (อาการสำคัญ)
                        </div>
                        <ul className="space-y-1.5 pl-1">
                          {item.symptoms.map((sym, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed"
                            >
                              <span className="text-blue-500 select-none mt-0.5">•</span>
                              <span className="font-medium text-slate-700">{sym}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Step-by-Step Guideline */}
                    <div className="space-y-2.5 bg-white p-3.5 rounded-lg border border-slate-100 shadow-sm">
                      <div className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        วิธีปฏิบัติการรักษาพยาบาล (ตามลำดับขั้นตอน)
                      </div>
                      <ol className="space-y-3 pl-0.5">
                        {item.guideline.map((step, idx) => {
                          const isNegativeWarn = step.includes('ห้าม') || step.includes('ไม่ควร');
                          const isUrgent = step.includes('ทันที') || step.includes('ด่วน') || step.includes('วิกฤต') || step.includes('⚠️');
                          return (
                            <li key={idx} className="flex gap-2.5 text-xs text-slate-700 leading-relaxed items-start">
                              <span className={`flex-shrink-0 flex items-center justify-center w-5 h-5 rounded font-extrabold text-[10px] mt-0.5 ${
                                isNegativeWarn 
                                  ? 'bg-red-50 border border-red-200 text-red-600'
                                  : isUrgent
                                  ? 'bg-amber-50 border border-amber-200 text-amber-700 animate-pulse'
                                  : 'bg-slate-50 border border-slate-200 text-slate-600'
                              }`}>
                                {idx + 1}
                              </span>
                              <span className={`flex-1 ${
                                isNegativeWarn 
                                  ? 'text-red-950 font-bold bg-red-50/50 px-1 rounded' 
                                  : isUrgent 
                                  ? 'text-slate-900 font-bold' 
                                  : 'text-slate-800'
                              }`}>
                                {step}
                              </span>
                            </li>
                          );
                        })}
                      </ol>
                    </div>

                    {/* Extra warning note */}
                    {item.extraNote && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-2.5 shadow-sm">
                        <AlertOctagon className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div className="text-[11px] text-amber-800 leading-relaxed flex-1">
                          <strong className="block text-amber-900 font-extrabold mb-0.5 uppercase tracking-wide">ข้อควรระวัง / ข้อมูลเพิ่มเติม</strong>
                          {item.extraNote.split('\n').map((line, i) => (
                            <span key={i} className="block mt-0.5 font-medium">{line}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Urgent Action Call-to-action */}
                    {item.isCritical && (
                      <div className="p-3.5 bg-red-50 border border-red-150 rounded-lg flex gap-3 animate-pulse shadow-sm">
                        <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-red-950">โปรดจำไว้! (กรณีวิกฤต)</h4>
                          <p className="text-[11px] text-red-800 mt-1 leading-relaxed font-semibold">
                            ข้อที่มีตัวหนา + สัญลักษณ์วิกฤต เป็นกรณีเร่งด่วน ให้เรียก <span className="underline font-extrabold text-red-950">พี่เจ้าหน้าที่พยาบาลวิชาชีพ</span> ทันทีที่มีรายงานมาหรือพบเจอ นอกเหนือจากนั้นหากพบว่าไม่สามารถทำได้ ให้เรียกพี่เจ้าหน้าที่พยาบาล หรือ VR มาหาปุน#4
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <Search className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">ไม่พบข้อมูลตามคำค้นหาของคุณ</p>
            <p className="text-xs text-slate-400 mt-1">โปรดลองค้นหาใหม่อีกครั้ง หรือล้างตัวกรองเพื่อแสดงข้อมูลทั้งหมด</p>
          </div>
        )}
      </div>
    </div>
  );
}
