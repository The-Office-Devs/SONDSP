export type HelpAudience = 'admin' | 'professor';

export type HelpMaterialType = 'pdf' | 'spreadsheet' | 'video' | 'link';

export interface HelpMaterial {
  title: string;
  type: HelpMaterialType;
  url?: string;
}

export type HelpAlertType = 'warning' | 'info';

export interface HelpAlert {
  type: HelpAlertType;
  message: string;
}

export interface HelpTopic {
  id: string;
  title: string;
  steps: string[];
  alert?: HelpAlert;
  materials?: HelpMaterial[];
}

export interface HelpModule {
  id: string;
  title: string;
  audience: HelpAudience[];
  description?: string;
  topics: HelpTopic[];
}
