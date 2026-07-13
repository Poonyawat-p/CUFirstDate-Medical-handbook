import { useState, useEffect, FormEvent } from 'react';
import { 
  FileText, Plus, Database, CloudLightning, Download, Trash2, 
  CheckCircle2, AlertCircle, Copy, Check, Eye, Search, Filter, HelpCircle
} from 'lucide-react';

interface IncidentCase {
  id: string;
  time: string;
  location: string;
  reporter: string;
  symptoms: string;
  medicines: string[];
  notes: string;
  synced: boolean;
}

const COMMON_MEDICINES = [
  'พาราเซตามอล (แก้ปวด/ลดไข้)',
  'ยาแก้แพ้ (ลดน้ำมูก/ผื่นคัน)',
  'ผงเกลือแร่ ORS (แก้เพลียแดด/ท้องเสีย)',
  'ยาดม / พิมเสนน้ำ (หน้ามืด/วิงเวียน)',
  'น้ำเกลือล้างแผล (Normal Saline)',
  'เบตาดีน (ใส่แผลสด)',
  'แอลกอฮอล์ล้างแผล (เช็ดรอบแผล)',
  'ยาแก้ท้องเสีย / ถ่านกัมมันต์ (Carbon)',
  'ยาทาแก้แมลงสัตว์กัดต่อย (เสลดพังพอน/คารามายด์)',
  'ยาแก้อาเจียน (Dimenhydrinate)'
];

const PRESET_LOCATIONS = [
  'จุดอำนวยการหลัก (ลานพระบรมฯ)',
  'จุดพยาบาลรอง 1 (ศาลาพระเกี้ยว)',
  'จุดพยาบาลรอง 2 (หน้าหอประชุมใหญ่)',
  'เต็นท์ลงทะเบียน / ซุ้มทางเข้าหลัก',
  'บริเวณอัฒจันทร์ / สนามกีฬากลาง',
  'เต็นท์กิจกรรมพาร์ทเนอร์ / ลานกิจกรรม',
  'บริเวณโรงอาหาร / ซุ้มอาหาร',
  'อื่นๆ (โปรดระบุในช่อง)'
];

