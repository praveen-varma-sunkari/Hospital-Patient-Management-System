import React, { useState, useMemo, useEffect } from 'react';
import {
  Activity,
  UserPlus,
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  Stethoscope,
  ChevronRight,
  Sparkles,
  ArrowUpDown,
  Binary,
  Code2,
  ShieldCheck,
  XCircle,
  HeartPulse,
  Sun,
  Moon,
  Printer,
  FileText,
  Phone,
  UserCheck,
  Building2,
  Filter,
  Plus,
  Calendar,
  Check,
  Download,
  Bed,
  Cpu,
  Layers,
  FileSpreadsheet,
  Pencil,
  RotateCcw,
  ExternalLink,
  ClipboardList,
  LogOut,
  Thermometer,
  Gauge,
  BarChart3,
  LayoutGrid,
  Command,
  SlidersHorizontal
} from 'lucide-react';

// ── Firebase Firestore ─────────────────────────────────────────────────────
import { db } from './firebase';
import {
  collection, onSnapshot, updateDoc,
  deleteDoc, doc, getDocs, setDoc, writeBatch, increment
} from 'firebase/firestore';

// =====================================================================================
// 1. BRAND IDENTITY & OFFICIAL LOGO INTEGRATION COMPONENT
// =====================================================================================
const BheeshmaHeaderLogo = ({ onClickCppBadge }) => {
  return (
    <div className="flex items-center gap-3.5">
      {/* Official Bheeshma Logo Mark with Glow */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-teal-500 to-cyan-400 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
        <div className="relative h-13 w-13 rounded-2xl bg-white dark:bg-[#161618] border border-slate-200 dark:border-neutral-800 p-1 shadow-md flex items-center justify-center overflow-hidden shrink-0 transition-transform duration-300 group-hover:scale-105">
          <img 
            src="/bheeshma_logo.jpg" 
            alt="Bheeshma Healthcare Logo" 
            className="w-full h-full object-contain rounded-xl"
          />
        </div>
      </div>

      {/* Brand Title & Typography */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-black tracking-tight text-[#0a2540] dark:text-slate-100 flex items-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#003b73] via-[#0074e4] to-[#00a896] dark:from-cyan-400 dark:via-teal-300 dark:to-blue-400">
              Bheeshma
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px] uppercase tracking-widest ml-1.5 border-l-2 border-emerald-500/60 pl-1.5">
              HEALTHCARE
            </span>
          </h1>

          <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-cyan-300 border border-blue-500/20">
            Enterprise OS v2.4
          </span>
        </div>

        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-medium tracking-tight">
            Enterprise Triage & Queue OS
          </p>
          <span className="text-slate-300 dark:text-neutral-700 text-[10px]">|</span>
          <button
            onClick={onClickCppBadge}
            className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            title="Click to view underlying C++ DSA Specs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>C++ Queue Linked</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// =====================================================================================
// DOMAIN CONSTANTS & CLINICAL ENTITY DEFINITIONS
// =====================================================================================

const DEPARTMENTS = [
  'Emergency',
  'Cardiology',
  'Orthopedics',
  'General Medicine',
  'Pediatrics'
];

const DOCTORS = [
  { name: 'Dr. Varma', dept: 'Emergency', active: true, room: 'Cabin 101' },
  { name: 'Dr. Sharma', dept: 'Cardiology', active: true, room: 'Cabin 102' },
  { name: 'Dr. Rao', dept: 'Orthopedics', active: true, room: 'Cabin 103' },
  { name: 'Dr. Mehta', dept: 'General Medicine', active: true, room: 'Cabin 104' },
  { name: 'Dr. Kapoor', dept: 'Pediatrics', active: true, room: 'Cabin 105' }
];

const BLOOD_GROUPS = ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'];

const WARD_TYPES = ['General Ward', 'Semi-Private', 'Private Room', 'ICU Bed'];

const TRIAGE_LEVELS = {
  EMERGENCY: {
    value: 3,
    label: 'EMERGENCY (P1)',
    badgeLight: 'bg-rose-100 text-rose-700 border-rose-200',
    badgeDark: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
    dotColor: 'bg-rose-500'
  },
  URGENT: {
    value: 2,
    label: 'URGENT (P2)',
    badgeLight: 'bg-amber-100 text-amber-800 border-amber-200',
    badgeDark: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    dotColor: 'bg-amber-500'
  },
  NORMAL: {
    value: 1,
    label: 'NORMAL (P3)',
    badgeLight: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    badgeDark: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    dotColor: 'bg-emerald-500'
  }
};

const INITIAL_PATIENTS = [
  { 
    id: 99, 
    name: 'Marcus Brody', 
    age: 58, 
    gender: 'Male', 
    contact: '+91 91234-56789', 
    bloodGroup: 'O+', 
    department: 'Cardiology', 
    doctor: 'Dr. Sharma', 
    condition: 'Severe Myocardial Infarction', 
    triage: 'EMERGENCY', 
    arrivalSequence: 0, 
    registrationTime: '08:30:00 AM', 
    status: 'SERVED', 
    servedTime: '09:15:00 AM', 
    prescription: 'Intensive Cardiac Monitoring, Nitroglycerin IV, ECG every 2 hours', 
    wardAdmission: { 
      admitted: true, 
      wardType: 'ICU Bed', 
      admissionDate: '2026-10-01 09:15 AM', 
      expectedStayDays: '7' 
    },
    vitals: { bps: '165', bpd: '95', pulse: '115', spo2: '89', temp: '99.1' }
  },
  { 
    id: 100, 
    name: 'Helena Shaw', 
    age: 39, 
    gender: 'Female', 
    contact: '+91 98765-12345', 
    bloodGroup: 'A+', 
    department: 'Orthopedics', 
    doctor: 'Dr. Rao', 
    condition: 'Post-Op Tibia Fractures', 
    triage: 'URGENT', 
    arrivalSequence: 0, 
    registrationTime: '09:10:00 AM', 
    status: 'SERVED', 
    servedTime: '09:45:00 AM', 
    prescription: 'Post-op immobilizer, Paracetamol 500mg TID, Physiotherapy evaluation', 
    wardAdmission: { 
      admitted: true, 
      wardType: 'Private Room', 
      admissionDate: '2026-10-01 09:45 AM', 
      expectedStayDays: '4' 
    },
    vitals: { bps: '125', bpd: '82', pulse: '88', spo2: '97', temp: '98.6' }
  },
  { id: 101, name: 'Eleanor Vance', age: 45, gender: 'Female', contact: '+91 98765-43210', bloodGroup: 'O+', department: 'Cardiology', doctor: 'Dr. Sharma', condition: 'Cardiac Arrhythmia', triage: 'EMERGENCY', arrivalSequence: 1, registrationTime: '10:14:02 AM', status: 'QUEUED', prescription: '', wardAdmission: null, vitals: { bps: '170', bpd: '100', pulse: '120', spo2: '90', temp: '99.0' } },
  { id: 102, name: 'Arthur Pendelton', age: 68, gender: 'Male', contact: '+91 98123-45678', bloodGroup: 'A+', department: 'Emergency', doctor: 'Dr. Varma', condition: 'Acute Appendicitis', triage: 'EMERGENCY', arrivalSequence: 2, registrationTime: '10:15:30 AM', status: 'QUEUED', prescription: '', wardAdmission: null, vitals: { bps: '140', bpd: '90', pulse: '105', spo2: '94', temp: '101.8' } },
  { id: 103, name: 'Sophia Martinez', age: 29, gender: 'Female', contact: '+91 97654-32109', bloodGroup: 'B+', department: 'General Medicine', doctor: 'Dr. Mehta', condition: 'High Fever & Dehydration', triage: 'NORMAL', arrivalSequence: 3, registrationTime: '10:18:12 AM', status: 'QUEUED', prescription: '', wardAdmission: null, vitals: { bps: '118', bpd: '76', pulse: '82', spo2: '98', temp: '100.2' } },
  { id: 104, name: 'James Watson', age: 52, gender: 'Male', contact: '+91 96543-21098', bloodGroup: 'O-', department: 'Orthopedics', doctor: 'Dr. Rao', condition: 'Fractured Radius', triage: 'URGENT', arrivalSequence: 4, registrationTime: '10:20:45 AM', status: 'QUEUED', prescription: '', wardAdmission: null, vitals: { bps: '130', bpd: '85', pulse: '92', spo2: '96', temp: '98.4' } },
  { id: 105, name: 'Clara Oswald', age: 34, gender: 'Female', contact: '+91 95432-10987', bloodGroup: 'AB+', department: 'General Medicine', doctor: 'Dr. Mehta', condition: 'Mild Migraine', triage: 'NORMAL', arrivalSequence: 5, registrationTime: '10:22:10 AM', status: 'QUEUED', prescription: '', wardAdmission: null, vitals: { bps: '115', bpd: '75', pulse: '74', spo2: '99', temp: '98.6' } }
];

// =====================================================================================
// LIVE CLOCK COMPONENT — For Navbar Utility Bar
// =====================================================================================
const NavClock = ({ theme }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const pad = n => String(n).padStart(2, '0');
  const hh = pad(time.getHours() > 12 ? time.getHours() - 12 : time.getHours() || 12);
  const mm = pad(time.getMinutes());
  const ss = pad(time.getSeconds());
  const ampm = time.getHours() >= 12 ? 'PM' : 'AM';
  const dateStr = time.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className={`hidden xl:flex flex-col items-end leading-none select-none ${ 
      theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
    }`}>
      <span className={`text-sm font-black font-mono tracking-tight ${
        theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
      }`}>
        {hh}:{mm}:<span className={theme === 'dark' ? 'text-cyan-400' : 'text-blue-500'}>{ss}</span>
        <span className="text-[9px] font-bold ml-1 tracking-widest opacity-70">{ampm}</span>
      </span>
      <span className="text-[9px] font-mono mt-0.5 opacity-60">{dateStr}</span>
    </div>
  );
};

export default function App() {
  // Theme Engine ('dark' | 'light') with local persistence
  const [theme, setTheme] = useState(() => localStorage.getItem('bheeshma_theme') || 'dark');

  useEffect(() => {
    localStorage.setItem('bheeshma_theme', theme);
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  // Database Vector — synced in real-time from Firebase Firestore
  const [masterRegistry, setMasterRegistry] = useState([]);
  const [sequenceCounter, setSequenceCounter] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // ICU Beds Occupied State — persisted in Firestore system config
  const [icuOccupied, setIcuOccupied] = useState(0);
  const TOTAL_ICU_BEDS = parseInt(import.meta.env.VITE_TOTAL_ICU_BEDS) || 20;

  // Navigation Tab State: 'queue' | 'register' | 'records' | 'wards' | 'log'
  const [activeTab, setActiveTab] = useState('queue');

  // Global Command Search Modal State
  const [isCmdSearchOpen, setIsCmdSearchOpen] = useState(false);
  const [cmdSearchQuery, setCmdSearchQuery] = useState('');

  // Currently Consulted Patient & Prescription Note Input State
  const [currentServedPatient, setCurrentServedPatient] = useState(null);
  const [prescriptionInput, setPrescriptionInput] = useState('');

  // Inpatient Ward Admission Modal State
  const [isWardModalOpen, setIsWardModalOpen] = useState(false);
  const [wardFormData, setWardFormData] = useState({
    wardType: 'General Ward',
    admissionDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
    expectedStayDays: '3'
  });

  // Wards Tab View Mode: 'list' | 'floorplan'
  const [wardViewMode, setWardViewMode] = useState('list');
  const [wardSearchQuery, setWardSearchQuery] = useState('');
  const [selectedWardFilter, setSelectedWardFilter] = useState('All');

  // C++ Backend DSA Mapping Modal State
  const [isCppModalOpen, setIsCppModalOpen] = useState(false);

  // Keyboard shortcut Ctrl+K listener for global search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ── Firebase Firestore Real-Time Sync ────────────────────────────────────
  // Seeds initial data on first load, then keeps all state in sync live.
  useEffect(() => {
    let unsubPatients = () => {};
    let unsubSystem  = () => {};

    const init = async () => {
      const patientsRef  = collection(db, 'patients');
      const systemDocRef = doc(db, 'system', 'config');

      // Seed Firestore with demo patients only on very first load
      const snap = await getDocs(patientsRef);
      if (snap.empty) {
        const batch = writeBatch(db);
        INITIAL_PATIENTS.forEach(p => {
          batch.set(doc(db, 'patients', p.id.toString()), { ...p });
        });
        await batch.commit();
        await setDoc(systemDocRef, {
          sequenceCounter: INITIAL_PATIENTS.length,
          icuOccupied: 14
        });
      }

      // Real-time listener — patients collection
      unsubPatients = onSnapshot(patientsRef, (s) => {
        setMasterRegistry(s.docs.map(d => d.data()));
        setIsLoading(false);
      });

      // Real-time listener — system counters
      unsubSystem = onSnapshot(systemDocRef, (d) => {
        if (d.exists()) {
          setSequenceCounter(d.data().sequenceCounter || 0);
          setIcuOccupied(d.data().icuOccupied || 0);
        }
      });
    };

    init().catch(err => {
      console.error('Firestore init error:', err);
      setIsLoading(false);
    });

    return () => { unsubPatients(); unsubSystem(); };
  }, []);

  // Registration Form State with Vital Signs
  const [formData, setFormData] = useState({
    id: '106',
    name: '',
    age: '',
    gender: 'Male',
    contact: '',
    bloodGroup: 'O+',
    department: 'Emergency',
    doctor: 'Dr. Varma',
    condition: '',
    isEmergency: false,
    vitals: {
      bps: '120',
      bpd: '80',
      pulse: '76',
      spo2: '98',
      temp: '98.6'
    }
  });

  // Dynamic Vital Signs Auto-Triage Severity Calculator
  const calculatedTriage = useMemo(() => {
    const spo2 = parseFloat(formData.vitals.spo2);
    const bps = parseFloat(formData.vitals.bps);
    const pulse = parseFloat(formData.vitals.pulse);
    const temp = parseFloat(formData.vitals.temp);

    if (formData.isEmergency) return { level: 'EMERGENCY', reason: 'Manual Emergency Priority Override' };
    if (!isNaN(spo2) && spo2 < 92) return { level: 'EMERGENCY', reason: `Critically Low SpO2 (${spo2}% < 92%)` };
    if (!isNaN(bps) && (bps > 180 || bps < 90)) return { level: 'EMERGENCY', reason: `Hypertensive Crisis / Hypotension (${bps} mmHg)` };
    if (!isNaN(pulse) && pulse > 130) return { level: 'EMERGENCY', reason: `Severe Tachycardia (${pulse} bpm)` };
    if (!isNaN(temp) && temp > 102.5) return { level: 'EMERGENCY', reason: `High Fever Pyrexia (${temp}°F)` };

    if (!isNaN(pulse) && pulse > 100) return { level: 'URGENT', reason: `Elevated Heart Rate (${pulse} bpm)` };
    if (!isNaN(temp) && temp > 100.4) return { level: 'URGENT', reason: `Moderate Fever (${temp}°F)` };

    return { level: 'NORMAL', reason: 'Stable Clinical Vital Signs' };
  }, [formData.vitals, formData.isEmergency]);

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Master Database Search & Department Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');

  // Printable Consultation Slip Modal State
  const [printablePatient, setPrintablePatient] = useState(null);

  // Binary Search Visualizer Modal State
  const [bsTargetID, setBsTargetID] = useState('');
  const [bsSteps, setBsSteps] = useState([]);
  const [bsCurrentStepIdx, setBsCurrentStepIdx] = useState(0);
  const [isBsVisualizerOpen, setIsBsVisualizerOpen] = useState(false);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Auto-generate next Patient ID on form
  useEffect(() => {
    const nextId = masterRegistry.length > 0 
      ? Math.max(...masterRegistry.map(p => p.id)) + 1 
      : 101;
    setFormData(prev => ({ ...prev, id: nextId.toString() }));
  }, [masterRegistry.length]);

  // =====================================================================================
  // PRIORITY QUEUE HEAP SERVICE LOGIC (C++ std::priority_queue equivalent)
  // =====================================================================================
  const waitingQueue = useMemo(() => {
    const active = masterRegistry.filter(p => p.status === 'QUEUED');
    return active.sort((a, b) => {
      const pA = TRIAGE_LEVELS[a.triage].value;
      const pB = TRIAGE_LEVELS[b.triage].value;
      if (pA !== pB) return pB - pA; // Priority 1 (EMERGENCY) first
      return a.arrivalSequence - b.arrivalSequence; // FIFO stability
    });
  }, [masterRegistry]);

  // Admitted Inpatients List (Filtered from Master Registry)
  const admittedPatientsList = useMemo(() => {
    return masterRegistry.filter(p => p.wardAdmission && p.wardAdmission.admitted);
  }, [masterRegistry]);

  // Filtered Admitted Patients for Wards Tab
  const filteredAdmittedPatients = useMemo(() => {
    return admittedPatientsList.filter(p => {
      const matchesSearch = !wardSearchQuery.trim() ||
        p.id.toString().includes(wardSearchQuery.trim()) ||
        p.name.toLowerCase().includes(wardSearchQuery.toLowerCase().trim());
      const matchesWard = selectedWardFilter === 'All' || (p.wardAdmission && p.wardAdmission.wardType === selectedWardFilter);
      return matchesSearch && matchesWard;
    });
  }, [admittedPatientsList, wardSearchQuery, selectedWardFilter]);

  // Filtered Command Palette Patients
  const cmdSearchResults = useMemo(() => {
    if (!cmdSearchQuery.trim()) return masterRegistry.slice(0, 5);
    return masterRegistry.filter(p => 
      p.id.toString().includes(cmdSearchQuery.trim()) ||
      p.name.toLowerCase().includes(cmdSearchQuery.toLowerCase().trim())
    ).slice(0, 8);
  }, [masterRegistry, cmdSearchQuery]);

  // Process Next Patient (Dequeue from Priority Queue into Now Serving)
  const handleProcessNextPatient = async () => {
    if (waitingQueue.length === 0) {
      showToast('Waiting queue is empty. No patients currently waiting.', 'warning');
      return;
    }
    const nextPatient = waitingQueue[0];
    const servedTime  = new Date().toLocaleTimeString();
    try {
      await updateDoc(doc(db, 'patients', nextPatient.id.toString()), {
        status: 'SERVED', servedTime
      });
      setCurrentServedPatient({ ...nextPatient, servedTime });
      setPrescriptionInput('');
      showToast(`Called Patient #${nextPatient.id} (${nextPatient.name}) for consultation.`, 'success');
    } catch (err) {
      console.error('Process patient error:', err);
      showToast('Database error: could not process patient.', 'warning');
    }
  };

  // Open Ward Admission Modal
  const handleOpenWardModal = () => {
    if (!currentServedPatient) return;
    setWardFormData({
      wardType: currentServedPatient.triage === 'EMERGENCY' ? 'ICU Bed' : 'General Ward',
      admissionDate: new Date().toLocaleString(),
      expectedStayDays: '5'
    });
    setIsWardModalOpen(true);
  };

  // Confirm Inpatient Ward Admission
  const handleConfirmWardAdmission = async (e) => {
    e.preventDefault();
    if (!currentServedPatient) return;

    const admissionInfo = {
      admitted: true,
      wardType: wardFormData.wardType,
      admissionDate: wardFormData.admissionDate,
      expectedStayDays: wardFormData.expectedStayDays
    };

    setCurrentServedPatient(prev => ({ ...prev, wardAdmission: admissionInfo }));

    try {
      if (wardFormData.wardType === 'ICU Bed') {
        await updateDoc(doc(db, 'system', 'config'), { icuOccupied: increment(1) });
        showToast(`Admitted Patient #${currentServedPatient.id} to ICU Bed. ICU counter updated!`, 'warning');
      } else {
        showToast(`Assigned Patient #${currentServedPatient.id} to ${wardFormData.wardType} (${wardFormData.expectedStayDays} Days stay).`, 'success');
      }
    } catch (err) {
      console.error('Ward admission error:', err);
    }
    setIsWardModalOpen(false);
  };

  // Discharge Patient from Ward
  const handleDischargeFromWard = async (patientId) => {
    const target = masterRegistry.find(p => p.id === patientId);
    if (!target) return;
    try {
      await updateDoc(doc(db, 'patients', patientId.toString()), {
        wardAdmission: {
          ...target.wardAdmission,
          admitted: false,
          dischargedDate: new Date().toLocaleString()
        }
      });
      showToast(`Discharged Patient #${patientId} (${target.name}) from Inpatient Ward.`, 'success');
    } catch (err) {
      console.error('Ward discharge error:', err);
      showToast('Database error: could not discharge patient.', 'warning');
    }
  };

  // Discharge Currently Served Patient with Prescription Notes & Ward Admission Details
  const handleDischargePatient = async () => {
    if (!currentServedPatient) return;
    const updatedPrescription = prescriptionInput.trim() || 'Standard clinical observation & routine discharge advice.';
    try {
      await updateDoc(doc(db, 'patients', currentServedPatient.id.toString()), {
        status: 'SERVED',
        servedTime: currentServedPatient.servedTime || new Date().toLocaleTimeString(),
        prescription: updatedPrescription,
        wardAdmission: currentServedPatient.wardAdmission || null
      });
      const statusMsg = currentServedPatient.wardAdmission
        ? `Completed consultation & Admitted Patient #${currentServedPatient.id} (${currentServedPatient.name}) to ${currentServedPatient.wardAdmission.wardType}.`
        : `Discharged Patient #${currentServedPatient.id} (${currentServedPatient.name}) successfully.`;
      showToast(statusMsg, 'success');
      setCurrentServedPatient(null);
      setPrescriptionInput('');
    } catch (err) {
      console.error('Discharge error:', err);
      showToast('Database error: could not discharge patient.', 'warning');
    }
  };

  // Handle Form Registration Submission with Vital Signs
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const numericID  = parseInt(formData.id, 10);
    const numericAge = parseInt(formData.age, 10);

    if (isNaN(numericID) || numericID <= 0) {
      setFormError('Patient ID must be a positive integer.');
      return;
    }
    if (masterRegistry.some(p => p.id === numericID)) {
      setFormError(`Duplicate ID Error: Patient ID #${numericID} already exists in master registry.`);
      return;
    }
    if (!formData.name.trim()) {
      setFormError('Full Name is required.');
      return;
    }
    if (isNaN(numericAge) || numericAge <= 0 || numericAge > 120) {
      setFormError('Please enter a valid age between 1 and 120.');
      return;
    }
    if (!formData.condition.trim()) {
      setFormError('Medical Condition / Symptoms required.');
      return;
    }

    const newSeq     = sequenceCounter + 1;
    const triageLevel = calculatedTriage.level;

    const newPatient = {
      id: numericID,
      name: formData.name.trim(),
      age: numericAge,
      gender: formData.gender,
      contact: formData.contact.trim() || 'N/A',
      bloodGroup: formData.bloodGroup,
      department: formData.department,
      doctor: formData.doctor,
      condition: formData.condition.trim(),
      triage: triageLevel,
      arrivalSequence: newSeq,
      registrationTime: new Date().toLocaleTimeString(),
      status: 'QUEUED',
      prescription: '',
      wardAdmission: null,
      vitals: { ...formData.vitals }
    };

    try {
      await setDoc(doc(db, 'patients', numericID.toString()), newPatient);
      await updateDoc(doc(db, 'system', 'config'), { sequenceCounter: newSeq });
      setFormSuccess(`Registered Patient #${newPatient.id} (${newPatient.name}) — Auto-Triage: ${TRIAGE_LEVELS[triageLevel].label} (${calculatedTriage.reason})`);
      showToast(`Registered Patient #${newPatient.id} (${TRIAGE_LEVELS[triageLevel].label})`, 'success');
      setFormData({
        id: (numericID + 1).toString(),
        name: '', age: '', gender: 'Male', contact: '',
        bloodGroup: 'O+', department: 'Emergency', doctor: 'Dr. Varma',
        condition: '', isEmergency: false,
        vitals: { bps: '120', bpd: '80', pulse: '76', spo2: '98', temp: '98.6' }
      });
    } catch (err) {
      console.error('Registration error:', err);
      setFormError('Database error: Failed to register patient. Please try again.');
    }
  };

  // Handle Cancel Appointment / Delete Record
  const handleCancelPatient = async (id) => {
    const target = masterRegistry.find(p => p.id === id);
    if (!target) return;
    try {
      await deleteDoc(doc(db, 'patients', id.toString()));
      showToast(`Deleted Patient record #${id} (${target.name}) from system vector.`, 'info');
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Database error: could not delete patient.', 'warning');
    }
  };

  // Export Master Records Database to CSV
  const handleExportCSV = () => {
    if (masterRegistry.length === 0) {
      showToast('No records available in master database to export.', 'warning');
      return;
    }

    const headers = ['Patient ID', 'Full Name', 'Age', 'Gender', 'Contact', 'Blood Group', 'Department', 'Assigned Doctor', 'Medical Condition', 'Triage Priority', 'Status', 'Registration Time', 'Served Time', 'Prescription Notes', 'Ward Admission'];
    
    const rows = masterRegistry.map(p => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.age,
      p.gender,
      `"${p.contact}"`,
      p.bloodGroup,
      `"${p.department}"`,
      `"${p.doctor}"`,
      `"${p.condition.replace(/"/g, '""')}"`,
      p.triage,
      p.status,
      `"${p.registrationTime || ''}"`,
      `"${p.servedTime || ''}"`,
      `"${(p.prescription || '').replace(/"/g, '""')}"`,
      `"${p.wardAdmission ? `${p.wardAdmission.wardType} (${p.wardAdmission.expectedStayDays} Days)` : 'Outpatient / Discharged'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bheeshma_patient_records_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exported patient database to CSV file successfully.', 'success');
  };

  // Handle Binary Search Visualizer
  const runBinarySearchVisualizer = (targetInput) => {
    const searchId = parseInt(targetInput, 10);
    if (isNaN(searchId)) {
      showToast('Enter a valid numeric Patient ID for Binary Search.', 'warning');
      return;
    }

    const sortedVec = [...masterRegistry].sort((a, b) => a.id - b.id);
    let low = 0;
    let high = sortedVec.length - 1;
    const steps = [];

    while (low <= high) {
      const mid = Math.floor(low + (high - low) / 2);
      const midVal = sortedVec[mid].id;

      steps.push({
        low,
        high,
        mid,
        midVal,
        sortedVec: [...sortedVec],
        comparison: midVal === searchId ? 'MATCH_FOUND' : (midVal < searchId ? 'LESS_THAN' : 'GREATER_THAN'),
        explanation: midVal === searchId 
          ? `MATCH FOUND! target (${searchId}) === array[${mid}].id (${midVal}). Search resolved in O(log N).`
          : (midVal < searchId 
            ? `array[${mid}].id (${midVal}) < target (${searchId}). Shifting low pointer to mid + 1 (${mid + 1}).`
            : `array[${mid}].id (${midVal}) > target (${searchId}). Shifting high pointer to mid - 1 (${mid - 1}).`)
      });

      if (midVal === searchId) break;
      if (midVal < searchId) low = mid + 1;
      else high = mid - 1;
    }

    if (steps.length === 0 || steps[steps.length - 1].comparison !== 'MATCH_FOUND') {
      steps.push({
        low,
        high,
        mid: -1,
        midVal: null,
        sortedVec: [...sortedVec],
        comparison: 'NOT_FOUND',
        explanation: `Target ID #${searchId} does not exist in master registry vector.`
      });
    }

    setBsSteps(steps);
    setBsCurrentStepIdx(0);
    setIsBsVisualizerOpen(true);
  };

  // Filtered Master Database Records
  const filteredRecords = useMemo(() => {
    return masterRegistry.filter(p => {
      const matchesSearch = !searchQuery.trim() || 
        p.id.toString().includes(searchQuery.trim()) || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
      const matchesDept = selectedDeptFilter === 'All' || p.department === selectedDeptFilter;
      return matchesSearch && matchesDept;
    });
  }, [masterRegistry, searchQuery, selectedDeptFilter]);

  // Consultation History Log Array
  const servedPatientsHistory = useMemo(() => {
    return masterRegistry.filter(p => p.status === 'SERVED');
  }, [masterRegistry]);

  // Metrics Bar Computations
  const metrics = useMemo(() => {
    const totalWaiting = waitingQueue.length;
    const emergencyCount = waitingQueue.filter(p => p.triage === 'EMERGENCY').length;
    const servedCount = servedPatientsHistory.length;
    const admittedCount = admittedPatientsList.length;
    return { totalWaiting, emergencyCount, servedCount, admittedCount };
  }, [waitingQueue, servedPatientsHistory, admittedPatientsList]);

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col font-sans ${
      theme === 'dark' ? 'bg-[#000000] text-[#f5f5f7]' : 'bg-[#ffffff] text-[#1d1d1f]'
    }`}>

      {/* ── Firestore Loading Overlay ───────────────────────────────────────── */}
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm">
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
            <HeartPulse className="absolute inset-0 m-auto w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
          <p className="text-cyan-300 font-mono text-sm font-bold tracking-widest uppercase">Connecting to Database</p>
          <p className="text-slate-500 font-mono text-xs mt-1">Loading patient records from Firebase...</p>
        </div>
      )}

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl border flex items-center gap-3 backdrop-blur-xl transition-all duration-300 animate-slide-in ${
          toastMessage.type === 'warning' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/30' :
          toastMessage.type === 'info' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/30' :
          'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/30'
        }`}>
          {toastMessage.type === 'warning' ? <AlertTriangle className="w-5 h-5 text-amber-500" /> : <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          <span className="text-xs font-semibold tracking-tight">{toastMessage.text}</span>
        </div>
      )}

      {/* ===================================================================================== */}
      {/* ENTERPRISE PROFESSIONAL NAVIGATION BAR — PREMIUM REDESIGN */}
      {/* ===================================================================================== */}
      {/* ===================================================================================== */}
      {/* ENTERPRISE PROFESSIONAL NAVIGATION BAR — CLEAN SAAS DESIGN */}
      {/* ===================================================================================== */}
      <header className={`sticky top-0 z-50 transition-all duration-300 border-b backdrop-blur-xl ${
        theme === 'dark'
          ? 'bg-black/70 border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-white/80 border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* ── LOGO / BRAND (Left) ─────────────────────────────────────────────────── */}
            <div className="flex items-center gap-4 shrink-0 group cursor-pointer" onClick={() => setActiveTab('queue')}>
              <div className="relative h-10 w-10 rounded-xl overflow-hidden shadow-lg border border-slate-200/50 dark:border-white/10 transition-transform duration-300 group-hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-teal-400/20 mix-blend-overlay"></div>
                <img src="/bheeshma_logo.jpg" alt="Bheeshma" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <span className={`text-xl font-extrabold tracking-tight leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Bheeshma<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 dark:from-cyan-400 dark:to-teal-300 ml-1">Healthcare</span>
                </span>
                <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-500 dark:text-slate-400">Intelligent Triage System</span>
              </div>
            </div>

            {/* ── DESKTOP NAV TABS (Center) ─────────────────────────────────────── */}
            <nav className="hidden lg:flex items-center gap-1.5 p-1.5 rounded-full border border-slate-200/50 dark:border-white/10 bg-slate-100/50 dark:bg-white/5">
              {[
                { id: 'queue',    label: 'Live Triage', icon: Activity },
                { id: 'register', label: 'Registration', icon: UserPlus },
                { id: 'records',  label: 'Master DB', icon: Layers },
                { id: 'wards',    label: 'Wards', icon: Bed },
                { id: 'log',      label: 'Logs', icon: ClipboardList }
              ].map(tab => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                      isActive
                        ? theme === 'dark' 
                            ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                            : 'bg-white text-blue-700 shadow-sm border border-slate-200/50'
                        : theme === 'dark' 
                            ? 'text-slate-400 hover:text-slate-200 hover:bg-white/5' 
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'opacity-100' : 'opacity-70'}`} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            {/* ── RIGHT: UTILITY BAR ───────────────────────────────────────────── */}
            <div className="flex items-center gap-3 shrink-0">
              
              {/* Emergency Alert (If Any) */}
              {metrics.emergencyCount > 0 && (
                <button
                  onClick={() => setActiveTab('queue')}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm font-bold border border-rose-500/20 hover:bg-rose-500/20 transition-all duration-300 shadow-[0_0_15px_rgba(244,63,94,0.1)] cursor-pointer hover:scale-105"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                  </span>
                  {metrics.emergencyCount} P1 Critical
                </button>
              )}

              {/* Search Button */}
              <button
                onClick={() => setIsCmdSearchOpen(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:border-white/20 hover:bg-white/10'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/50'
                }`}
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Search</span>
                <kbd className={`hidden md:inline-flex items-center justify-center ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                  theme === 'dark' ? 'bg-black/50 text-slate-400' : 'bg-slate-100 text-slate-500'
                }`}>⌘K</kbd>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-full border transition-all duration-300 cursor-pointer shadow-sm hover:scale-110 ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/10 text-amber-300 hover:bg-white/10 hover:border-amber-500/30 hover:shadow-[0_0_15px_rgba(252,211,77,0.15)]'
                    : 'bg-white border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200'
                }`}
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
              </button>
              
              {/* DSA Info Badge */}
              <button
                onClick={() => setIsCppModalOpen(true)}
                className={`hidden xl:flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-mono font-bold transition-all duration-300 cursor-pointer shadow-sm ${
                  theme === 'dark'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300'
                }`}
              >
                <Code2 className="w-4 h-4" />
                DSA Active
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── MOBILE BOTTOM TAB BAR ────────────────────────────────────────────── */}
      <div className={`lg:hidden fixed bottom-0 inset-x-0 z-40 border-t backdrop-blur-2xl ${
        theme === 'dark'
          ? 'bg-[#050509]/95 border-white/[0.08]'
          : 'bg-white/95 border-slate-200'
      }`}>
        <div className="flex items-stretch h-16">
          {[
            { id: 'queue',    label: 'Triage',    icon: Activity },
            { id: 'register', label: 'Register',  icon: UserPlus },
            { id: 'records',  label: 'Master DB', icon: LayoutGrid },
            { id: 'wards',    label: 'Wards',     icon: Building2 },
            { id: 'log',      label: 'Log',       icon: ClipboardList }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold cursor-pointer transition-all duration-200 ${
                  isActive
                    ? theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'
                    : theme === 'dark' ? 'text-slate-600 hover:text-slate-400' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <div className={`relative p-1.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? theme === 'dark' ? 'bg-cyan-500/15' : 'bg-blue-500/10'
                    : ''
                }`}>
                  <Icon className="w-5 h-5" />
                  {isActive && (
                    <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border-2 ${
                      theme === 'dark' ? 'bg-cyan-400 border-[#050509]' : 'bg-blue-600 border-white'
                    }`} />
                  )}
                </div>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
        {/* iOS safe area spacer */}
        <div className="h-safe-bottom" />
      </div>

      {/* DASHBOARD CONTENT BODY */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8 space-y-8">
        
        {/* ================================================================================= */}
        {/* TAB 1: LIVE TRIAGE DASHBOARD */}
        {/* ================================================================================= */}
        {activeTab === 'queue' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* METRICS BAR */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              
              {/* Metric 1: Waiting Queue */}
              <div className="apple-panel p-5 rounded-3xl border border-slate-200 dark:border-neutral-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-mono">Waiting Queue</span>
                  <Clock className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{metrics.totalWaiting}</div>
                <p className="text-[10px] text-slate-400 mt-1">Priority heap active patients</p>
              </div>

              {/* Metric 2: Emergency Triage */}
              <div className="apple-panel p-5 rounded-3xl border border-rose-500/30 glow-emergency">
                <div className="flex items-center justify-between text-rose-500 mb-1">
                  <span className="text-xs font-mono font-bold">Emergency Triage</span>
                  <AlertTriangle className="w-4 h-4 animate-bounce" />
                </div>
                <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">{metrics.emergencyCount}</div>
                <p className="text-[10px] text-rose-500/80 font-medium mt-1">Critical P1 bypass cases</p>
              </div>

              {/* Metric 3: ICU Beds Occupied Ratio */}
              <div className="apple-panel p-5 rounded-3xl border border-indigo-500/30">
                <div className="flex items-center justify-between text-indigo-500 mb-1">
                  <span className="text-xs font-mono font-bold">ICU Beds Occupied</span>
                  <Bed className="w-4 h-4" />
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{icuOccupied}</div>
                  <span className="text-sm font-bold text-slate-400">/ {TOTAL_ICU_BEDS}</span>
                </div>
                
                {/* Interactive ICU Bed Adjuster Controls */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200 dark:border-neutral-800">
                  <span className="text-[10px] text-slate-400">Capacity Ratio: {Math.round((icuOccupied/TOTAL_ICU_BEDS)*100)}%</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setIcuOccupied(prev => Math.max(0, prev - 1))}
                      className="w-5 h-5 rounded bg-slate-200 dark:bg-neutral-800 text-slate-700 dark:text-slate-200 text-xs flex items-center justify-center font-bold hover:bg-slate-300 dark:hover:bg-neutral-700 cursor-pointer"
                      title="Release ICU Bed"
                    >
                      -
                    </button>
                    <button
                      onClick={() => setIcuOccupied(prev => Math.min(TOTAL_ICU_BEDS, prev + 1))}
                      className="w-5 h-5 rounded bg-indigo-600 text-white text-xs flex items-center justify-center font-bold hover:bg-indigo-500 cursor-pointer"
                      title="Admit to ICU Bed"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Metric 4: Processed Today */}
              <div className="apple-panel p-5 rounded-3xl border border-emerald-500/30">
                <div className="flex items-center justify-between text-emerald-500 mb-1">
                  <span className="text-xs font-mono font-bold">Processed Today</span>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{metrics.servedCount}</div>
                <p className="text-[10px] text-emerald-500/80 font-medium mt-1">Discharged consultations</p>
              </div>

            </div>

            {/* UPPER GRID: NOW SERVING HERO CARD + HEAP ORDER SUMMARY */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* NOW SERVING HERO CARD (WITH PRESCRIPTION NOTE INPUT & WARD ADMISSION FEATURE) */}
              <div className={`lg:col-span-2 apple-panel rounded-3xl p-8 border flex flex-col justify-between shadow-xl transition-all ${
                theme === 'dark' ? 'border-cyan-500/30 bg-[#161618]/90' : 'border-blue-500/30 bg-white'
              }`}>
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-neutral-800">
                    <span className="flex items-center gap-2 text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-cyan-400 animate-ping"></span>
                      Now Serving Consultation Desk
                    </span>
                    
                    <button
                      onClick={handleProcessNextPatient}
                      disabled={waitingQueue.length === 0}
                      className="px-5 py-2.5 rounded-2xl font-bold bg-blue-600 hover:bg-blue-500 dark:bg-cyan-400 dark:hover:bg-cyan-300 text-white dark:text-black disabled:opacity-40 disabled:cursor-not-allowed text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 dark:shadow-cyan-400/20 transition active:scale-95 cursor-pointer"
                    >
                      <Stethoscope className="w-4 h-4" />
                      <span>Call Next Patient (Dequeue)</span>
                    </button>
                  </div>

                  {currentServedPatient ? (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-mono text-slate-400">ID #{currentServedPatient.id}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              theme === 'dark' ? TRIAGE_LEVELS[currentServedPatient.triage].badgeDark : TRIAGE_LEVELS[currentServedPatient.triage].badgeLight
                            }`}>
                              {TRIAGE_LEVELS[currentServedPatient.triage].label}
                            </span>
                            {currentServedPatient.wardAdmission && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center gap-1">
                                <Building2 className="w-3 h-3 text-indigo-400" />
                                {currentServedPatient.wardAdmission.wardType} ({currentServedPatient.wardAdmission.expectedStayDays} Days)
                              </span>
                            )}
                          </div>
                          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{currentServedPatient.name}</h2>
                          <p className="text-xs text-slate-500 mt-0.5">{currentServedPatient.gender}, {currentServedPatient.age} yrs • Blood Group: <span className="font-bold text-rose-500">{currentServedPatient.bloodGroup}</span> • Contact: <span className="font-mono text-slate-600 dark:text-slate-300">{currentServedPatient.contact}</span></p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-neutral-800/80 border border-slate-200 dark:border-neutral-700 text-left sm:text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-mono block">Assigned Specialist</span>
                          <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 block">{currentServedPatient.doctor}</span>
                          <span className="text-[10px] text-slate-500 block">{currentServedPatient.department} Department</span>
                        </div>
                      </div>

                      {/* Patient Vitals Overview Badge */}
                      {currentServedPatient.vitals && (
                        <div className="grid grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-100/80 dark:bg-neutral-900/80 border border-slate-200 dark:border-neutral-800 text-center font-mono text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block">BP (mmHg)</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{currentServedPatient.vitals.bps}/{currentServedPatient.vitals.bpd}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Pulse</span>
                            <span className="font-bold text-emerald-500">{currentServedPatient.vitals.pulse} bpm</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">SpO2</span>
                            <span className={`font-bold ${parseFloat(currentServedPatient.vitals.spo2) < 92 ? 'text-rose-500' : 'text-cyan-400'}`}>
                              {currentServedPatient.vitals.spo2}%
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">Temp</span>
                            <span className="font-bold text-amber-500">{currentServedPatient.vitals.temp}°F</span>
                          </div>
                        </div>
                      )}

                      <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-neutral-950/70 border border-slate-200 dark:border-neutral-800 space-y-1.5">
                        <span className="text-[11px] font-mono font-bold text-slate-400 uppercase block">Primary Medical Diagnosis:</span>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{currentServedPatient.condition}</p>
                      </div>

                      {/* PRESCRIPTION / MEDICAL NOTES INPUT FIELD */}
                      <div className="space-y-2 pt-2">
                        <label className="flex items-center justify-between text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                          <span className="flex items-center gap-1.5">
                            <Pencil className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                            Doctor's Prescription & Medical Treatment Notes:
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal">Saves into Consultation Log</span>
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Type clinical diagnosis, prescribed medication (e.g. Amoxicillin 500mg, IV fluids), and follow-up instructions..."
                          value={prescriptionInput}
                          onChange={(e) => setPrescriptionInput(e.target.value)}
                          className={`w-full px-4 py-3 rounded-2xl text-xs focus:outline-none transition border ${
                            theme === 'dark'
                              ? 'bg-neutral-900 border-neutral-800 text-slate-100 focus:border-cyan-500'
                              : 'bg-white border-slate-200 text-slate-900 focus:border-blue-600'
                          }`}
                        />
                      </div>

                      {/* CLINICAL ACTION BUTTONS: ADMIT TO WARD / ROOM + COMPLETE & DISCHARGE */}
                      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                        
                        {/* INPATIENT WARD ADMISSION BUTTON */}
                        <button
                          onClick={handleOpenWardModal}
                          className="px-5 py-3 rounded-2xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition active:scale-95 cursor-pointer"
                        >
                          <Building2 className="w-4 h-4" />
                          <span>Admit to Ward / Room</span>
                        </button>

                        {/* COMPLETE & DISCHARGE PATIENT BUTTON */}
                        <button
                          onClick={handleDischargePatient}
                          className="px-6 py-3 rounded-2xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition active:scale-95 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Complete & Discharge Patient</span>
                        </button>
                      </div>

                    </div>
                  ) : (
                    <div className="py-14 text-center space-y-3">
                      <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center border ${
                        theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-slate-100 border-slate-200'
                      }`}>
                        <Stethoscope className="w-7 h-7 text-slate-400" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Consultation Room Ready</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">Click "Call Next Patient (Dequeue)" to serve the top priority waiting record.</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-6 border-t border-slate-200 dark:border-neutral-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">C++ Backend Data Structure:</span>
                  <span className="font-mono text-blue-600 dark:text-cyan-400 font-bold">std::priority_queue (Max-Heap)</span>
                </div>
              </div>

              {/* HEAP QUEUE ARCHITECTURE & TRIAGE RULES CARD */}
              <div className="apple-panel rounded-3xl p-6 border border-slate-200 dark:border-neutral-800 flex flex-col justify-between shadow-xl">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <span>Triage Queue Protocol</span>
                  </h3>
                  
                  <div className="space-y-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                      <span className="font-bold text-rose-500 block mb-0.5 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        1. Emergency Preemption (P1)
                      </span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">Critical P1 cases automatically jump to the top of the priority heap.</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                      <span className="font-bold text-amber-500 block mb-0.5">2. Urgent Priority Tier (P2)</span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">Urgent condition patients bypass routine checkups.</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                      <span className="font-bold text-blue-500 block mb-0.5">3. FIFO Arrival Stability</span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">Patients sharing identical triage levels are served strictly in arrival order.</p>
                    </div>
                  </div>
                </div>

                {/* DOCTORS ON DUTY ROSTER SUMMARY */}
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-neutral-800 space-y-2">
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase block">Active Doctors Roster:</span>
                  <div className="space-y-1.5 text-xs">
                    {DOCTORS.map(doc => (
                      <div key={doc.name} className="flex justify-between items-center text-[11px]">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{doc.name} ({doc.dept})</span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          {doc.room}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* ACTIVE WAITING QUEUE LIST */}
            <div className="apple-panel rounded-3xl border border-slate-200 dark:border-neutral-800 overflow-hidden shadow-2xl">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                  <span>Active Waiting Queue List</span>
                  <span className="text-xs font-normal text-slate-500">(Max-Heap Triage Order)</span>
                </h3>
                <span className="text-xs font-mono text-slate-500 font-bold">{waitingQueue.length} Patients Waiting</span>
              </div>

              {waitingQueue.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className={`uppercase font-mono text-[10px] border-b ${
                      theme === 'dark' ? 'bg-neutral-900/90 text-slate-400 border-neutral-800' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      <tr>
                        <th className="px-6 py-3.5">Queue Rank</th>
                        <th className="px-6 py-3.5">ID</th>
                        <th className="px-6 py-3.5">Patient Name</th>
                        <th className="px-6 py-3.5">Age / Gender</th>
                        <th className="px-6 py-3.5">Department</th>
                        <th className="px-6 py-3.5">Assigned Specialist</th>
                        <th className="px-6 py-3.5">Triage Level</th>
                        <th className="px-6 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-neutral-800/60">
                      {waitingQueue.map((patient, idx) => {
                        const triageMeta = TRIAGE_LEVELS[patient.triage];
                        const isEmergency = patient.triage === 'EMERGENCY';

                        return (
                          <tr 
                            key={patient.id} 
                            className={`transition hover:bg-slate-100/50 dark:hover:bg-neutral-800/40 ${
                              isEmergency ? 'bg-rose-500/5' : ''
                            }`}
                          >
                            <td className="px-6 py-4 font-mono font-bold">
                              {idx === 0 ? (
                                <span className={`px-2.5 py-1 rounded-full text-[10px] border flex items-center gap-1 w-fit ${
                                  theme === 'dark' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-blue-100 text-blue-800 border-blue-200'
                                }`}>
                                  <Sparkles className="w-3 h-3 text-blue-600 dark:text-cyan-400" />
                                  #1 NEXT UP
                                </span>
                              ) : (
                                <span className="text-slate-400">#{idx + 1}</span>
                              )}
                            </td>
                            <td className="px-6 py-4 font-mono text-blue-600 dark:text-cyan-400 font-bold">#{patient.id}</td>
                            <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">{patient.name}</td>
                            <td className="px-6 py-4 text-slate-500">{patient.age} yrs • {patient.gender}</td>
                            <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">{patient.department}</td>
                            <td className="px-6 py-4 text-slate-500">{patient.doctor}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 w-fit ${
                                theme === 'dark' ? triageMeta.badgeDark : triageMeta.badgeLight
                              } ${isEmergency ? 'animate-pulse' : ''}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${triageMeta.dotColor}`}></span>
                                {triageMeta.label}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => handleCancelPatient(patient.id)}
                                className="px-2.5 py-1 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-[11px] font-semibold border border-rose-500/20 transition flex items-center gap-1 ml-auto cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                                Cancel
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-16 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500/60 mx-auto" />
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Waiting Queue is Empty</h4>
                  <p className="text-xs text-slate-500">All registered patients have been processed.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ================================================================================= */}
        {/* TAB 2: EXPANDED PATIENT REGISTRATION PORTAL (WITH VITALS & AUTO-TRIAGE) */}
        {/* ================================================================================= */}
        {activeTab === 'register' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <div className="apple-panel rounded-3xl p-8 border border-slate-200 dark:border-neutral-800 shadow-2xl">
              
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-200 dark:border-neutral-800">
                <div className={`p-3 rounded-2xl border ${
                  theme === 'dark' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-blue-50 text-blue-600 border-blue-200'
                }`}>
                  <UserPlus className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Patient Registration Portal</h2>
                  <p className="text-xs text-slate-500">Intake registration with automated vitals-based triage priority scoring</p>
                </div>
              </div>

              {formError && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2 mb-6 font-medium">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs flex items-center gap-2 mb-6 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Patient ID (Auto/Unique) *
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 106"
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-2xl text-xs font-mono focus:outline-none transition border ${
                        theme === 'dark'
                          ? 'bg-neutral-900 border-neutral-800 text-slate-100 focus:border-cyan-500'
                          : 'bg-white border-slate-200 text-slate-900 focus:border-blue-600'
                      }`}
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Robert Thorne"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-2xl text-xs focus:outline-none transition border ${
                        theme === 'dark'
                          ? 'bg-neutral-900 border-neutral-800 text-slate-100 focus:border-cyan-500'
                          : 'bg-white border-slate-200 text-slate-900 focus:border-blue-600'
                      }`}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Age (Years) *
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 42"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-2xl text-xs font-mono focus:outline-none transition border ${
                        theme === 'dark'
                          ? 'bg-neutral-900 border-neutral-800 text-slate-100 focus:border-cyan-500'
                          : 'bg-white border-slate-200 text-slate-900 focus:border-blue-600'
                      }`}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Gender *
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-2xl text-xs focus:outline-none transition border ${
                        theme === 'dark'
                          ? 'bg-neutral-900 border-neutral-800 text-slate-100 focus:border-cyan-500'
                          : 'bg-white border-slate-200 text-slate-900 focus:border-blue-600'
                      }`}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Blood Group *
                    </label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-2xl text-xs focus:outline-none transition border ${
                        theme === 'dark'
                          ? 'bg-neutral-900 border-neutral-800 text-slate-100 focus:border-cyan-500'
                          : 'bg-white border-slate-200 text-slate-900 focus:border-blue-600'
                      }`}
                    >
                      {BLOOD_GROUPS.map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* VITAL SIGNS AUTO-TRIAGE CALCULATOR SECTION */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 flex items-center gap-1.5">
                      <Gauge className="w-4 h-4" /> Patient Vital Signs & Auto-Triage Severity Evaluator
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      calculatedTriage.level === 'EMERGENCY' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' :
                      calculatedTriage.level === 'URGENT' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                      'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    }`}>
                      Calculated: {calculatedTriage.level}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 mb-1">Blood Pressure (Systolic)</label>
                      <input
                        type="number"
                        placeholder="120"
                        value={formData.vitals.bps}
                        onChange={(e) => setFormData({ ...formData, vitals: { ...formData.vitals, bps: e.target.value } })}
                        className="w-full px-3 py-1.5 rounded-xl text-xs font-mono bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 mb-1">Heart Rate (bpm)</label>
                      <input
                        type="number"
                        placeholder="76"
                        value={formData.vitals.pulse}
                        onChange={(e) => setFormData({ ...formData, vitals: { ...formData.vitals, pulse: e.target.value } })}
                        className="w-full px-3 py-1.5 rounded-xl text-xs font-mono bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 mb-1">SpO2 Oxygen (%)</label>
                      <input
                        type="number"
                        placeholder="98"
                        value={formData.vitals.spo2}
                        onChange={(e) => setFormData({ ...formData, vitals: { ...formData.vitals, spo2: e.target.value } })}
                        className="w-full px-3 py-1.5 rounded-xl text-xs font-mono bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 mb-1">Temp (°F)</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="98.6"
                        value={formData.vitals.temp}
                        onChange={(e) => setFormData({ ...formData, vitals: { ...formData.vitals, temp: e.target.value } })}
                        className="w-full px-3 py-1.5 rounded-xl text-xs font-mono bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 italic">
                    Reason: <span className="font-semibold text-slate-700 dark:text-slate-300">{calculatedTriage.reason}</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Contact Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. +91 98765-43210"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-2xl text-xs font-mono focus:outline-none transition border ${
                        theme === 'dark'
                          ? 'bg-neutral-900 border-neutral-800 text-slate-100 focus:border-cyan-500'
                          : 'bg-white border-slate-200 text-slate-900 focus:border-blue-600'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Department *
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => {
                        const dept = e.target.value;
                        const matchingDoc = DOCTORS.find(d => d.dept === dept) || DOCTORS[0];
                        setFormData({ ...formData, department: dept, doctor: matchingDoc.name });
                      }}
                      className={`w-full px-4 py-2.5 rounded-2xl text-xs focus:outline-none transition border ${
                        theme === 'dark'
                          ? 'bg-neutral-900 border-neutral-800 text-slate-100 focus:border-cyan-500'
                          : 'bg-white border-slate-200 text-slate-900 focus:border-blue-600'
                      }`}
                    >
                      {DEPARTMENTS.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Assigned Specialist Doctor
                    </label>
                    <input
                      type="text"
                      value={formData.doctor}
                      readOnly
                      className={`w-full px-4 py-2.5 rounded-2xl text-xs font-semibold focus:outline-none border opacity-80 cursor-not-allowed ${
                        theme === 'dark'
                          ? 'bg-neutral-900 border-neutral-800 text-cyan-400'
                          : 'bg-slate-100 border-slate-200 text-blue-600'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Medical Condition / Symptoms Description *
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Acute chest discomfort, shortness of breath..."
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-2xl text-xs focus:outline-none transition border ${
                      theme === 'dark'
                        ? 'bg-neutral-900 border-neutral-800 text-slate-100 focus:border-cyan-500'
                        : 'bg-white border-slate-200 text-slate-900 focus:border-blue-600'
                    }`}
                    required
                  ></textarea>
                </div>

                {/* EMERGENCY CASE TOGGLE SWITCH */}
                <div className={`p-4 rounded-2xl border flex items-center justify-between transition ${
                  formData.isEmergency 
                    ? 'bg-rose-500/10 border-rose-500/40 glow-emergency' 
                    : theme === 'dark' ? 'bg-neutral-900/60 border-neutral-800' : 'bg-slate-100/70 border-slate-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <AlertTriangle className={`w-5 h-5 ${formData.isEmergency ? 'text-rose-500' : 'text-slate-400'}`} />
                    <div>
                      <span className="text-xs font-bold block text-slate-900 dark:text-slate-100">
                        Emergency Case Manual Override Switch (P1 Bypass)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Force-assign Priority 1 Emergency status to bypass routine intake queue.
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isEmergency: !formData.isEmergency })}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 cursor-pointer ${
                      formData.isEmergency ? 'bg-rose-500' : 'bg-slate-300 dark:bg-neutral-800'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                      formData.isEmergency ? 'translate-x-6' : 'translate-x-0'
                    }`}></div>
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl font-bold bg-blue-600 hover:bg-blue-500 dark:bg-cyan-400 dark:hover:bg-cyan-300 text-white dark:text-black text-xs shadow-lg shadow-blue-500/20 dark:shadow-cyan-400/20 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Register & Enqueue Patient Record</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================================================================================= */}
        {/* TAB 3: MASTER RECORDS DATABASE (VECTOR SEARCH, FILTER & CSV EXPORT) */}
        {/* ================================================================================= */}
        {activeTab === 'records' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Search, Department Filter & CSV Export Toolbar */}
            <div className="apple-panel rounded-3xl p-6 border border-slate-200 dark:border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4">
              
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                {/* Search Bar */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search by ID or Patient Name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs focus:outline-none transition border ${
                      theme === 'dark'
                        ? 'bg-neutral-900 border-neutral-800 text-slate-100 focus:border-cyan-500'
                        : 'bg-white border-slate-200 text-slate-900 focus:border-blue-600'
                    }`}
                  />
                </div>

                {/* Department Filter Dropdown */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    value={selectedDeptFilter}
                    onChange={(e) => setSelectedDeptFilter(e.target.value)}
                    className={`px-3.5 py-2.5 rounded-2xl text-xs focus:outline-none transition border ${
                      theme === 'dark'
                        ? 'bg-neutral-900 border-neutral-800 text-slate-100'
                        : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="All">All Departments</option>
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons: Export CSV & Binary Search Visualizer */}
              <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
                {/* EXPORT TO CSV BUTTON */}
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2.5 rounded-2xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white text-xs flex items-center gap-2 shadow-md transition active:scale-95 cursor-pointer"
                  title="Export all master records as a .csv file"
                >
                  <Download className="w-4 h-4" />
                  <span>Export to CSV</span>
                </button>

                {/* Binary Search Trigger Input */}
                <div className={`flex items-center gap-2 border rounded-2xl px-3 py-1.5 ${
                  theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200'
                }`}>
                  <Binary className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                  <input
                    type="number"
                    placeholder="Target ID..."
                    value={bsTargetID}
                    onChange={(e) => setBsTargetID(e.target.value)}
                    className="w-20 bg-transparent text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                  <button
                    onClick={() => runBinarySearchVisualizer(bsTargetID)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 dark:bg-cyan-400 dark:hover:bg-cyan-300 text-white dark:text-black text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Binary Search O(log N)
                  </button>
                </div>
              </div>

            </div>

            {/* MASTER RECORDS DATA TABLE */}
            <div className="apple-panel rounded-3xl border border-slate-200 dark:border-neutral-800 overflow-hidden shadow-2xl">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                  <span>Master Patient Registry Database (`std::vector&lt;Patient&gt;`)</span>
                </h3>
                <span className="text-xs font-mono text-slate-500">Total Records: {filteredRecords.length}</span>
              </div>

              {filteredRecords.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className={`uppercase font-mono text-[10px] border-b ${
                      theme === 'dark' ? 'bg-neutral-900/90 text-slate-400 border-neutral-800' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      <tr>
                        <th className="px-6 py-3.5">ID</th>
                        <th className="px-6 py-3.5">Full Name</th>
                        <th className="px-6 py-3.5">Age / Gender</th>
                        <th className="px-6 py-3.5">Blood</th>
                        <th className="px-6 py-3.5">Department</th>
                        <th className="px-6 py-3.5">Specialist Doctor</th>
                        <th className="px-6 py-3.5">Triage</th>
                        <th className="px-6 py-3.5">Status</th>
                        <th className="px-6 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-neutral-800/60">
                      {filteredRecords.map((patient) => {
                        const triageMeta = TRIAGE_LEVELS[patient.triage];
                        return (
                          <tr key={patient.id} className="transition hover:bg-slate-100/50 dark:hover:bg-neutral-800/40">
                            <td className="px-6 py-4 font-mono text-blue-600 dark:text-cyan-400 font-bold">#{patient.id}</td>
                            <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">{patient.name}</td>
                            <td className="px-6 py-4 text-slate-500">{patient.age} yrs • {patient.gender}</td>
                            <td className="px-6 py-4 font-bold text-rose-500">{patient.bloodGroup}</td>
                            <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">{patient.department}</td>
                            <td className="px-6 py-4 text-slate-500">{patient.doctor}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                theme === 'dark' ? triageMeta.badgeDark : triageMeta.badgeLight
                              }`}>
                                {triageMeta.label}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                patient.status === 'QUEUED' ? 'bg-cyan-500/20 text-cyan-500 border border-cyan-500/30' :
                                patient.status === 'SERVED' ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' :
                                'bg-slate-200 dark:bg-neutral-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-neutral-700'
                              }`}>
                                {patient.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => handleCancelPatient(patient.id)}
                                className="px-2.5 py-1 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-[11px] font-semibold border border-rose-500/20 transition flex items-center gap-1 ml-auto cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-16 text-center space-y-3">
                  <Search className="w-10 h-10 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-500">No matching patient records found.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ================================================================================= */}
        {/* TAB 4: INPATIENT WARDS (LIST & 2D BED FLOOR MAP GRID) */}
        {/* ================================================================================= */}
        {activeTab === 'wards' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* WARDS METRICS OVERVIEW BAR */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="apple-panel p-5 rounded-3xl border border-indigo-500/30 shadow-sm">
                <div className="flex items-center justify-between text-indigo-500 mb-1">
                  <span className="text-xs font-mono font-bold">Total Admitted</span>
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{admittedPatientsList.length}</div>
                <p className="text-[10px] text-slate-400 mt-1">Active ward inpatients</p>
              </div>

              <div className="apple-panel p-5 rounded-3xl border border-rose-500/30 glow-emergency">
                <div className="flex items-center justify-between text-rose-500 mb-1">
                  <span className="text-xs font-mono font-bold">ICU Beds Occupied</span>
                  <Bed className="w-4 h-4" />
                </div>
                <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">
                  {admittedPatientsList.filter(p => p.wardAdmission && p.wardAdmission.wardType === 'ICU Bed').length} / 20
                </div>
                <p className="text-[10px] text-rose-500/80 font-medium mt-1">Critical ICU allocation</p>
              </div>

              <div className="apple-panel p-5 rounded-3xl border border-blue-500/30">
                <div className="flex items-center justify-between text-blue-500 mb-1">
                  <span className="text-xs font-mono font-bold">Private Rooms</span>
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="text-3xl font-extrabold text-blue-600 dark:text-cyan-400">
                  {admittedPatientsList.filter(p => p.wardAdmission && p.wardAdmission.wardType === 'Private Room').length}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Occupied luxury suites</p>
              </div>

              <div className="apple-panel p-5 rounded-3xl border border-emerald-500/30">
                <div className="flex items-center justify-between text-emerald-500 mb-1">
                  <span className="text-xs font-mono font-bold">General Wards</span>
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {admittedPatientsList.filter(p => p.wardAdmission && (p.wardAdmission.wardType === 'General Ward' || p.wardAdmission.wardType === 'Semi-Private')).length}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Occupied general beds</p>
              </div>
            </div>

            {/* Wards Toolbar with Mode Switch (List View vs 2D Floor Plan Grid) */}
            <div className="apple-panel rounded-3xl p-6 border border-slate-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search admitted patients..."
                    value={wardSearchQuery}
                    onChange={(e) => setWardSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs focus:outline-none transition border ${
                      theme === 'dark'
                        ? 'bg-neutral-900 border-neutral-800 text-slate-100 focus:border-indigo-500'
                        : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-600'
                    }`}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    value={selectedWardFilter}
                    onChange={(e) => setSelectedWardFilter(e.target.value)}
                    className={`px-3.5 py-2.5 rounded-2xl text-xs focus:outline-none transition border ${
                      theme === 'dark'
                        ? 'bg-neutral-900 border-neutral-800 text-slate-100'
                        : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="All">All Categories</option>
                    {WARD_TYPES.map(ward => (
                      <option key={ward} value={ward}>{ward}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* View Switcher: List Table vs 2D Floor Map */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-neutral-900 rounded-2xl border border-slate-200 dark:border-neutral-800">
                <button
                  onClick={() => setWardViewMode('list')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    wardViewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-500'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  List Register
                </button>
                <button
                  onClick={() => setWardViewMode('floorplan')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    wardViewMode === 'floorplan' ? 'bg-indigo-600 text-white' : 'text-slate-500'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  2D Floor Bed Map
                </button>
              </div>

            </div>

            {/* ADMITTED PATIENTS: LIST REGISTER OR 2D FLOOR PLAN GRID */}
            {wardViewMode === 'list' ? (
              <div className="apple-panel rounded-3xl border border-slate-200 dark:border-neutral-800 overflow-hidden shadow-2xl">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-500" />
                    <span>Currently Admitted Inpatients Register</span>
                  </h3>
                  <span className="text-xs font-mono text-indigo-500 font-bold">{filteredAdmittedPatients.length} Admitted</span>
                </div>

                {filteredAdmittedPatients.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className={`uppercase font-mono text-[10px] border-b ${
                        theme === 'dark' ? 'bg-neutral-900/90 text-slate-400 border-neutral-800' : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        <tr>
                          <th className="px-6 py-3.5">ID</th>
                          <th className="px-6 py-3.5">Patient Name</th>
                          <th className="px-6 py-3.5">Age / Gender</th>
                          <th className="px-6 py-3.5">Ward Category</th>
                          <th className="px-6 py-3.5">Admission Timestamp</th>
                          <th className="px-6 py-3.5">Est. Stay</th>
                          <th className="px-6 py-3.5">Assigned Doctor</th>
                          <th className="px-6 py-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-neutral-800/60">
                        {filteredAdmittedPatients.map((patient) => (
                          <tr key={patient.id} className="transition hover:bg-slate-100/50 dark:hover:bg-neutral-800/40">
                            <td className="px-6 py-4 font-mono text-indigo-600 dark:text-indigo-400 font-bold">#{patient.id}</td>
                            <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">
                              <div>{patient.name}</div>
                              <div className="text-[10px] text-slate-400 font-normal">{patient.condition}</div>
                            </td>
                            <td className="px-6 py-4 text-slate-500">{patient.age} yrs • {patient.gender}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 w-fit ${
                                patient.wardAdmission.wardType === 'ICU Bed' 
                                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                                  : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                              }`}>
                                <Bed className="w-3 h-3" />
                                {patient.wardAdmission.wardType}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-slate-500">{patient.wardAdmission.admissionDate}</td>
                            <td className="px-6 py-4 font-mono font-bold text-emerald-500">{patient.wardAdmission.expectedStayDays} Days</td>
                            <td className="px-6 py-4 text-slate-500">{patient.doctor}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setPrintablePatient(patient)}
                                  className="px-2.5 py-1 rounded-xl bg-blue-600/10 text-blue-600 dark:text-cyan-400 text-[11px] font-bold border border-blue-500/20 transition flex items-center gap-1 cursor-pointer"
                                >
                                  <Printer className="w-3 h-3" />
                                  Slip
                                </button>
                                <button
                                  onClick={() => handleDischargeFromWard(patient.id)}
                                  className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold border border-emerald-500/20 transition flex items-center gap-1 cursor-pointer"
                                >
                                  <LogOut className="w-3 h-3" />
                                  Discharge
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-16 text-center space-y-3">
                    <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Admitted Inpatients Found</h4>
                    <p className="text-xs text-slate-500">Use "Admit to Ward / Room" in the Live Triage tab to assign inpatients to wards.</p>
                  </div>
                )}
              </div>
            ) : (
              /* 2D VISUAL BED FLOOR PLAN GRID MAP */
              <div className="space-y-6">
                
                {/* ICU BEDS GRID */}
                <div className="apple-panel rounded-3xl p-6 border border-slate-200 dark:border-neutral-800 space-y-4">
                  <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-neutral-800">
                    <h4 className="text-xs font-mono font-bold text-rose-500 flex items-center gap-2">
                      <Bed className="w-4 h-4" /> ICU Critical Care Beds Floor Plan (20 Slots)
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">Red = Occupied • Emerald = Available</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {Array.from({ length: 20 }).map((_, idx) => {
                      const bedId = `ICU-${idx + 101}`;
                      const patient = admittedPatientsList.find(p => p.wardAdmission && p.wardAdmission.wardType === 'ICU Bed' && p.id % 20 === idx % 20);
                      const isOccupied = !!patient;

                      return (
                        <div
                          key={bedId}
                          onClick={() => patient && setPrintablePatient(patient)}
                          className={`p-3.5 rounded-2xl border transition text-center cursor-pointer ${
                            isOccupied 
                              ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-300 hover:scale-105' 
                              : 'bg-slate-100/50 dark:bg-neutral-900/50 border-slate-200 dark:border-neutral-800 text-slate-400'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                            <span>{bedId}</span>
                            <span className={`w-2 h-2 rounded-full ${isOccupied ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`}></span>
                          </div>
                          {isOccupied ? (
                            <div>
                              <span className="font-bold text-xs block truncate">{patient.name}</span>
                              <span className="text-[9px] opacity-75 block">ID #{patient.id}</span>
                            </div>
                          ) : (
                            <span className="text-[10px] italic block text-slate-400">Available</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* GENERAL & PRIVATE ROOMS GRID */}
                <div className="apple-panel rounded-3xl p-6 border border-slate-200 dark:border-neutral-800 space-y-4">
                  <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-neutral-800">
                    <h4 className="text-xs font-mono font-bold text-indigo-500 flex items-center gap-2">
                      <Building2 className="w-4 h-4" /> Private Rooms & General Wards Floor Plan (20 Rooms)
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">Indigo = Occupied • Emerald = Available</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {Array.from({ length: 20 }).map((_, idx) => {
                      const roomId = `RM-${idx + 201}`;
                      const patient = admittedPatientsList.find(p => p.wardAdmission && p.wardAdmission.wardType !== 'ICU Bed' && p.id % 20 === idx % 20);
                      const isOccupied = !!patient;

                      return (
                        <div
                          key={roomId}
                          onClick={() => patient && setPrintablePatient(patient)}
                          className={`p-3.5 rounded-2xl border transition text-center cursor-pointer ${
                            isOccupied 
                              ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-300 hover:scale-105' 
                              : 'bg-slate-100/50 dark:bg-neutral-900/50 border-slate-200 dark:border-neutral-800 text-slate-400'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                            <span>{roomId}</span>
                            <span className={`w-2 h-2 rounded-full ${isOccupied ? 'bg-indigo-500' : 'bg-emerald-500'}`}></span>
                          </div>
                          {isOccupied ? (
                            <div>
                              <span className="font-bold text-xs block truncate">{patient.name}</span>
                              <span className="text-[9px] opacity-75 block">{patient.wardAdmission.wardType}</span>
                            </div>
                          ) : (
                            <span className="text-[10px] italic block text-slate-400">Available</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* ================================================================================= */}
        {/* TAB 5: CONSULTATION HISTORY LOG & PRINTABLE REPORTS */}
        {/* ================================================================================= */}
        {activeTab === 'log' && (
          <div className="space-y-6 animate-fade-in">
            <div className="apple-panel rounded-3xl border border-slate-200 dark:border-neutral-800 overflow-hidden shadow-2xl">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-500" />
                    <span>Discharged / Admitted Patients Consultation Log</span>
                  </h3>
                  <p className="text-xs text-slate-500">Historical archive of served consultations, ward admissions & clinical prescriptions</p>
                </div>
                <span className="text-xs font-mono text-emerald-500 font-bold">{servedPatientsHistory.length} Processed</span>
              </div>

              {servedPatientsHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className={`uppercase font-mono text-[10px] border-b ${
                      theme === 'dark' ? 'bg-neutral-900/90 text-slate-400 border-neutral-800' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      <tr>
                        <th className="px-6 py-3.5">ID</th>
                        <th className="px-6 py-3.5">Patient Name</th>
                        <th className="px-6 py-3.5">Age / Gender</th>
                        <th className="px-6 py-3.5">Department</th>
                        <th className="px-6 py-3.5">Consulted By</th>
                        <th className="px-6 py-3.5">Ward Admission</th>
                        <th className="px-6 py-3.5">Prescription & Clinical Notes</th>
                        <th className="px-6 py-3.5">Consulted Time</th>
                        <th className="px-6 py-3.5 text-right">Consultation Slip</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-neutral-800/60">
                      {servedPatientsHistory.map((patient) => (
                        <tr key={patient.id} className="transition hover:bg-slate-100/50 dark:hover:bg-neutral-800/40">
                          <td className="px-6 py-4 font-mono text-blue-600 dark:text-cyan-400 font-bold">#{patient.id}</td>
                          <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">{patient.name}</td>
                          <td className="px-6 py-4 text-slate-500">{patient.age} yrs • {patient.gender}</td>
                          <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">{patient.department}</td>
                          <td className="px-6 py-4 text-slate-500">{patient.doctor}</td>
                          <td className="px-6 py-4">
                            {patient.wardAdmission && patient.wardAdmission.admitted ? (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-500 border border-indigo-500/30 flex items-center gap-1 w-fit">
                                <Building2 className="w-3 h-3 text-indigo-500" />
                                {patient.wardAdmission.wardType} ({patient.wardAdmission.expectedStayDays} Days)
                              </span>
                            ) : (
                              <span className="text-slate-400 italic text-[11px]">Outpatient</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                            {patient.prescription || 'Standard discharge advice'}
                          </td>
                          <td className="px-6 py-4 font-mono text-emerald-500 font-bold">{patient.servedTime || 'Discharged'}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => setPrintablePatient(patient)}
                              className="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 dark:bg-cyan-400 dark:hover:bg-cyan-300 text-white dark:text-black text-[11px] font-bold transition flex items-center gap-1.5 ml-auto cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              Print Slip
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-16 text-center space-y-3">
                  <FileText className="w-10 h-10 text-slate-400 mx-auto" />
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">No Consultation History Yet</h4>
                  <p className="text-xs text-slate-500">Process patients from the Live Triage Queue to populate consultation logs.</p>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* ================================================================================= */}
      {/* MODAL: GLOBAL INSTANT COMMAND SEARCH PALETTE (Ctrl + K) */}
      {/* ================================================================================= */}
      {isCmdSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-start justify-center pt-20 p-4">
          <div className={`apple-panel w-full max-w-xl rounded-3xl p-6 border shadow-2xl space-y-4 ${
            theme === 'dark' ? 'border-cyan-500/40 bg-neutral-950 text-slate-100' : 'border-blue-500/40 bg-white text-slate-900'
          }`}>
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-neutral-800 pb-3">
              <Search className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search patient record by ID or Name (e.g. 101, Eleanor)..."
                value={cmdSearchQuery}
                onChange={(e) => setCmdSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm focus:outline-none font-medium"
              />
              <button
                onClick={() => setIsCmdSearchOpen(false)}
                className="px-2 py-1 rounded-lg text-xs font-mono text-slate-400 hover:text-slate-600"
              >
                ESC
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {cmdSearchResults.length > 0 ? (
                cmdSearchResults.map(patient => (
                  <div
                    key={patient.id}
                    onClick={() => {
                      setPrintablePatient(patient);
                      setIsCmdSearchOpen(false);
                    }}
                    className="p-3 rounded-2xl border border-slate-100 dark:border-neutral-900 hover:bg-slate-100 dark:hover:bg-neutral-900 transition flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-blue-600 dark:text-cyan-400">#{patient.id}</span>
                        <span className="font-bold text-xs">{patient.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          patient.status === 'QUEUED' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {patient.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{patient.department} • {patient.condition}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-500">No matching patient records found.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================================= */}
      {/* MODAL: INPATIENT WARD ADMISSION DRAWER / MODAL */}
      {/* ================================================================================= */}
      {isWardModalOpen && currentServedPatient && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`apple-panel w-full max-w-md rounded-3xl p-6 border shadow-2xl space-y-6 ${
            theme === 'dark' ? 'border-indigo-500/40 bg-neutral-950 text-slate-100' : 'border-indigo-500/40 bg-white text-slate-900'
          }`}>
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold">Inpatient Ward Admission</h3>
                  <p className="text-xs text-slate-500">Assign ward type & room allocation details</p>
                </div>
              </div>
              <button
                onClick={() => setIsWardModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-neutral-900 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200 dark:border-neutral-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmWardAdmission} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-neutral-900/80 border border-slate-200 dark:border-neutral-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Admitting Patient:</span>
                <span className="font-bold text-sm text-blue-600 dark:text-cyan-400 block">{currentServedPatient.name} (ID #{currentServedPatient.id})</span>
                <span className="text-[11px] text-slate-500 block">{currentServedPatient.condition}</span>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Ward Category / Room Type *
                </label>
                <select
                  value={wardFormData.wardType}
                  onChange={(e) => setWardFormData({ ...wardFormData, wardType: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-2xl text-xs focus:outline-none transition border ${
                    theme === 'dark'
                      ? 'bg-neutral-900 border-neutral-800 text-slate-100 focus:border-indigo-500'
                      : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-600'
                  }`}
                >
                  {WARD_TYPES.map(ward => (
                    <option key={ward} value={ward}>{ward}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Admission Date & Time Timestamp
                </label>
                <input
                  type="text"
                  value={wardFormData.admissionDate}
                  onChange={(e) => setWardFormData({ ...wardFormData, admissionDate: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-2xl text-xs font-mono focus:outline-none transition border ${
                    theme === 'dark'
                      ? 'bg-neutral-900 border-neutral-800 text-slate-100 focus:border-indigo-500'
                      : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-600'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Expected Length of Stay (in Days) *
                </label>
                <input
                  type="number"
                  placeholder="e.g. 3, 5, 7"
                  value={wardFormData.expectedStayDays}
                  onChange={(e) => setWardFormData({ ...wardFormData, expectedStayDays: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-2xl text-xs font-mono focus:outline-none transition border ${
                    theme === 'dark'
                      ? 'bg-neutral-900 border-neutral-800 text-slate-100 focus:border-indigo-500'
                      : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-600'
                  }`}
                  min="1"
                  max="60"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsWardModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm Ward Admission</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================================= */}
      {/* MODAL: C++ BACKEND DSA MAPPING ARCHITECTURE */}
      {/* ================================================================================= */}
      {isCppModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`apple-panel w-full max-w-3xl rounded-3xl p-6 border shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto ${
            theme === 'dark' ? 'border-emerald-500/40 bg-neutral-950 text-slate-100' : 'border-emerald-500/40 bg-white text-slate-900'
          }`}>
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <Code2 className="w-6 h-6 text-emerald-500 animate-pulse" />
                <div>
                  <h3 className="text-base font-extrabold">C++ DSA Backend Architecture Specification</h3>
                  <p className="text-xs text-slate-500">Data Structures & Sorting/Searching Algorithm Mapping</p>
                </div>
              </div>
              <button
                onClick={() => setIsCppModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-neutral-900 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200 dark:border-neutral-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 border border-neutral-800 space-y-2">
                <span className="text-emerald-400 font-bold block">// 1. Entity Structure Mapping (C++ Struct)</span>
                <pre className="text-[11px] overflow-x-auto text-cyan-300 font-mono">
{`struct Patient {
    int id;                       // Unique positive integer identifier
    std::string name;             // Full name
    int age;                      // Age in years
    std::string condition;        // Symptoms / Diagnosis
    TriageLevel triage;           // EMERGENCY (3), URGENT (2), NORMAL (1)
    uint64_t arrivalSequence;     // Monotonic counter for FIFO stability
    std::string registrationTime; // Entry timestamp
    bool status;                  // QUEUED / SERVED
    WardAdmission wardInfo;       // Inpatient ward allocation details
    VitalSigns vitals;            // BP, Pulse, SpO2, Body Temp
};`}
                </pre>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 border border-neutral-800 space-y-2">
                <span className="text-emerald-400 font-bold block">// 2. Priority Queue Triage Heap (O(log N) Priority Placement)</span>
                <pre className="text-[11px] overflow-x-auto text-amber-300 font-mono">
{`struct PatientPriorityComparator {
    bool operator()(const Patient& a, const Patient& b) const {
        if (a.triage != b.triage) {
            return static_cast<int>(a.triage) < static_cast<int>(b.triage); // Max-heap on Triage
        }
        return a.arrivalSequence > b.arrivalSequence; // Min-heap on arrival for FIFO stability
    }
};

std::priority_queue<Patient, std::vector<Patient>, PatientPriorityComparator> triageQueue;`}
                </pre>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 border border-neutral-800 space-y-2">
                <span className="text-emerald-400 font-bold block">// 3. Binary Search O(log N) & Sorting O(N log N)</span>
                <pre className="text-[11px] overflow-x-auto text-emerald-300 font-mono">
{`// Sorted Master Registry Vector
std::vector<Patient> masterRegistry;

// Binary Search by Patient ID
auto it = std::lower_bound(masterRegistry.begin(), masterRegistry.end(), targetID,
    [](const Patient& p, int val) { return p.id < val; });`}
                </pre>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsCppModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-bold bg-emerald-600 text-white text-xs cursor-pointer"
              >
                Close Specification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================================= */}
      {/* MODAL: PRINTABLE CONSULTATION SLIP */}
      {/* ================================================================================= */}
      {printablePatient && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 w-full max-w-lg rounded-3xl p-8 border border-slate-200 shadow-2xl space-y-6" id="printable-slip">
            
            <div className="flex justify-between items-start border-b pb-4">
              <div className="flex items-center gap-3">
                <img src="/bheeshma_logo.jpg" alt="Logo" className="w-10 h-10 object-contain rounded-lg" />
                <div>
                  <h3 className="text-xl font-extrabold text-blue-900">Bheeshma Healthcare</h3>
                  <p className="text-xs text-slate-500">Official Clinical Consultation & Prescription Slip</p>
                </div>
              </div>
              <button
                onClick={() => setPrintablePatient(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block font-mono">Patient ID:</span>
                  <span className="font-bold text-slate-900 text-sm">#{printablePatient.id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono">Discharge Timestamp:</span>
                  <span className="font-bold text-slate-900">{printablePatient.servedTime || 'Discharged'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Full Name:</span>
                  <span className="font-bold text-slate-900">{printablePatient.name}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Age / Gender:</span>
                  <span className="font-bold text-slate-900">{printablePatient.age} yrs ({printablePatient.gender})</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Blood Group:</span>
                  <span className="font-bold text-rose-600">{printablePatient.bloodGroup}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-bold text-slate-900">{printablePatient.department}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Attending Specialist:</span>
                  <span className="font-bold text-blue-600">{printablePatient.doctor}</span>
                </div>

                {printablePatient.vitals && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-500 block mb-1 font-semibold">Recorded Vital Signs:</span>
                    <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-mono">
                      <div>BP: <strong>{printablePatient.vitals.bps}/{printablePatient.vitals.bpd}</strong></div>
                      <div>Pulse: <strong>{printablePatient.vitals.pulse}</strong> bpm</div>
                      <div>SpO2: <strong>{printablePatient.vitals.spo2}%</strong></div>
                      <div>Temp: <strong>{printablePatient.vitals.temp}°F</strong></div>
                    </div>
                  </div>
                )}

                {printablePatient.wardAdmission && (
                  <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 space-y-1">
                    <span className="text-indigo-700 font-bold block flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" /> Inpatient Ward Allocation:
                    </span>
                    <p className="text-slate-800 font-medium">
                      Category: <strong>{printablePatient.wardAdmission.wardType}</strong> • Expected Stay: <strong>{printablePatient.wardAdmission.expectedStayDays} Days</strong>
                    </p>
                    <p className="text-[10px] text-slate-500">Admitted: {printablePatient.wardAdmission.admissionDate}</p>
                  </div>
                )}

                <div className="py-2">
                  <span className="text-slate-500 block mb-1 font-semibold">Primary Diagnosis:</span>
                  <p className="p-3 bg-slate-50 rounded-xl font-medium text-slate-800 border border-slate-100">{printablePatient.condition}</p>
                </div>

                <div className="py-2">
                  <span className="text-blue-600 block mb-1 font-bold flex items-center gap-1">
                    <Pencil className="w-3 h-3" /> Prescribed Treatment & Medical Notes:
                  </span>
                  <p className="p-3 bg-blue-50/60 rounded-xl font-medium text-slate-800 border border-blue-100 text-xs leading-relaxed">
                    {printablePatient.prescription || 'Standard post-consultation routine care advised.'}
                  </p>
                </div>
              </div>

              {/* Signature Line */}
              <div className="pt-6 flex justify-between items-end">
                <div className="text-[10px] text-slate-400 font-mono">
                  Bheeshma Queue OS • Authenticated
                </div>
                <div className="text-center">
                  <div className="w-32 border-b border-slate-400 mb-1"></div>
                  <span className="text-[10px] text-slate-500 font-semibold">{printablePatient.doctor} (Signature)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setPrintablePatient(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Printer className="w-4 h-4" />
                Print Slip
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================================================================================= */}
      {/* MODAL: INTERACTIVE BINARY SEARCH ALGORITHM VISUALIZER */}
      {/* ================================================================================= */}
      {isBsVisualizerOpen && bsSteps.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`apple-panel w-full max-w-3xl rounded-3xl p-6 border shadow-2xl space-y-6 ${
            theme === 'dark' ? 'border-cyan-500/40 bg-neutral-950 text-slate-100' : 'border-blue-500/40 bg-white text-slate-900'
          }`}>
            
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <Binary className="w-6 h-6 text-blue-600 dark:text-cyan-400 animate-bounce" />
                <div>
                  <h3 className="text-base font-extrabold">Binary Search Step-by-Step Visualizer</h3>
                  <p className="text-xs text-slate-500">Step {bsCurrentStepIdx + 1} of {bsSteps.length} | O(log N) Search Complexity</p>
                </div>
              </div>
              <button
                onClick={() => setIsBsVisualizerOpen(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-neutral-900 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200 dark:border-neutral-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Current Step Pointer Values */}
            {bsSteps[bsCurrentStepIdx] && (
              <div className="space-y-6">
                
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Low Pointer</span>
                    <span className="text-lg font-mono font-bold text-blue-600 dark:text-cyan-400">{bsSteps[bsCurrentStepIdx].low}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-blue-50 dark:bg-cyan-500/20 border border-blue-200 dark:border-cyan-500/40">
                    <span className="text-[10px] font-mono text-blue-600 dark:text-cyan-300 uppercase block font-bold">Mid Pointer</span>
                    <span className="text-lg font-mono font-bold text-blue-700 dark:text-cyan-300">
                      {bsSteps[bsCurrentStepIdx].mid !== -1 ? bsSteps[bsCurrentStepIdx].mid : 'N/A'}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">High Pointer</span>
                    <span className="text-lg font-mono font-bold text-blue-600 dark:text-cyan-400">{bsSteps[bsCurrentStepIdx].high}</span>
                  </div>
                </div>

                {/* Vector Array Visualization */}
                <div>
                  <span className="text-xs font-mono text-slate-500 mb-2 block">Sorted Vector Array:</span>
                  <div className="flex gap-2 overflow-x-auto py-2">
                    {bsSteps[bsCurrentStepIdx].sortedVec.map((p, idx) => {
                      const step = bsSteps[bsCurrentStepIdx];
                      const isMid = idx === step.mid;
                      const inBounds = idx >= step.low && idx <= step.high;

                      return (
                        <div
                          key={p.id}
                          className={`flex-1 min-w-[70px] p-3 rounded-2xl border text-center transition-all ${
                            isMid 
                              ? 'bg-blue-600 text-white dark:bg-cyan-400 dark:text-black font-bold shadow-lg scale-105 border-blue-600' 
                              : inBounds 
                                ? 'bg-slate-100 dark:bg-neutral-900 border-slate-300 dark:border-neutral-700 text-slate-800 dark:text-slate-200' 
                                : 'bg-slate-50 dark:bg-neutral-950 border-slate-200 dark:border-neutral-900 text-slate-400 opacity-40'
                          }`}
                        >
                          <span className="text-[9px] font-mono block opacity-75">[{idx}]</span>
                          <span className="text-xs font-mono font-bold block">#{p.id}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Explanation Log */}
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-xs font-mono text-blue-700 dark:text-cyan-300 leading-relaxed">
                  {bsSteps[bsCurrentStepIdx].explanation}
                </div>

                {/* Stepper Controls */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    disabled={bsCurrentStepIdx === 0}
                    onClick={() => setBsCurrentStepIdx(prev => prev - 1)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-neutral-900 disabled:opacity-30 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    ← Previous Step
                  </button>

                  <button
                    disabled={bsCurrentStepIdx === bsSteps.length - 1}
                    onClick={() => setBsCurrentStepIdx(prev => prev + 1)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 dark:bg-cyan-400 dark:hover:bg-cyan-300 disabled:opacity-30 text-white dark:text-black transition cursor-pointer"
                  >
                    Next Step →
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
