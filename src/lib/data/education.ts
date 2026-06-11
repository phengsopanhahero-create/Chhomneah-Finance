import type { EducationTopicRow, QuizQuestionRow } from "@/types/database";

/**
 * Static fallback education topics, mirrored from supabase/seed.sql.
 * Used when Supabase is not configured or the query fails.
 */
export const FALLBACK_EDUCATION_TOPICS: EducationTopicRow[] = [
  {
    id: "topic-1",
    slug: "interest-rates",
    title_en: "Understanding Interest Rates",
    title_km: "ការយល់ដឹងអំពីអត្រាការប្រាក់",
    summary_en:
      "Learn what interest rates mean and how they affect your loan repayments.",
    summary_km:
      "សិក្សាពីអត្ថន័យអត្រាការប្រាក់ និងរបៀបដែលវាប៉ះពាល់ដល់ការបង់ប្រាក់កម្ចីរបស់អ្នក។",
    content_en:
      "An interest rate is the cost of borrowing money, shown as a percentage of the loan amount per year. For example, if you borrow $1,000 at 12% annual interest, you will pay $120 in interest over one year, in addition to repaying the $1,000. Lower interest rates mean lower total cost. Always compare the Annual Percentage Rate (APR) across lenders before choosing a loan.",
    content_km:
      "អត្រាការប្រាក់ គឺជាថ្លៃដើមនៃការខ្ចីប្រាក់ បង្ហាញជាភាគរយនៃចំនួនទឹកប្រាក់កម្ចីក្នុងមួយឆ្នាំ។ ឧទាហរណ៍ ប្រសិនបើអ្នកខ្ចី $1,000 ជាមួយអត្រាការប្រាក់ប្រចាំឆ្នាំ 12% អ្នកនឹងបង់ការប្រាក់ $120 ក្នុងរយៈពេលមួយឆ្នាំ បន្ថែមលើការសងត្រលប់ $1,000។ អត្រាការប្រាក់ទាបជាងមានន័យថាតម្លៃសរុបទាបជាង។ តែងតែប្រៀបធៀបអត្រាការប្រាក់ប្រចាំឆ្នាំ (APR) រវាងអ្នកឱ្យខ្ចីមុនពេលជ្រើសរើសកម្ចី។",
    icon: "Percent",
    sort_order: 1,
  },
  {
    id: "topic-2",
    slug: "loan-risks",
    title_en: "Loan Risks & Responsible Borrowing",
    title_km: "ហានិភ័យកម្ចី និងការខ្ចីប្រាក់ប្រកបដោយការទទួលខុសត្រូវ",
    summary_en:
      "Understand the risks of borrowing and how to borrow responsibly.",
    summary_km:
      "យល់ដឹងពីហានិភ័យនៃការខ្ចីប្រាក់ និងរបៀបខ្ចីប្រាក់ប្រកបដោយការទទួលខុសត្រូវ។",
    content_en:
      "Borrowing money can help you grow a business or cover emergencies, but it also carries risk. Before taking a loan, ask: Can I repay this even if my income drops? What happens to my collateral (land, house) if I cannot repay? Avoid borrowing from multiple lenders at once, as this can lead to over-indebtedness. Always read the loan contract carefully and ask questions about fees and penalties.",
    content_km:
      "ការខ្ចីប្រាក់អាចជួយអ្នកពង្រីកអាជីវកម្ម ឬដោះស្រាយករណីបន្ទាន់ ប៉ុន្តែវាក៏មានហានិភ័យដែរ។ មុនពេលខ្ចីប្រាក់ សូមសួរខ្លួនឯងថា៖ តើខ្ញុំអាចសងត្រលប់បានទេ ទោះបីប្រាក់ចំណូលថយចុះក៏ដោយ? តើនឹងមានអ្វីកើតឡើងចំពោះវត្ថុបញ្ចាំ (ដីធ្លី ផ្ទះ) ប្រសិនបើខ្ញុំមិនអាចសងបាន? ជៀសវាងការខ្ចីពីអ្នកឱ្យខ្ចីច្រើននាក់ក្នុងពេលតែមួយ ព្រោះវាអាចនាំឱ្យមានបំណុលលើស។ តែងតែអានកិច្ចសន្យាកម្ចីដោយប្រុងប្រយ័ត្ន និងសួរអំពីកម្រៃ និងការផាកពិន័យ។",
    icon: "AlertTriangle",
    sort_order: 2,
  },
  {
    id: "topic-3",
    slug: "savings",
    title_en: "Building Healthy Savings Habits",
    title_km: "បង្កើតទម្លាប់សន្សំល្អ",
    summary_en:
      "Simple strategies to start and grow your savings, even with a small income.",
    summary_km:
      "យុទ្ធសាស្ត្រសាមញ្ញដើម្បីចាប់ផ្តើម និងបង្កើនការសន្សំ ទោះបីមានប្រាក់ចំណូលតិចក៏ដោយ។",
    content_en:
      'Saving even small amounts regularly can build financial security over time. Try the "pay yourself first" method: set aside a fixed amount (even $1-2) right after you receive income, before spending on anything else. Keep savings in a safe place, such as a bank savings account or MFI deposit account, where it can also earn interest. Set a savings goal, like an emergency fund covering 3 months of expenses.',
    content_km:
      'ការសន្សំទោះបីតិចតួចជាប្រចាំ អាចបង្កើតស្ថិរភាពហិរញ្ញវត្ថុតាមពេលវេលា។ សាកល្បងវិធី "បង់ឱ្យខ្លួនឯងមុន"៖ ដាក់វាងតម្លៃថេរមួយ (ទោះបី $1-2) ភ្លាមៗបន្ទាប់ពីទទួលប្រាក់ចំណូល មុននឹងចំណាយលើអ្វីផ្សេងទៀត។ រក្សាទុកប្រាក់សន្សំនៅកន្លែងសុវត្ថិភាព ដូចជាគណនីសន្សំធនាគារ ឬគណនីប្រាក់បញ្ញើ MFI ដែលអាចទទួលបានការប្រាក់ផងដែរ។ កំណត់គោលដៅសន្សំ ដូចជាមូលនិធិសង្គ្រោះបន្ទាន់គ្រប់ចំណាយ ៣ខែ។',
    icon: "PiggyBank",
    sort_order: 3,
  },
  {
    id: "topic-4",
    slug: "digital-payments",
    title_en: "Digital Payments & Mobile Money",
    title_km: "ការទូទាត់ឌីជីថល និងលុយចល័ត",
    summary_en: "How to safely use Wing, TrueMoney, and other mobile money services.",
    summary_km:
      "របៀបប្រើប្រាស់ Wing, TrueMoney និងសេវាលុយចល័តផ្សេងទៀតដោយសុវត្ថិភាព។",
    content_en:
      "Mobile money services like Wing and TrueMoney let you send money, pay bills, and receive loans using your phone. To stay safe: never share your PIN or OTP code with anyone, even someone claiming to be from the company. Always verify the recipient phone number before sending money. Keep your transaction receipts. Use official apps downloaded from trusted app stores only.",
    content_km:
      "សេវាលុយចល័ត ដូចជា Wing និង TrueMoney អនុញ្ញាតឱ្យអ្នកផ្ញើប្រាក់ បង់វិក្កយបត្រ និងទទួលកម្ចីដោយប្រើទូរស័ព្ទ។ ដើម្បីមានសុវត្ថិភាព៖ កុំចែករំលែក PIN ឬលេខកូដ OTP ជាមួយនរណាម្នាក់ឡើយ ទោះបីជាអ្នកនោះអះអាងថាមកពីក្រុមហ៊ុនក៏ដោយ។ តែងតែផ្ទៀងផ្ទាត់លេខទូរស័ព្ទអ្នកទទួលមុនពេលផ្ញើប្រាក់។ រក្សាទុកបង្កាន់ដៃប្រតិបត្តិការ។ ប្រើតែកម្មវិធីផ្លូវការដែលទាញយកពីហាងកម្មវិធីដែលអាចទុកចិត្តបានប៉ុណ្ណោះ។",
    icon: "Smartphone",
    sort_order: 4,
  },
];

