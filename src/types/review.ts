export type Severity = 'critical' | 'major' | 'minor';

export interface Issue {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  page: number;
}

export interface IssueWithState extends Issue {
  resolved: boolean;
  acknowledged: boolean;
}

export interface ReviewUser {
  id: string;
  first_name: string;
  last_name: string;
}

export interface ReviewPage {
  page_num: number;
  height: number;
  width: number;
}

export interface ReviewDocument {
  pdf_url: string;
  pages: ReviewPage[];
}

export interface Review {
  id: string;
  name: string;
  uploaded_at: string;
  status: 'created' | 'processing' | 'on_review' | 'submitted';
  version: number;
  user: ReviewUser;
  document: ReviewDocument;
  issues: Issue[];
}

export type FilterType = 'open' | 'resolved' | 'all' | 'blockers';
