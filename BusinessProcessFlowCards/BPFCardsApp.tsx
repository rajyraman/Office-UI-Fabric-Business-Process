import * as React from "react";
import { useState, useEffect, useContext, useRef } from "react";
import {
  initializeIcons,
  mergeStyleSets,
  FontWeights,
  Stack,
  IStackTokens,
  Text,
  Sticky,
  CommandBar,
  ICommandBarItemProps,
  ScrollablePane
} from "office-ui-fabric-react";
import { BusinessProcessRecordCard, Action } from "./BusinessProcessRecordCard";
import {
  IBusinessProcessBoardProps,
  IBPFRecord,
  IBusinessProcessStage
} from "./Interfaces";

initializeIcons(undefined, { disableWarnings: true });
const BPFStageContext = React.createContext<IBusinessProcessStage>({
  stageId: "",
  nextStageId: "",
  description: "",
  stepLabels: { list: [] }
});

const BPFCardsApp: React.SFC<IBusinessProcessBoardProps> = (
  props
): JSX.Element => {
  const [bpfRecords, setBpfRecords] = useState<IBPFRecord[]>(props.records);
  const isInitialRender = useRef(true);
  console.log(bpfRecords);
  useEffect(() => {
    console.log('useEffect');
    setBpfRecords(props.records);
  }, [props.records]);

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
    bpfStack: {
      paddingTop: 5,
      paddingBottom: 5,
      height: "60vh"
    },
    containerStack: {
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
    let updatedRecords = bpfRecords.map(b => {
      if (b.recordId === card.recordId) {
        switch (action) {
          case Action.Left:
            const stages = b.traversedPath.split(",");
            if (stages.length > 1) {
              const prevStageId: string = stages.pop()!;
              console.log(
                `Move back ${b.recordId} from ${b.activeStageId} to ${prevStageId}`
              );
              b.activeStageId = stages[stages.length - 1];
              b.traversedPath = stages.join();
            }
            break;
          case Action.Right:
            if (card.nextStageId) {
              console.log(
                `Move forward ${b.recordId} from ${b.activeStageId} to ${card.nextStageId}`
              );
              b.activeStageId = card.nextStageId;
              b.traversedPath = `${b.traversedPath},${card.nextStageId}`;
            }
            break;
        }
        b.isLocal = true;
        if(props.triggerStageChange){
          props.triggerStageChange(b);
        }        
      }
      return b;
    });
  };

  return (
    <>
      <CommandBar farItems={rightCommands} items={leftCommands} />
      <Stack
        horizontal
        tokens={containerStackTokens}
        className={styles.containerStack}
      >
        {props.businessProcessStages
          .filter(b => b.stepLabels.list.length > 0)
          .map(stage => (
            <Stack
              tokens={sectionStackTokens}
              id={stage.stageId}
              key={stage.stageId}
              className={styles.bpfStack}
            >
              <div className={styles.scrollablePaneContainer}>
                <ScrollablePane scrollbarVisibility={"auto"}>
                  <BPFStageContext.Provider value={stage}>
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
                    {bpfRecords
                      .filter(r => r.activeStageId == stage.stageId)
                      .map((card: IBPFRecord, index) => {
                        card.nextStageId = stage.nextStageId;
                        return (
                          <BusinessProcessRecordCard
                            bpfDetail={card}
                            key={card.bpfInstanceId}
                            triggerNavigate={props.triggerNavigate}
                            onClick={moveCard}
                          />
                        );
                      })}
                  </BPFStageContext.Provider>
                </ScrollablePane>
              </div>
            </Stack>
          ))}
      </Stack>
    </>
  );
};

export { BPFStageContext, BPFCardsApp };
