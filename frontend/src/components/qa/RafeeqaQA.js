import React from 'react';

const RafeeqaQA = ({ qaData, handleInputChange }) => {
  const questions = [
    {
      id: 'Agr koi namaz qaza hui to kis waqt ki aur kyun?',
      question: 'Agr koi namaz qaza hui to kis waqt ki aur kyun?',
      placeholder: 'اگر کوئی نماز قضا ہوئی تو کس وقت کی اور کیوں؟'
    },
    {
      id: 'Mutaleya tafseer-o-hadees sy liye gaye eham asool aur us pr amal daramad ki surat-e-haal?',
      question: 'Mutaleya tafseer-o-hadees sy liye gaye eham asool aur us pr amal daramad ki surat-e-haal?',
      placeholder: 'مطالعہ تفسیر و حدیث سے لیے گئے اہم اصول اور اس پر عمل درآمد کی صورت حال؟'
    },
    {
      id: 'Mutaleya shuda(surat, kitaab, hadees, literature) ka naam?(mukamal/jari)',
      question: 'Mutaleya shuda(surat, kitaab, hadees, literature) ka naam?(mukamal/jari)',
      placeholder: 'مطالعہ شدہ (سورت، کتاب، حدیث، لٹریچر) کا نام؟ (مکمل/جاری)'
    },
    {
      id: 'Hifz shuda surat, hadees, dua?',
      question: 'Hifz shuda surat, hadees, dua?',
      placeholder: 'حفظ شدہ سورت، حدیث، دعا؟'
    },
    {
      id: 'Konsi ikhlaaqi khoobi apnaaney ya burai chorny ki koshish rhi?',
      question: 'Konsi ikhlaaqi khoobi apnaaney ya burai chorny ki koshish rhi?',
      placeholder: 'کونسی اخلاقی خوبی اپنانے یا برائی چھوڑنے کی کوشش رہی؟'
    },
    {
      id: 'Khandaan, hamsaya, degar mutalakeen k saath husn mamla, khidmat, ayadat, tauhfa waghera ki kya koshishein rhin?',
      question: 'Khandaan, hamsaya, degar mutalakeen k saath husn mamla, khidmat, ayadat, tauhfa waghera ki kya koshishein rhin?',
      placeholder: 'خاندان، ہمسایہ، دگر متعلقین کے ساتھ حسن معاملہ، خدمت، اعانت، تحفہ وغیرہ کی کیا کوششیں رہیں؟'
    },
    {
      id: 'Tadaad mutaiyan afraad?',
      question: 'Tadaad mutaiyan afraad?',
      placeholder: 'تعداد متعین افراد؟'
    },
    {
      id: 'Izafa mutaiyan afraad?',
      question: 'Izafa mutaiyan afraad?',
      placeholder: 'اضافہ متعین افراد؟'
    },
    {
      id: 'Kitny mutaiyan afraad sy raabta rha?',
      question: 'Kitny mutaiyan afraad sy raabta rha?',
      placeholder: 'کتنے متعین افراد سے رابطہ رہا؟'
    },
    {
      id: 'Mutaiyan afraad k saath ki gai sirgarmiyaan?',
      question: 'Mutaiyan afraad k saath ki gai sirgarmiyaan?',
      placeholder: 'متعین افراد کے ساتھ کی گئی سرگرمیاں؟'
    },
    {
      id: 'Kya apka halka dars qaim hai?',
      question: 'Kya apka halka dars qaim hai?',
      placeholder: 'کیا آپ کا حلقہ درس قائم ہے؟'
    },
    {
      id: 'Dawati halky main ki gai sirgarmiyaan?(sisilawar dars quran/qurani class/degar)',
      question: 'Dawati halky main ki gai sirgarmiyaan?(sisilawar dars quran/qurani class/degar)',
      placeholder: 'دعوتی حلقے میں کی گئی سرگرمیاں؟ (سلسلہ وار درس قرآن/قرآنی کلاس/دگر)'
    },
    {
      id: 'Kitny hami banaye?',
      question: 'Kitny hami banaye?',
      placeholder: 'کتنے حامی بنائے؟'
    },
    {
      id: 'Kitny afraad ko islam ki bunyadi baatein sikhai?',
      question: 'Kitny afraad ko islam ki bunyadi baatein sikhai?',
      placeholder: 'کتنے افراد کو اسلام کی بنیادی باتیں سکھائی؟'
    },
    {
      id: 'Ijtemai mutaly(tadaad)?',
      question: 'Ijtemai mutaly(tadaad)?',
      placeholder: 'اجتماعی مطالعہ (تعداد)؟'
    },
    {
      id: 'Group discusssions(tadaad)?',
      question: 'Group discusssions(tadaad)?',
      placeholder: 'گروپ ڈسکشنز (تعداد)؟'
    },
    {
      id: 'Hadiya kutab(tadaad)?',
      question: 'Hadiya kutab(tadaad)?',
      placeholder: 'ہدیہ کتب (تعداد)؟'
    },
    {
      id: 'Library sy parhwain(tadaad)?',
      question: 'Library sy parhwain(tadaad)?',
      placeholder: 'لائبریری سے پڑھائیں (تعداد)؟'
    },
    {
      id: 'Kya mtutalka ijtemaat main shirkat ki?',
      question: 'Kya mtutalka ijtemaat main shirkat ki?',
      placeholder: 'کیا متعلقہ اجتماعات میں شرکت کی؟'
    },
    {
      id: 'Shirkat na krny ki wajah?',
      question: 'Shirkat na krny ki wajah?',
      placeholder: 'شرکت نہ کرنے کی وجہ؟'
    },
    {
      id: 'Apni anat di?',
      question: 'Apni anat di?',
      placeholder: 'اپنی انفاق دی؟'
    },
    {
      id: 'Doosron sy kitni jama ki?',
      question: 'Doosron sy kitni jama ki?',
      placeholder: 'دوسروں سے کتنی جمع کی؟'
    },
    {
      id: 'Kya nisaab main milny waaly kaam kiye?',
      question: 'Kya nisaab main milny waaly kaam kiye?',
      placeholder: 'کیا نصاب میں ملنے والے کام کیے؟'
    },
    {
      id: 'Zer-e-tarbiyat afraad k liye kya koshishein rhi?',
      question: 'Zer-e-tarbiyat afraad k liye kya koshishein rhi?',
      placeholder: 'زیر تربیت افراد کے لیے کیا کوششیں رہیں؟'
    },
    {
      id: 'Degar koi baat/kaam/masla/mashwara/muhsiba?',
      question: 'Degar koi baat/kaam/masla/mashwara/muhsiba?',
      placeholder: 'دگر کوئی بات/کام/مسئلہ/مشورہ/محاسبہ؟'
    },
    {
      id: 'Kya report barwaqt arsaal kr rhi hein?',
      question: 'Kya report barwaqt arsaal kr rhi hein?',
      placeholder: 'کیا رپورٹ بروقت ارسال کر رہی ہیں؟'
    },
    {
      id: 'Agr berwaqt arsaal nahi kr rhi to wajah?',
      question: 'Agr berwaqt arsaal nahi kr rhi to wajah?',
      placeholder: 'اگر بروقت ارسال نہیں کر رہی تو وجہ؟'
    },
    {
      id: 'Arsaal krdah khatoot nazma shehr/rafiqaat/karkunaan?',
      question: 'Arsaal krdah khatoot nazma shehr/rafiqaat/karkunaan?',
      placeholder: 'ارسال کردہ خطوط نظم شہر/رفیقات/کارکنان؟'
    }
  ];

  return (
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
  );
};

export default RafeeqaQA;

