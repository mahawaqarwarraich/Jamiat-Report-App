import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Toast from './Toast';

const QASection = () => {
  const [currentReport, setCurrentReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [qaData, setQaData] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '', q9: '',
    q10: '', q11: '', q12: '', q13: '', q14: '', q15: '', q16: '', q17: '', q18: '', q19: '',
    q20: '', q21: '', q22: '', q23: '', q24: '', q25: '', q26: '', q27: '', q28: ''
  });

  // Helper function to show toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Helper function to hide toast
  const hideToast = () => {
    setToast(null);
  };

  const questions = [
    {
      id: 'q1',
      question: 'Agr koi namaz qaza hui to kis waqt ki aur kyun?',
      placeholder: 'اگر کوئی نماز قضا ہوئی تو کس وقت کی اور کیوں؟'
    },
    {
      id: 'q2',
      question: 'Mutaleya tafseer-o-hadees sy liye gaye eham asool aur us pr amal daramad ki surat-e-haal?',
      placeholder: 'مطالعہ تفسیر و حدیث سے لیے گئے اہم اصول اور اس پر عمل درآمد کی صورت حال؟'
    },
    {
      id: 'q3',
      question: 'Mutaleya shuda(surat, kitaab, hadees, literature) ka naam?(mukamal/jari)',
      placeholder: 'مطالعہ شدہ (سورت، کتاب، حدیث، لٹریچر) کا نام؟ (مکمل/جاری)'
    },
    {
      id: 'q4',
      question: 'Hifz shuda surat, hadees, dua?',
      placeholder: 'حفظ شدہ سورت، حدیث، دعا؟'
    },
    {
      id: 'q5',
      question: 'Konsi ikhlaaqi khoobi apnaaney ya burai chorny ki koshish rhi?',
      placeholder: 'کونسی اخلاقی خوبی اپنانے یا برائی چھوڑنے کی کوشش رہی؟'
    },
    {
      id: 'q6',
      question: 'Khandaan, hamsaya, degar mutalakeen k saath husn mamla, khidmat, ayadat, tauhfa waghera ki kya koshishein rhin?',
      placeholder: 'خاندان، ہمسایہ، دگر متعلقین کے ساتھ حسن معاملہ، خدمت، اعانت، تحفہ وغیرہ کی کیا کوششیں رہیں؟'
    },
    {
      id: 'q7',
      question: 'Tadaad mutaiyan afraad?',
      placeholder: 'تعداد متعین افراد؟'
    },
    {
      id: 'q8',
      question: 'Izafa mutaiyan afraad?',
      placeholder: 'اضافہ متعین افراد؟'
    },
    {
      id: 'q9',
      question: 'Kitny mutaiyan afraad sy raabta rha?',
      placeholder: 'کتنے متعین افراد سے رابطہ رہا؟'
    },
    {
      id: 'q10',
      question: 'Mutaiyan afraad k saath ki gai sirgarmiyaan?',
      placeholder: 'متعین افراد کے ساتھ کی گئی سرگرمیاں؟'
    },
    {
      id: 'q11',
      question: 'Kya apka halka dars qaim hai?',
      placeholder: 'کیا آپ کا حلقہ درس قائم ہے؟'
    },
    {
      id: 'q12',
      question: 'Dawati halky main ki gai sirgarmiyaan?(sisilawar dars quran/qurani class/degar)',
      placeholder: 'دعوتی حلقے میں کی گئی سرگرمیاں؟ (سلسلہ وار درس قرآن/قرآنی کلاس/دگر)'
    },
    {
      id: 'q13',
      question: 'Kitny hami banaye?',
      placeholder: 'کتنے حامی بنائے؟'
    },
    {
      id: 'q14',
      question: 'Kitny afraad ko islam ki bunyadi baatein sikhai?',
      placeholder: 'کتنے افراد کو اسلام کی بنیادی باتیں سکھائی؟'
    },
    {
      id: 'q15',
      question: 'Ijtemai mutaly(tadaad)?',
      placeholder: 'اجتماعی مطالعہ (تعداد)؟'
    },
    {
      id: 'q16',
      question: 'Group discusssions(tadaad)?',
      placeholder: 'گروپ ڈسکشنز (تعداد)؟'
    },
    {
      id: 'q17',
      question: 'Hadiya kutab(tadaad)?',
      placeholder: 'ہدیہ کتب (تعداد)؟'
    },
    {
      id: 'q18',
      question: 'Library sy parhwain(tadaad)?',
      placeholder: 'لائبریری سے پڑھائیں (تعداد)؟'
    },
    {
      id: 'q19',
      question: 'Kya mtutalka ijtemaat main shirkat ki?',
      placeholder: 'کیا متعلقہ اجتماعات میں شرکت کی؟'
    },
    {
      id: 'q20',
      question: 'Shirkat na krny ki wajah?',
      placeholder: 'شرکت نہ کرنے کی وجہ؟'
    },
    {
      id: 'q21',
      question: 'Apni anat di?',
      placeholder: 'اپنی انفاق دی؟'
    },
    {
      id: 'q22',
      question: 'Doosron sy kitni jama ki?',
      placeholder: 'دوسروں سے کتنی جمع کی؟'
    },
    {
      id: 'q23',
      question: 'Kya nisaab main milny waaly kaam kiye?',
      placeholder: 'کیا نصاب میں ملنے والے کام کیے؟'
    },
    {
      id: 'q24',
      question: 'Zer-e-tarbiyat afraad k liye kya koshishein rhi?',
      placeholder: 'زیر تربیت افراد کے لیے کیا کوششیں رہیں؟'
    },
    {
      id: 'q25',
      question: 'Degar koi baat/kaam/masla/mashwara/muhsiba?',
      placeholder: 'دگر کوئی بات/کام/مسئلہ/مشورہ/محاسبہ؟'
    },
    {
      id: 'q26',
      question: 'Kya report barwaqt arsaal kr rhi hein?',
      placeholder: 'کیا رپورٹ بروقت ارسال کر رہی ہیں؟'
    },
    {
      id: 'q27',
      question: 'Agr berwaqt arsaal nahi kr rhi to wajah?',
      placeholder: 'اگر بروقت ارسال نہیں کر رہی تو وجہ؟'
    },
    {
      id: 'q28',
      question: 'Arsaal krdah khatoot nazma shehr/rafiqaat/karkunaan?',
      placeholder: 'ارسال کردہ خطوط نظم شہر/رفیقات/کارکنان؟'
    }
  ];

  useEffect(() => {
    fetchCurrentReport();
  }, []);

  const fetchCurrentReport = async () => {
    try {
      const response = await axios.get('/reports/current');
      setCurrentReport(response.data);
      
      // Load existing Q&A data
      if (response.data.qa) {
        setQaData(response.data.qa);
      }
    } catch (error) {
      console.error('Error fetching current report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setQaData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      // Get current month and year
      const currentDate = new Date();
      const currentMonth = currentDate.toLocaleString('en-US', { month: 'long' });
      const currentYear = currentDate.getFullYear().toString();

      const requestData = {
        month: currentMonth,
        year: currentYear,
        answers: qaData
      };

      console.log('Saving Q&A responses:', requestData);
      
      const response = await axios.post('/reports/add-answers', requestData);
      
      if (response.data.success) {
        setCurrentReport(response.data.report);
        showToast('Q&A responses saved successfully!');
        
        // Clear toast after 3 seconds
        setTimeout(() => hideToast(), 3000);
      } else {
        showToast('Failed to save Q&A responses', 'error');
      }
    } catch (error) {
      console.error('Error saving Q&A responses:', error);
      showToast(error.response?.data?.message || 'Error saving Q&A responses. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const getCurrentMonthName = () => {
    if (!currentReport) return '';
    return `${currentReport.month} ${currentReport.year}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Monthly Q&A</h1>
        <p className="text-gray-600">
          Reflect on your spiritual journey for {getCurrentMonthName()}
        </p>
      </div>

      {/* Q&A Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-8">
          {questions.map((q, index) => (
            <div key={q.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <label className="block text-lg font-medium text-gray-900 mb-3">
                Question {index + 1}: {q.question}
              </label>
              <textarea
                value={qaData[q.id] || ''}
                onChange={(e) => handleInputChange(q.id, e.target.value)}
                placeholder={q.placeholder}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-vertical"
              />
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Q&A Responses'}
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Tips for Reflection</h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            Take time to reflect deeply on each question
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            Be honest about your challenges and achievements
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            Set specific, achievable goals for improvement
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            Consider how your actions impact your spiritual growth
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            Think about ways to help others in their religious journey
          </li>
        </ul>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
};

export default QASection; 