export default function IncidentLogger() {
  const [cases, setCases] = useState<IncidentCase[]>([]);
  
  // Form states
  const [time, setTime] = useState('');
  const [location, setLocation] = useState(PRESET_LOCATIONS[0]);
  const [customLocation, setCustomLocation] = useState('');
  const [reporter, setReporter] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [selectedMedicines, setSelectedMedicines] = useState<string[]>([]);
  const [customMedicine, setCustomMedicine] = useState('');
  const [notes, setNotes] = useState('');

  // Settings states
  const [sheetScriptUrl, setSheetScriptUrl] = useState('');
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [scriptCopied, setScriptCopied] = useState(false);

  // Status/Feedback states
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [syncStatus, setSyncStatus] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter/Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('all');

  // Load initial data
  useEffect(() => {
    const savedCases = localStorage.getItem('cu_first_date_cases');
    if (savedCases) {
      try {
        setCases(JSON.parse(savedCases));
      } catch (e) {
        console.error(e);
      }
    }

    const savedUrl = localStorage.getItem('cu_first_date_sheet_url');
    if (savedUrl) {
      setSheetScriptUrl(savedUrl);
    }

    // Set default time to current local time in Thai format
    const now = new Date();
    const tzoffset = now.getTimezoneOffset() * 60000; // offset in milliseconds
    const localISOTime = new Date(now.getTime() - tzoffset).toISOString().slice(0, 16);
    setTime(localISOTime);
  }, []);

  // Save cases to localStorage when updated
  const saveCasesToLocalStorage = (updatedCases: IncidentCase[]) => {
    setCases(updatedCases);
    localStorage.setItem('cu_first_date_cases', JSON.stringify(updatedCases));
  };

  const handleSaveSheetUrl = (url: string) => {
    setSheetScriptUrl(url);
    localStorage.setItem('cu_first_date_sheet_url', url);
    triggerAlert('success', 'บันทึกการตั้งค่า Google Sheet เชื่อมโยงสำเร็จ!');
  };

  const triggerAlert = (type: 'success' | 'error', text: string) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 4000);
  };

  const toggleMedicineSelection = (med: string) => {
    if (selectedMedicines.includes(med)) {
      setSelectedMedicines(selectedMedicines.filter(m => m !== med));
    } else {
      setSelectedMedicines([...selectedMedicines, med]);
    }
  };

  const handleAddCustomMedicine = () => {
    const trimmed = customMedicine.trim();
    if (trimmed && !selectedMedicines.includes(trimmed)) {
      setSelectedMedicines([...selectedMedicines, trimmed]);
      setCustomMedicine('');
    }
  };

  // Google Sheet webhook submit helper
  const sendCaseToGoogleSheet = async (caseData: IncidentCase, url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        mode: 'no-cors', // standard way to bypass CORS on simple GAS deployments
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: caseData.id,
          time: caseData.time.replace('T', ' '),
          location: caseData.location,
          reporter: caseData.reporter,
          symptoms: caseData.symptoms,
          medicines: caseData.medicines.join(', '),
          notes: caseData.notes
        }),
      });
      return true; // no-cors returns opaque response, so we assume success if no crash
    } catch (error) {
      console.error('Error syncing to Google Sheet:', error);
      return false;
    }
  };

  const handleSubmitCase = async (e: FormEvent) => {
    e.preventDefault();
    if (!reporter.trim()) {
      triggerAlert('error', 'โปรดระบุชื่อผู้แจ้ง/ผู้บันทึกเคส');
      return;
    }
    if (!symptoms.trim()) {
      triggerAlert('error', 'โปรดระบุรายละเอียดอาการหรือเหตุการณ์');
      return;
    }

    setIsSubmitting(true);
    
    const finalLocation = location === 'อื่นๆ (โปรดระบุในช่อง)' 
      ? (customLocation.trim() || 'อื่นๆ') 
      : location;

    const newCase: IncidentCase = {
      id: 'case_' + Date.now(),
      time: time,
      location: finalLocation,
      reporter: reporter.trim(),
      symptoms: symptoms.trim(),
      medicines: [...selectedMedicines],
      notes: notes.trim(),
      synced: false
    };

    let syncSuccess = false;
    if (sheetScriptUrl.trim()) {
      setSyncStatus('กำลังส่งข้อมูลไปยัง Google Sheets...');
      const success = await sendCaseToGoogleSheet(newCase, sheetScriptUrl.trim());
      if (success) {
        newCase.synced = true;
        syncSuccess = true;
      }
    }

    const updatedCases = [newCase, ...cases];
    saveCasesToLocalStorage(updatedCases);

    // Reset Form
    setSymptoms('');
    setSelectedMedicines([]);
    setNotes('');
    setCustomLocation('');
    
    // Set time again for next submit
    const now = new Date();
    const tzoffset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now.getTime() - tzoffset).toISOString().slice(0, 16);
    setTime(localISOTime);

    setIsSubmitting(false);
    setSyncStatus('');

    if (syncSuccess) {
      triggerAlert('success', 'บันทึกเหตุการณ์และส่งเข้า Google Sheet สำเร็จแล้ว!');
    } else if (sheetScriptUrl.trim()) {
      triggerAlert('success', 'บันทึกลงเครื่องสำเร็จ แต่การเชื่อมโยงไปชีตขัดข้อง (ข้อมูลจะบันทึกแบบออฟไลน์ไว้)');
    } else {
      triggerAlert('success', 'บันทึกประวัติลงเครื่องเรียบร้อย (สามารถกดซิงค์ภายหลังได้)');
    }
  };

  const handleDeleteCase = (id: string) => {
    if (window.confirm('ยืนยันที่จะลบข้อมูลบันทึกเคสนี้ใช่หรือไม่? (ข้อมูลในมือถือจะถูกลบออก)')) {
      const updated = cases.filter(c => c.id !== id);
      saveCasesToLocalStorage(updated);
      triggerAlert('success', 'ลบข้อมูลเรียบร้อยแล้ว');
    }
  };

  const handleSyncAllPending = async () => {
    if (!sheetScriptUrl.trim()) {
      triggerAlert('error', 'โปรดตั้งค่า Google Sheet Web App URL ก่อนซิงค์');
      return;
    }

    const pending = cases.filter(c => !c.synced);
    if (pending.length === 0) {
      triggerAlert('success', 'ข้อมูลทุกเคสได้รับการอัปโหลดซิงค์เรียบร้อยแล้ว!');
      return;
    }

    setIsSubmitting(true);
    setSyncStatus(`กำลังซิงค์เคสคงค้าง ${pending.length} รายการ...`);
    
    let successCount = 0;
    const updatedCases = [...cases];

    for (let i = 0; i < updatedCases.length; i++) {
      if (!updatedCases[i].synced) {
        const success = await sendCaseToGoogleSheet(updatedCases[i], sheetScriptUrl.trim());
        if (success) {
          updatedCases[i] = { ...updatedCases[i], synced: true };
          successCount++;
        }
      }
    }

    saveCasesToLocalStorage(updatedCases);
    setIsSubmitting(false);
    setSyncStatus('');

    if (successCount > 0) {
      triggerAlert('success', `ซิงค์เสร็จสิ้น! ส่งข้อมูลเคสคงค้างสำเร็จ ${successCount} รายการ`);
    } else {
      triggerAlert('error', 'ไม่สามารถเชื่อมต่อ Google Sheets ได้ในขณะนี้ โปรดตรวจสอบอินเทอร์เน็ตหรือเว็บบราวเซอร์ของคุณ');
    }
  };

  const handleExportCSV = () => {
    if (cases.length === 0) {
      triggerAlert('error', 'ยังไม่มีข้อมูลที่จะส่งออก');
      return;
    }

    // Prepare CSV with UTF-8 BOM to prevent Thai garbled characters in Excel
    let csvContent = '\uFEFF';
    csvContent += 'รหัสบันทึก,วันเวลาเกิดเหตุ,สถานที่เกิดเหตุ,ผู้แจ้ง/ผู้บันทึก,อาการ/รายละเอียดเหตุการณ์,ยาที่ได้รับ/การรักษา,บันทึกเพิ่มเติม,สถานะการซิงค์\n';

    cases.forEach(c => {
      const safeTime = c.time.replace('T', ' ');
      const safeLoc = `"${c.location.replace(/"/g, '""')}"`;
      const safeRep = `"${c.reporter.replace(/"/g, '""')}"`;
      const safeSym = `"${c.symptoms.replace(/"/g, '""')}"`;
      const safeMeds = `"${c.medicines.join(', ').replace(/"/g, '""')}"`;
      const safeNotes = `"${c.notes.replace(/"/g, '""')}"`;
      const safeSync = c.synced ? 'ซิงค์แล้ว' : 'บันทึกในเครื่อง';

      csvContent += `${c.id},${safeTime},${safeLoc},${safeRep},${safeSym},${safeMeds},${safeNotes},${safeSync}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `medical_incident_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerAlert('success', 'ดาวน์โหลดไฟล์สรุปประวัติ (CSV) เรียบร้อยแล้ว!');
  };

  const copyScriptToClipboard = () => {
    const scriptCode = `function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch(err) {
    return ContentService.createTextOutput("Error parsing JSON: " + err.toString());
  }
  
  // Append case details
  sheet.appendRow([
    new Date(), // วันเวลาเซฟจริง
    data.time,  // วันเวลาเกิดเหตุ
    data.location, 
    data.reporter, 
    data.symptoms, 
    data.medicines, 
    data.notes,
    data.id
  ]);
  
  return ContentService.createTextOutput("Success")
    .setMimeType(ContentService.MimeType.TEXT);
}`;
    navigator.clipboard.writeText(scriptCode);
    setScriptCopied(true);
    setTimeout(() => setScriptCopied(false), 2000);
  };

  // Filter cases
  const filteredCases = cases.filter(c => {
    const matchSearch = 
      c.reporter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.symptoms.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.medicines.some(m => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchLoc = filterLocation === 'all' || c.location === filterLocation;

    return matchSearch && matchLoc;
  });

  return (
    <div id="incident-logger-wrapper" className="space-y-6">
      
      {/* Alert Notifications Banner */}
      {alertMsg && (
        <div className={`p-4 rounded-lg flex items-center gap-3 shadow-md animate-bounce sticky top-4 z-50 ${
          alertMsg.type === 'success' 
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {alertMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <span className="text-xs font-bold">{alertMsg.text}</span>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-lg p-4 md:p-6 shadow-sm space-y-6">
        <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-md font-bold text-slate-900 flex items-center gap-2 uppercase tracking-tight">
              <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
              บันทึกเคสรักษาและการใช้ยาพยาบาล
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">แบบบันทึกเหตุการณ์ด่วนสำหรับฝ่ายพยาบาลสตาฟ เพื่อจดบันทึกรายชื่อ ยาที่แจก และเวลาเกิดเหตุ</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowSetupGuide(!showSetupGuide)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-md flex items-center gap-1 transition-all"
            >
              <Database className="w-3.5 h-3.5" />
              <span>{showSetupGuide ? 'ซ่อนวิธีเชื่อมต่อชีต' : 'ตั้งค่าซิงค์ชีต (ไม่ต้องล็อกอิน)'}</span>
            </button>
          </div>
        </div>

        {/* 1. Google Sheets Setup Guide */}
        {showSetupGuide && (
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-lg space-y-3">
            <h3 className="text-xs font-black text-blue-900 flex items-center gap-1.5">
              <CloudLightning className="w-4 h-4 text-blue-600 animate-pulse" />
              ขั้นตอนการบันทึกข้อมูลเข้า Google Sheets แบบอัตโนมัติ (ไม่ต้องล็อกอินตอนใช้งาน)
            </h3>
            <p className="text-[11px] text-blue-800 leading-relaxed font-semibold">
              คุณสามารถสร้าง Google Sheets ส่วนตัว และนำระบบนี้ไปกรอกข้อมูลตรงจากมือถือสตาฟทุกคนในงานเข้าชีตแผ่นเดียวกันได้ทันที โดยตั้งค่าตาม 5 ขั้นตอนนี้:
            </p>
            <ol className="text-[11px] text-blue-900 space-y-2 list-decimal list-inside pl-1 font-medium leading-relaxed">
              <li>สร้าง Google Spreadsheet ใหม่ใน Google Drive ของคุณ</li>
              <li>ที่เมนูด้านบน กดเลือก <strong>ส่วนขยาย (Extensions)</strong> &gt; <strong>Apps Script</strong></li>
              <li>
                ลบโค้ดเริ่มต้นทั้งหมดทิ้ง และคัดลอกโค้ดสคริปต์นี้ไปวางแทน:
                <div className="mt-1.5 flex items-center gap-2">
                  <button
                    onClick={copyScriptToClipboard}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-blue-300 hover:bg-blue-50 text-[10px] font-bold text-blue-800 rounded shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    {scriptCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{scriptCopied ? 'คัดลอกสำเร็จ!' : 'กดคัดลอกสคริปต์'}</span>
                  </button>
                  <span className="text-[9px] text-blue-600 font-bold">* โค้ด Apps Script นำไปเปิดใช้งานชีต</span>
                </div>
              </li>
              <li>กดปุ่มบันทึก จากนั้นกดปุ่ม <strong>ทำให้ใช้งานได้ (Deploy)</strong> &gt; <strong>การทำให้ใช้งานได้ใหม่ (New deployment)</strong></li>
              <li>
                เลือกประเภทเป็น <strong>เว็บแอป (Web App)</strong>, ตั้งค่า <strong>"ผู้ที่มีสิทธิ์เข้าถึง"</strong> เป็น <strong>"ทุกคน" (Anyone)</strong>, แล้วกดทำให้ใช้งานได้ 
                จากนั้นคัดลอก <strong className="text-blue-950">URL ของเว็บแอป</strong> ที่ได้ มาวางในช่องด้านล่างนี้แล้วกดบันทึก!
              </li>
            </ol>

            <div className="pt-3 border-t border-blue-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="วาง URL เว็บแอป Google Apps Script เช่น https://script.google.com/macros/s/.../exec"
                  value={sheetScriptUrl}
                  onChange={(e) => setSheetScriptUrl(e.target.value)}
                  className="w-full bg-white border border-blue-200 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
              <button
                onClick={() => handleSaveSheetUrl(sheetScriptUrl)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md text-xs transition-all active:scale-95"
              >
                บันทึกเชื่อมต่อ
              </button>
            </div>
            {sheetScriptUrl && (
              <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 p-2 rounded border border-emerald-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>สถานะ: ระบบเปิดโหมดส่งข้อมูลอัตโนมัติเข้า Google Sheets ของคุณแล้ว!</span>
              </div>
            )}
          </div>
        )}

        {/* 2. Record Incident Form */}
        <form onSubmit={handleSubmitCase} className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <Plus className="w-4 h-4 text-blue-600" />
              กรอกรายงานเคสอุบัติเหตุ / การแจกยาใหม่
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              
              {/* 1. Time Input */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">เวลาที่เกิดเหตุ</label>
                <input
                  type="datetime-local"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              {/* 2. Preset Location Dropdown */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">จุดพื้นที่เกิดเหตุ</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-blue-500 font-semibold"
                >
                  {PRESET_LOCATIONS.map((loc, idx) => (
                    <option key={idx} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* 3. Reporter / Staff Name */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">ผู้สตาฟที่จดบันทึก</label>
                <input
                  type="text"
                  placeholder="ระบุชื่อ/รุ่นพี่ เช่น ปัด#2, โมเดล#3"
                  value={reporter}
                  onChange={(e) => setReporter(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>

            </div>

            {/* Custom Location if other is chosen */}
            {location === 'อื่นๆ (โปรดระบุในช่อง)' && (
              <div className="animate-fadeIn">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">ระบุสถานที่อื่นๆ</label>
                <input
                  type="text"
                  placeholder="ระบุชื่อเต็นท์ อาคาร หรือพิกัดจุดเด่นในงาน"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {/* 4. Symptoms Detail */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">อาการ / เหตุการณ์ที่เกิดขึ้น</label>
              <input
                type="text"
                placeholder="ระบุรายละเอียด เช่น คลื่นไส้หน้ามืดจากลมแดด, ล้มเข่าถลอก, ปวดศีรษะขอยาพารา, ตะคริวที่น่อง"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                required
                className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            {/* 5. Medication Grid selection */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">ยาที่แจก / การปฐมพยาบาลพยาบาลที่ให้</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-slate-200 bg-white p-3 rounded-md">
                {COMMON_MEDICINES.map((med, idx) => {
                  const isChecked = selectedMedicines.includes(med);
                  return (
                    <label 
                      key={idx}
                      className={`flex items-start gap-2 p-2 rounded border text-[11px] font-medium transition-all cursor-pointer ${
                        isChecked 
                          ? 'bg-blue-50 border-blue-200 text-blue-900' 
                          : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleMedicineSelection(med)}
                        className="mt-0.5 rounded text-blue-600 focus:ring-blue-400"
                      />
                      <span>{med}</span>
                    </label>
                  );
                })}
              </div>

              {/* Add custom medicine input */}
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  placeholder="ระบุยาตัวอื่นหรืออุปกรณ์เพิ่มเติม (เช่น ผ้าพันแผลยืด Elastic Bandage)"
                  value={customMedicine}
                  onChange={(e) => setCustomMedicine(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomMedicine}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-md text-xs font-bold transition-all"
                >
                  เพิ่มเข้าลิสต์
                </button>
              </div>

              {/* Render selected medicine pill chips */}
              {selectedMedicines.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5 p-2 bg-blue-50 border border-blue-100 rounded-md">
                  <span className="text-[10px] font-bold text-blue-700 mr-1 flex items-center">ยาที่แจก:</span>
                  {selectedMedicines.map((med, i) => (
                    <span 
                      key={i}
                      className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center gap-1 shadow-sm"
                    >
                      <span>{med}</span>
                      <button 
                        type="button" 
                        onClick={() => toggleMedicineSelection(med)}
                        className="font-extrabold text-blue-200 hover:text-white ml-0.5 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 6. Notes Input */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">บันทึกเพิ่มเติม (ถ้ามี) / ผลการประเมินหลังรักษา</label>
              <textarea
                placeholder="ระบุข้อมูลอื่นๆ เช่น แนะนำให้นอนพัก 30 นาที, นำส่งจุดพยาบาลหลักเพื่อเฝ้าระวังต่อ"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

          </div>

          {/* Submit buttons */}
          <div className="flex items-center justify-between gap-4">
            <div className="text-[11px] text-slate-400 font-bold">
              {isSubmitting ? (
                <span className="text-blue-600 animate-pulse font-extrabold flex items-center gap-1">
                  <Database className="w-4.5 h-4.5 animate-spin" />
                  {syncStatus || 'กำลังบันทึกข้อมูล...'}
                </span>
              ) : (
                <span>* ข้อมูลจะถูกเก็บลงมือถือของท่านทันที และสามารถซิงค์ขึ้นออนไลน์ได้</span>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-lg text-xs shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>บันทึกและรายงานข้อมูล</span>
            </button>
          </div>
        </form>

        {/* 3. Saved Records History Table */}
        <div className="pt-6 border-t border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-indigo-600" />
                ประวัติบันทึกเคสรักษาในอุปกรณ์นี้ ({filteredCases.length} รายการ)
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">ค้นหา ตรวจสอบสถานะการซิงค์ หรือดาวน์โหลดประวัติรายงานออกเป็นชีตได้</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleSyncAllPending}
                disabled={isSubmitting || cases.filter(c => !c.synced).length === 0}
                className="px-3 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-100 disabled:text-slate-400 text-white text-xs font-bold rounded-md flex items-center gap-1 shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <CloudLightning className="w-3.5 h-3.5" />
                <span>ซิงค์เคสค้างขึ้นชีต ({cases.filter(c => !c.synced).length})</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-md flex items-center gap-1 shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ดาวน์โหลดรายงาน (CSV)</span>
              </button>
            </div>
          </div>

          {/* Filters and search box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-100/80 rounded-md border border-slate-200">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="ค้นหาชื่อผู้สตาฟ, รายละเอียดเคส, อาการ, หรือยาที่แจก..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-md pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 font-semibold"
              >
                <option value="all">กรองตามจุดพยาบาล (ทั้งหมด)</option>
                {PRESET_LOCATIONS.map((loc, idx) => (
                  <option key={idx} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Cards / Table representation */}
          {filteredCases.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-slate-400">
              <Eye className="w-8 h-8 mx-auto mb-2 opacity-55 text-slate-400" />
              <p className="text-xs font-bold">ไม่พบประวัติการบันทึกเหตุการณ์พยาบาล</p>
              <p className="text-[11px] text-slate-400 mt-0.5">ลองกรอกข้อมูลเคสแรกในฟอร์มด้านบนเพื่อเริ่มบันทึกประวัติพยาบาล</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {filteredCases.map((c) => (
                <div 
                  key={c.id} 
                  className={`p-3.5 rounded-lg border shadow-sm flex flex-col md:flex-row justify-between gap-4 transition-all hover:shadow bg-white ${
                    c.synced ? 'border-emerald-100 bg-emerald-50/5' : 'border-slate-200'
                  }`}
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {c.time.replace('T', ' ')}
                      </span>
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                        📍 {c.location}
                      </span>
                      {c.synced ? (
                        <span className="text-[9px] font-black text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 animate-fadeIn">
                          <Check className="w-2.5 h-2.5" /> ซิงค์ Google Sheets แล้ว
                        </span>
                      ) : (
                        <span className="text-[9px] font-black text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-full">
                          บันทึกเก็บในอุปกรณ์ (Offline)
                        </span>
                      )}
                    </div>
                    
                    <h4 className="text-xs font-bold text-slate-900 leading-relaxed">
                      <span className="text-indigo-600">สตาฟผู้จด:</span> {c.reporter}
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                      <span className="text-slate-500 font-extrabold">🚨 อาการ:</span> {c.symptoms}
                    </p>
                    
                    {c.medicines.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="text-[10px] font-bold text-slate-400 self-center">💊 ยาที่ให้:</span>
                        {c.medicines.map((med, idx) => (
                          <span key={idx} className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">
                            {med}
                          </span>
                        ))}
                      </div>
                    )}

                    {c.notes && (
                      <p className="text-[11px] text-slate-500 italic bg-slate-50 p-1.5 rounded border border-slate-100 font-medium">
                        บันทึกเพิ่ม: {c.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 justify-end self-end md:self-center">
                    <button
                      onClick={() => handleDeleteCase(c.id)}
                      className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded transition-all cursor-pointer"
                      title="ลบบันทึกเคส"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