/**
 * Static fallback quiz questions, mirrored from supabase/seed.sql.
 */
export const FALLBACK_QUIZ_QUESTIONS: QuizQuestionRow[] = [
  {
    id: "quiz-1",
    topic_slug: "interest-rates",
    question_en:
      "If you borrow $1,000 at 12% annual interest for one year, how much interest will you pay?",
    question_km:
      "ប្រសិនបើអ្នកខ្ចី $1,000 ជាមួយអត្រាការប្រាក់ប្រចាំឆ្នាំ 12% រយៈពេលមួយឆ្នាំ តើអ្នកត្រូវបង់ការប្រាក់ប៉ុន្មាន?",
    options_en: ["$12", "$120", "$1,120", "$100"],
    options_km: ["$12", "$120", "$1,120", "$100"],
    correct_index: 1,
    sort_order: 1,
  },
  {
    id: "quiz-2",
    topic_slug: "interest-rates",
    question_en: "What does APR stand for?",
    question_km: "តើ APR តំណាងឱ្យអ្វី?",
    options_en: [
      "Annual Percentage Rate",
      "Average Payment Ratio",
      "Approved Payment Request",
      "Annual Profit Return",
    ],
    options_km: [
      "អត្រាភាគរយប្រចាំឆ្នាំ",
      "សមាមាត្រការទូទាត់មធ្យម",
      "សំណើទូទាត់ដែលបានអនុម័ត",
      "ផលចំណេញប្រចាំឆ្នាំ",
    ],
    correct_index: 0,
    sort_order: 2,
  },
  {
    id: "quiz-3",
    topic_slug: "loan-risks",
    question_en: "What should you do before taking a loan?",
    question_km: "តើអ្នកគួរធ្វើអ្វីមុនពេលខ្ចីប្រាក់?",
    options_en: [
      "Borrow as much as possible",
      "Check if you can repay even if income drops",
      "Borrow from many lenders at once",
      "Skip reading the contract",
    ],
    options_km: [
      "ខ្ចីឱ្យបានច្រើនតាមដែលអាចធ្វើបាន",
      "ពិនិត្យមើលថាតើអាចសងបានទេ ទោះបីប្រាក់ចំណូលថយចុះ",
      "ខ្ចីពីអ្នកឱ្យខ្ចីច្រើននាក់ក្នុងពេលតែមួយ",
      "រំលងការអានកិច្ចសន្យា",
    ],
    correct_index: 1,
    sort_order: 1,
  },
  {
    id: "quiz-4",
    topic_slug: "savings",
    question_en: 'What does "pay yourself first" mean?',
    question_km: '"តើ "បង់ឱ្យខ្លួនឯងមុន" មានន័យដូចម្តេច?',
    options_en: [
      "Spend on wants before needs",
      "Set aside savings before spending on other things",
      "Pay all bills late",
      "Borrow money to save",
    ],
    options_km: [
      "ចំណាយលើចំណង់ចង់បានមុនតម្រូវការ",
      "វាងប្រាក់សន្សំមុននឹងចំណាយលើអ្វីផ្សេង",
      "បង់វិក្កយបត្រទាំងអស់យឺត",
      "ខ្ចីប្រាក់ដើម្បីសន្សំ",
    ],
    correct_index: 1,
    sort_order: 1,
  },
  {
    id: "quiz-5",
    topic_slug: "digital-payments",
    question_en:
      "Should you share your mobile money PIN with someone claiming to be from the company?",
    question_km:
      "តើអ្នកគួរចែករំលែកលេខ PIN លុយចល័តរបស់អ្នកជាមួយនរណាម្នាក់ដែលអះអាងថាមកពីក្រុមហ៊ុនដែរឬទេ?",
    options_en: [
      "Yes, always",
      "No, never share your PIN or OTP",
      "Only if they call from a phone number",
      "Only on weekends",
    ],
    options_km: [
      "បាទ/ចាស តែងតែចែករំលែក",
      "ទេ កុំចែករំលែក PIN ឬ OTP ឡើយ",
      "ត្រឹមតែប្រសិនបើពួកគេហៅពីលេខទូរស័ព្ទ",
      "ត្រឹមតែថ្ងៃចុងសប្តាហ៍",
    ],
    correct_index: 1,
    sort_order: 1,
  },
];
