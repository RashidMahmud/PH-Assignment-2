export type TIssueType = "bug" | "feature_request";
export type TIssueStatus = "open" | "in_progress" | "resolved";

export interface IIssuePayload {
  title: string;
  description: string;
  type: TIssueType;
}

export interface IIssueQueryParams {
  sort?: "newest" | "oldest" | string;
  type?: TIssueType | string;
  status?: TIssueStatus | string;
}


export interface IIssueRow {
  id: number;
  title: string;
  description: string;
  type: TIssueType;
  status: TIssueStatus;
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
}


export interface IReporter {
  id: number;
  name: string;
  role: string;
}


export interface IReporterMap {
  [key: number]: IReporter;
}