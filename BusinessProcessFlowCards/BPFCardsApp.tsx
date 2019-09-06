import * as React from "react";
import { useState, useEffect, useContext } from "react";
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
    console.log(`${action} ${card.recordId}`);
    console.table(bpfRecords);
    let updatedRecords = bpfRecords.map(b => {
      if (b.recordId === card.recordId && card.nextStageId) {
        console.log(
          `Move ${b.recordId} from ${b.activeStageId} to ${card.nextStageId}`
        );
        b.activeStageId = card.nextStageId;
      }
      return b;
    });
    console.table(updatedRecords);
    setBpfRecords(updatedRecords);
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
                            key={card.recordId}
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
