export interface IBusinessProcessBoardProps {
  businessProcessName: string | null;
  businessProcessStages: IBusinessProcessStage[];
  records: IBPFRecord[];
  totalResultCount: number;
  triggerStageChange?: (record: IBPFRecord) => Promise<boolean|void>;
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
  bpfInstanceId: string;
  traversedPath: string;
  isLocal: boolean
}
