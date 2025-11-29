import React from 'react';

const HamiQA = ({ qaData, handleInputChange }) => {
  const questions = [
    {
      id: 'Kya koi namaz qaza hui?(agr haan to kis waqt ki aur kyun)',
      question: 'Kya koi namaz qaza hui?(agr haan to kis waqt ki aur kyun)',
      placeholder: 'کیا کوئی نماز قضا ہوئی؟ (اگر ہاں تو کس وقت کی اور کیوں)'
    },
    {
      id: 'Dauran namaz tarjuma pr ghor kiya?',
      question: 'Dauran namaz tarjuma pr ghor kiya?',
      placeholder: 'دوران نماز ترجمہ پر غور کیا؟'
    },
    {
      id: 'Hifz shuda suraton k naam?',
      question: 'Hifz shuda suraton k naam?',
      placeholder: 'حفظ شدہ سورتوں کے نام؟'
    },
    {
      id: 'Dua?',
      question: 'Dua?',
      placeholder: 'دعا؟'
    },
    {
      id: 'Hadees?',
      question: 'Hadees?',
      placeholder: 'حدیث؟'
    },
    {
      id: 'Mutaleya shuda surat(tafseer k saath)?',
      question: 'Mutaleya shuda surat(tafseer k saath)?',
      placeholder: 'مطالعہ شدہ سورت (تفسیر کے ساتھ)؟'
    },
    {
      id: 'Kitaat hadees?',
      question: 'Kitaat hadees?',
      placeholder: 'کتاب حدیث؟'
    },
    {
      id: 'Mutaleya shuda literature?(kitaab ka naam)',
      question: 'Mutaleya shuda literature?(kitaab ka naam)',
      placeholder: 'مطالعہ شدہ لٹریچر؟ (کتاب کا نام)'
    },
    {
      id: 'Mutaleya sy liye gaye eham asool?',
      question: 'Mutaleya sy liye gaye eham asool?',
      placeholder: 'مطالعہ سے لیے گئے اہم اصول؟'
    },
    {
      id: 'Amal ki kitni koshish rhi?',
      question: 'Amal ki kitni koshish rhi?',
      placeholder: 'عمل کی کتنی کوشش رہی؟'
    },
    {
      id: 'Darsi kutab ko rozana kitna waqt diya? Apni perhai ko rozana kitna waqt diya?',
      question: 'Darsi kutab ko rozana kitna waqt diya? Apni perhai ko rozana kitna waqt diya?',
      placeholder: 'درسی کتب کو روزانہ کتنا وقت دیا؟ اپنی پڑھائی کو روزانہ کتنا وقت دیا؟'
    },
    {
      id: 'Quran o hadees circle? (tadaad)',
      question: 'Quran o hadees circle? (tadaad)',
      placeholder: 'قرآن و حدیث سرکل؟ (تعداد)'
    },
    {
      id: 'Group discussions? (tadaad)',
      question: 'Group discussions? (tadaad)',
      placeholder: 'گروپ ڈسکشنز؟ (تعداد)'
    },
    {
      id: 'Itemai mutaleya? (tadaad)',
      question: 'Itemai mutaleya? (tadaad)',
      placeholder: 'اجتماعی مطالعہ؟ (تعداد)'
    },
    {
      id: 'Pamphalet o dawati masnuaat ki takseem? (tadaad)',
      question: 'Pamphalet o dawati masnuaat ki takseem? (tadaad)',
      placeholder: 'پمفلٹ و دعوتی مصنوعات کی تقسیم؟ (تعداد)'
    },
    {
      id: 'Tadaad mutaiyan afraad? (apki wo dostein jin ki islah k liye ap koshish krti hein)',
      question: 'Tadaad mutaiyan afraad? (apki wo dostein jin ki islah k liye ap koshish krti hein)',
      placeholder: 'تعداد متعین افراد؟ (آپ کی وہ دوستوں جن کی اصلاح کے لیے آپ کوشش کرتی ہیں)'
    },
    {
      id: 'Is maah izafa mutaiyan afraad?',
      question: 'Is maah izafa mutaiyan afraad?',
      placeholder: 'اس ماہ اضافہ متعین افراد؟'
    },
    {
      id: 'Is maah mutaiyan afraad k saath ki gai sargarmiyaan?',
      question: 'Is maah mutaiyan afraad k saath ki gai sargarmiyaan?',
      placeholder: 'اس ماہ متعین افراد کے ساتھ کی گئی سرگرمیاں؟'
    },
    {
      id: 'Is maah karkunaan sy kitni mulakaatein ki?',
      question: 'Is maah karkunaan sy kitni mulakaatein ki?',
      placeholder: 'اس ماہ کارکنان سے کتنی ملاقاتیں کی؟'
    },
    {
      id: 'Is maah kitny khatoot likhy?',
      question: 'Is maah kitny khatoot likhy?',
      placeholder: 'اس ماہ کتنے خطوط لکھے؟'
    },
    {
      id: 'Khandaan, hamsaya aur degar mutalakeen  main dawat pohanchaany aur husn mamla ki kya koshishein rhin?',
      question: 'Khandaan, hamsaya aur degar mutalakeen  main dawat pohanchaany aur husn mamla ki kya koshishein rhin?',
      placeholder: 'خاندان، ہمسایہ اور دگر متعلقین میں دعوت پہنچانے اور حسن معاملہ کی کیا کوششیں رہیں؟'
    },
    {
      id: 'Kya mutaliqa ijtemaat main shirkat ki?',
      question: 'Kya mutaliqa ijtemaat main shirkat ki?',
      placeholder: 'کیا متعلقہ اجتماعات میں شرکت کی؟'
    },
    {
      id: 'Nhi to wajah?',
      question: 'Nhi to wajah?',
      placeholder: 'نہیں تو وجہ؟'
    },
    {
      id: 'Ijtemaat main shirkat sy faida mehsoos hua?',
      question: 'Ijtemaat main shirkat sy faida mehsoos hua?',
      placeholder: 'اجتماعات میں شرکت سے فائدہ محسوس ہوا؟'
    },
    {
      id: 'Nisaab main milny waaly kaam kiye?',
      question: 'Nisaab main milny waaly kaam kiye?',
      placeholder: 'نصاب میں ملنے والے کام کیے؟'
    },
    {
      id: 'Nhi to wajah?',
      question: 'Nhi to wajah?',
      placeholder: 'نہیں تو وجہ؟'
    },
    {
      id: 'Report berwaqt arsaal kr rhi hein?',
      question: 'Report berwaqt arsaal kr rhi hein?',
      placeholder: 'رپورٹ بروقت ارسال کر رہی ہیں؟'
    },
    {
      id: 'Nhi to wajah?',
      question: 'Nhi to wajah?',
      placeholder: 'نہیں تو وجہ؟'
    },
    {
      id: 'Infaaq fi sabilillah k liye kya koshishein rhin?',
      question: 'Infaaq fi sabilillah k liye kya koshishein rhin?',
      placeholder: 'انفاق فی سبیل اللہ کے لیے کیا کوششیں رہیں؟'
    },
    {
      id: 'Zubaan ki hifazat aur fehash goi sy bachany ki kya koshish',
      question: 'Zubaan ki hifazat aur fehash goi sy bachany ki kya koshish',
      placeholder: 'زبان کی حفاظت اور فحش گوئی سے بچنے کی کیا کوشش'
    },
    {
      id: 'Koi khaas baat, mushkil, mashwara o muhasiba?',
      question: 'Koi khaas baat, mushkil, mashwara o muhasiba?',
      placeholder: 'کوئی خاص بات، مشکل، مشورہ و محاسبہ؟'
    },
    {
      id: 'Tareekh arsaal krda?',
      question: 'Tareekh arsaal krda?',
      placeholder: 'تاریخ ارسال کردہ؟'
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

export default HamiQA;

