export type ProviderType = "bank" | "mfi" | "digital_wallet";
export type ServiceType = "bank" | "mfi" | "wing" | "truemoney";

export interface LoanProductRow {
  id: string;
  provider_name: string;
  provider_type: ProviderType;
  product_name: string;
  product_name_km: string | null;
  interest_rate_min: number;
  interest_rate_max: number;
  term_min_months: number;
  term_max_months: number;
  min_amount: number;
  max_amount: number;
  description: string | null;
  description_km: string | null;
  created_at: string;
}

export interface ServiceLocationRow {
  id: string;
  name: string;
  name_km: string | null;
  service_type: ServiceType;
  address: string;
  address_km: string | null;
  latitude: number;
  longitude: number;
  hours: string | null;
  phone: string | null;
  created_at: string;
}

export interface EducationTopicRow {
  id: string;
  slug: string;
  title_en: string;
  title_km: string;
  summary_en: string;
  summary_km: string;
  content_en: string;
  content_km: string;
  icon: string | null;
  sort_order: number;
}

export interface QuizQuestionRow {
  id: string;
  topic_slug: string;
  question_en: string;
  question_km: string;
  options_en: string[];
  options_km: string[];
  correct_index: number;
  sort_order: number;
}

export interface Database {
  public: {
    Tables: {
      loan_products: {
        Row: LoanProductRow;
        Insert: Partial<LoanProductRow>;
        Update: Partial<LoanProductRow>;
      };
      service_locations: {
        Row: ServiceLocationRow;
        Insert: Partial<ServiceLocationRow>;
        Update: Partial<ServiceLocationRow>;
      };
      education_topics: {
        Row: EducationTopicRow;
        Insert: Partial<EducationTopicRow>;
        Update: Partial<EducationTopicRow>;
      };
      quiz_questions: {
        Row: QuizQuestionRow;
        Insert: Partial<QuizQuestionRow>;
        Update: Partial<QuizQuestionRow>;
      };
    };
  };
}
