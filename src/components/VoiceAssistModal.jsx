import React, { useState } from 'react';
import { X, Volume2, Mic, Sparkles, ShieldCheck, CheckCircle2, Play, Square } from 'lucide-react';

export default function VoiceAssistModal({ isOpen, onClose, currentLang = 'kn', farmerName = 'Ramesh Gowda' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoiceLang, setSelectedVoiceLang] = useState(currentLang || 'kn');

  if (!isOpen) return null;

  const audioScripts = {
    kn: {
      langLabel: "ಕನ್ನಡ (Kannada)",
      title: "ನಮಸ್ಕಾರ ರಮೇಶ್ ಗೌಡರೇ!",
      message: "ನಿಮ್ಮ 300 ಕೆಜಿ ಟೊಮೆಟೊ ಬೆಳೆಗೆ ಗ್ರ್ಯಾಂಡ್ ಹಯಾತ್ ಹೋಟೆಲ್‌ನಿಂದ ಪ್ರತಿ ಕೆಜಿಗೆ 28 ರೂಪಾಯಿ ಖರೀದಿ ದರ ನಿಗದಿಯಾಗಿದೆ. ಎಲ್ಲಾ ಕಟಾವು ಮತ್ತು ಸಾಗಾಣಿಕೆ ವೆಚ್ಚ ಕಳೆದು ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಪ್ರತಿ ಕೆಜಿಗೆ 22 ರೂಪಾಯಿ 16 ಪೈಸೆ ನೇರವಾಗಿ ಜಮೆಯಾಗುತ್ತದೆ. ನಿಮ್ಮ ಬೆಳೆ ವೆಚ್ಚ ಮತ್ತು ಲಾಭವನ್ನು ಎಂಎನ್‌ಆರ್ ಶೀಲ್ಡ್ ಸಂಪೂರ್ಣವಾಗಿ ರಕ್ಷಿಸಿದೆ.",
      audioStatus: "ಧ್ವನಿ ವಿವರಣೆ ಸಿದ್ಧವಾಗಿದೆ"
    },
    hi: {
      langLabel: "हिन्दी (Hindi)",
      title: "नमस्ते रमेश गौड़ा जी!",
      message: "आपकी 300 किलोग्राम टमाटर की फसल के लिए ग्रैंड हयात होटल से ₹28 प्रति किलो का खरीदार मिल गया है। सभी खर्च कटने के बाद आपके बैंक खाते में शुद्ध ₹22.16 प्रति किलो सीधे प्राप्त होंगे। आपकी खेती लागत और मुनाफा एमएनआर सुरक्षा द्वारा पूरी तरह सुरक्षित है।",
      audioStatus: "ऑडियो विवरण तैयार है"
    },
    en: {
      langLabel: "English",
      title: "Hello Ramesh Gowda!",
      message: "An institutional match from Grand Hyatt Regency has been secured for your 300 kg Tomato harvest at ₹28.00/kg. After all standard FPO collection and grading deductions, your expected net realization is ₹22.16/kg. Your cultivation cost and 20% margin are 100% protected under the MNR Shield.",
      audioStatus: "Audio briefing generated"
    },
    ta: {
      langLabel: "தமிழ் (Tamil)",
      title: "வணக்கம் ரமேஷ் கவுடா!",
      message: "உங்கள் 300 கிலோ தக்காளி பயிருக்கு கிராண்ட் ஹயாத் ஹோட்டலில் இருந்து ₹28.00/கிலோ கொள்முதல் விலை கிடைத்துள்ளது. அனைத்து செலவுகளும் போக உங்கள் வங்கி கணக்கில் ₹22.16/கிலோ நேரடியாக வந்து சேரும். உங்கள் லாபம் முழுமையாக பாதுகாக்கப்பட்டுள்ளது.",
      audioStatus: "குரல் விளக்கம் தயாராக உள்ளது"
    },
    te: {
      langLabel: "తెలుగు (Telugu)",
      title: "నమస్కారం రమేష్ గౌడ గారు!",
      message: "మీ 300 కేజీల టమోటా పంటకు గ్రాండ్ హయత్ హోటల్ నుండి ₹28.00/కేజీ ధరకు కొనుగోలుదారు కుదిరారు. అన్ని ఖర్చులు పోను మీ బ్యాంకు ఖాతాకు ₹22.16/కేజీ నేరుగా జమ అవుతుంది. మీ పంట వ్యయం మరియు లాభం పూర్తిగా సురక్షితం.",
      audioStatus: "వాయిస్ బ్రీఫింగ్ సిద్ధంగా ఉంది"
    }
  };

  const currentScript = audioScripts[selectedVoiceLang] || audioScripts.en;

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (isPlaying) {
        setIsPlaying(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(currentScript.message);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      
      const langCodes = { kn: 'kn-IN', hi: 'hi-IN', en: 'en-US', ta: 'ta-IN', te: 'te-IN' };
      utterance.lang = langCodes[selectedVoiceLang] || 'en-US';

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 4000);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ border: '2px solid var(--emerald-500)', boxShadow: 'var(--shadow-glow-emerald)' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--emerald-500), var(--emerald-700))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <Volume2 size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px' }}>AI Vernacular Farmer Voice Assistant</h3>
              <p style={{ fontSize: '12px', color: 'var(--emerald-300)' }}>
                Audio narration tailored for farmers with limited digital literacy
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={() => { window.speechSynthesis?.cancel(); onClose(); }}>
            <X size={18} />
          </button>
        </div>

        {/* Language Selection Tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '18px', overflowX: 'auto', paddingBottom: '4px' }}>
          {Object.entries(audioScripts).map(([code, script]) => (
            <button
              key={code}
              className={`role-tab-btn ${selectedVoiceLang === code ? 'active' : ''}`}
              style={{ fontSize: '13px', padding: '6px 14px' }}
              onClick={() => {
                window.speechSynthesis?.cancel();
                setIsPlaying(false);
                setSelectedVoiceLang(code);
              }}
            >
              {script.langLabel}
            </button>
          ))}
        </div>

        {/* Voice Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-emerald)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: isPlaying ? 'linear-gradient(135deg, #10b981, #047857)' : 'rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isPlaying ? '#fff' : 'var(--emerald-400)',
            margin: '0 auto 16px auto',
            boxShadow: isPlaying ? '0 0 30px rgba(16, 185, 129, 0.6)' : 'none',
            transition: 'all 0.3s ease'
          }}>
            <Mic size={32} />
          </div>

          <h4 style={{ fontSize: '18px', marginBottom: '8px', color: '#fff' }}>
            {currentScript.title}
          </h4>

          <p style={{ fontSize: '15px', color: 'var(--slate-200)', lineHeight: '1.6', marginBottom: '20px', textAlign: 'left', background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            "{currentScript.message}"
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button 
              className={`btn ${isPlaying ? 'btn-amber' : 'btn-primary'} btn-lg pulse-glow`}
              onClick={handleSpeak}
            >
              {isPlaying ? (
                <>
                  <Square size={18} />
                  <span>Pause Audio</span>
                </>
              ) : (
                <>
                  <Play size={18} />
                  <span>Listen in {currentScript.langLabel.split(' ')[0]}</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--slate-400)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} style={{ color: 'var(--emerald-400)' }} />
            <span>Real-time Web Speech Synthesis</span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => { window.speechSynthesis?.cancel(); onClose(); }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
