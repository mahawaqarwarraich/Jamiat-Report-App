import React from 'react';

const UmeedwarQA = ({ qaData, handleInputChange }) => {
  const questions = [
    {
      id: 'Tajweed ya lafzi tarjuma/arabi seekhny ki kya koshishein ki',
      question: 'Tajweed ya lafzi tarjuma/arabi seekhny ki kya koshishein ki',
      placeholder: 'تجوید یا لفظی ترجمہ/عربی سیکھنے کی کیا کوششیں کی'
    },
    {
      id: 'Kya dauran mutaleya notes leny ka ehtamaam rha?',
      question: 'Kya dauran mutaleya notes leny ka ehtamaam rha?',
      placeholder: 'کیا دوران مطالعہ نوٹس لینے کا اہتمام رہا؟'
    },
    {
      id: 'Mutaleya sy liye gaye eham asool?',
      question: 'Mutaleya sy liye gaye eham asool?',
      placeholder: 'مطالعہ سے لیے گئے اہم اصول؟'
    },
    {
      id: 'Dauran maah konsi ikhlaaqi khoobi apnaaney ya burai chorny ki koshish rhi?',
      question: 'Dauran maah konsi ikhlaaqi khoobi apnaaney ya burai chorny ki koshish rhi?',
      placeholder: 'دوران ماہ کونسی اخلاقی خوبی اپنانے یا برائی چھوڑنے کی کوشش رہی؟'
    },
    {
      id: 'Ghr, khandaan, hamsaya, degar mutalakeen k saath husn mamla, khidmat, ayadat, tauhfa waghera ki kya koshishein rhin?',
      question: 'Ghr, khandaan, hamsaya, degar mutalakeen k saath husn mamla, khidmat, ayadat, tauhfa waghera ki kya koshishein rhin?',
      placeholder: 'گھر، خاندان، ہمسایہ، دگر متعلقین کے ساتھ حسن معاملہ، خدمت، اعانت، تحفہ وغیرہ کی کیا کوششیں رہیں؟'
    },
    {
      id: 'Kya gharelu nazm berkaraar rakhny main apna kirdaar ada kiya?',
      question: 'Kya gharelu nazm berkaraar rakhny main apna kirdaar ada kiya?',
      placeholder: 'کیا گھریلو نظم برقرار رکھنے میں اپنا کردار ادا کیا؟'
    },
    {
      id: 'kya rozana apna muhasiba krti rahin?',
      question: 'kya rozana apna muhasiba krti rahin?',
      placeholder: 'کیا روزانہ اپنا محاسبہ کرتی رہیں؟'
    },
    {
      id: 'Kya mutaliqa ijtemaat main shirkat ki? Nhi ki to wajah?',
      question: 'Kya mutaliqa ijtemaat main shirkat ki? Nhi ki to wajah?',
      placeholder: 'کیا متعلقہ اجتماعات میں شرکت کی؟ نہیں کی تو وجہ؟'
    },
    {
      id: 'Kya markaz, sooba, makaam, division, ki taraf sy milny waaly kaam kiye? Nhi to wajah?',
      question: 'Kya markaz, sooba, makaam, division, ki taraf sy milny waaly kaam kiye? Nhi to wajah?',
      placeholder: 'کیا مرکز، صوبہ، مقام، ڈویژن، کی طرف سے ملنے والے کام کیے؟ نہیں تو وجہ؟'
    },
    {
      id: 'Kya ghr, zimadaraan main muhasiba o mushawarat ki faza rhi?',
      question: 'Kya ghr, zimadaraan main muhasiba o mushawarat ki faza rhi?',
      placeholder: 'کیا گھر، ذمہ داران میں محاسبہ و مشاورت کی فضا رہی؟'
    },
    {
      id: 'Apny oper ayed kardah aanat ada kr di?',
      question: 'Apny oper ayed kardah aanat ada kr di?',
      placeholder: 'اپنے اوپر عائد کردہ انفاق ادا کر دی؟'
    },
    {
      id: 'Kya rozana jaiza pur krti rahin?',
      question: 'Kya rozana jaiza pur krti rahin?',
      placeholder: 'کیا روزانہ جائزہ پور کرتی رہیں؟'
    },
    {
      id: 'Degar koi baat/kaam/masla/mashwara/muhsiba?',
      question: 'Degar koi baat/kaam/masla/mashwara/muhsiba?',
      placeholder: 'دگر کوئی بات/کام/مسئلہ/مشورہ/محاسبہ؟'
    },
    {
      id: 'Kya report barwaqt arsaal kr rhi hein? Nhi to wajah?',
      question: 'Kya report barwaqt arsaal kr rhi hein? Nhi to wajah?',
      placeholder: 'کیا رپورٹ بروقت ارسال کر رہی ہیں؟ نہیں تو وجہ؟'
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

export default UmeedwarQA;

