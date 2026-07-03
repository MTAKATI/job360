export type PostHogEventProperties = {
  job_search_started: {
    userId: string;
    jobTitle: string;
    location: string;
  };
  job_found: {
    userId: string;
    source: "search" | "url";
    matchScore: number;
  };
  profile_completed: {
    userId: string;
  };
  company_researched: {
    userId: string;
    jobId: string;
    company: string;
  };
};

export type PostHogEventName = keyof PostHogEventProperties;
