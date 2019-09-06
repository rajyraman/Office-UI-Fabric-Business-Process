export interface IBusinessProcessBoardProps {
  businessProcessName: string | null;
  businessProcessStages: IBusinessProcessStage[];
  records: IBPFRecord[];
  totalResultCount: number;
  triggerNavigate?: (id: string) => void;
  triggerPaging?: (pageCommand: string) => void;
}
export interface IBusinessProcessStage {
  stageId?: string;
  nextStageId?: string;
  description?: string;
  stepLabels: {list: string[]};
}

export interface IBPFRecord {
  activeStageId: string;
  nextStageId?: string;
  activeStageName: string;
  activeStageStartedOn: Date;
  recordName: string;
  createdBy: string;
  recordId: string;
  traversedPath: string;
}
