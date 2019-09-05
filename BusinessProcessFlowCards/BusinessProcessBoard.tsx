import * as React from "react";
import {
  initializeIcons,
  FontWeights,
  mergeStyleSets,
  Stack,
  IStackTokens,
  Text,
  Sticky,
  CommandBar,
  ICommandBarItemProps,
  ScrollablePane
} from "office-ui-fabric-react";
import { BusinessProcessRecordCard, Action } from "./BusinessProcessRecordCard";

initializeIcons(undefined, { disableWarnings: true });

export interface IBusinessProcessBoardProps {
  businessProcessName: string | null;
  businessProcessStages: IBusinessProcessStage[];
  records: IBPFRecord[];
  totalResultCount: number;
  triggerNavigate?: (id: string) => void;
  triggerPaging?: (pageCommand: string) => void;
}
export interface IBusinessProcessStage {
  stageId: string;
  nextStageId: string;
  description: string;
  stepLabels: IBusinessProcessStageList;
}

export interface IBusinessProcessStageList {
  list: string[];
}

export interface IBPFRecord {
  activeStageId: string;
  nextStageId: string;
  activeStageName: string;
  activeStageStartedOn: Date;
  recordName: string;
  createdBy: string;
  recordId: string;
  traversedPath: string;
}
export function BusinessProcessBoard(props: IBusinessProcessBoardProps): JSX.Element {
  const [bpfRecords, setBpfRecords] = React.useState<IBPFRecord[]>(props.records);

  const styles = mergeStyleSets({
    businessProcessStage: {
      padding: 10,
      fontWeight: FontWeights.semibold,
      background: "rgb(59, 121, 183)",
      color: "#fcfcfc",
      boxShadow: "0 0 20px rgba(0, 0, 0, .2)",
      display: "block",
      textAlign: "center",
      minWidth: 300
    },
    stackStyles: {
      paddingTop: 5,
      paddingBottom: 5,
      height: "60vh"
    },
    containerStackStyle: {
      overflowX: "scroll",
      overflowY: "hidden"
    },
    scrollablePaneContainer: {
      position: "relative",
      height: "80vh",
      minWidth: 350
    }
  });

  const sectionStackTokens: IStackTokens = {
    childrenGap: 20,
    padding: 10
  };
  const containerStackTokens: IStackTokens = { padding: 5 };

  const rightCommands: ICommandBarItemProps[] = [
    {
      key: "next",
      name: `Load more (${props.records.length} of ${props.totalResultCount})..`,
      iconProps: {
        iconName: "ChevronRight"
      },
      disabled: props.records.length == props.totalResultCount,
      onClick: () => {
        if (props.triggerPaging) {
          props.triggerPaging("next");
        }
      }
    }
  ];
  const leftCommands: ICommandBarItemProps[] = [];
  
  const moveCard = (card: IBPFRecord, action: Action): void => {
    console.log(`${action} ${card.recordId}`);
    let updatedRecord = bpfRecords.filter(b=>b.recordId === card.recordId).map(b=>{
      b.activeStageId = card.nextStageId;
      return b;
    }); 
    console.log(updatedRecord);
    //setBpfRecords(updatedRecords);
  };

  return (
    <>
      <CommandBar farItems={rightCommands} items={leftCommands} />
      <Stack
        horizontal
        tokens={containerStackTokens}
        className={styles.containerStackStyle}
      >
        {props.businessProcessStages
          .filter(b => b.stepLabels.list.length > 0)
          .map(stage => (
            <Stack
              tokens={sectionStackTokens}
              id={stage.stageId}
              key={stage.stageId}
              className={styles.stackStyles}
            >
              <div className={styles.scrollablePaneContainer}>
                <ScrollablePane scrollbarVisibility={"auto"}>
                  <Sticky>
                    <div>
                      <Text
                        variant="mediumPlus"
                        className={styles.businessProcessStage}
                      >
                        {stage.description}
                      </Text>
                    </div>
                  </Sticky>
                  <div>
                    {bpfRecords
                      .filter(r => r.activeStageId == stage.stageId)
                      .map((card: IBPFRecord, index) => (
                        <BusinessProcessRecordCard
                          bpfDetail={card}
                          key={card.recordId}
                          triggerNavigate={props.triggerNavigate}
                          onClick={moveCard}
                        />
                      ))}
                  </div>
                </ScrollablePane>
              </div>
            </Stack>
          ))}
      </Stack>
    </>
  );
}
