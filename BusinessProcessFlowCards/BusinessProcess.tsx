import * as React from "react";
import { Card, ICardTokens } from "@uifabric/react-cards";
import {
  initializeIcons,
  FontWeights,
  mergeStyleSets,
  Persona,
  PersonaSize,
  Stack,
  IStackTokens,
  Text,
  Sticky,
  CommandBar,
  ICommandBarItemProps,
  ScrollablePane,
  IStyle,
  ColorClassNames
} from "office-ui-fabric-react";

// @ts-ignore
import TimeAgo from "timeago-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  ResponderProvided,
  DraggingStyle,
  NotDraggingStyle
} from "react-beautiful-dnd";

initializeIcons(undefined, { disableWarnings: true });

export interface IBusinessProcessProps {
  businessProcessName: string | null;
  businessProcessStages: IBusinessProcessStage[];
  records: IBPFRecord[];
  totalResultCount: number;
  triggerNavigate?: (id: string) => void;
  triggerPaging?: (pageCommand: string) => void;
}
export interface IBusinessProcessStage {
  labelId: string;
  languageCode: string;
  description: string;
}
export interface IBPFRecord {
  activeStageId: string;
  activeStageName: string;
  activeStageStartedOn: Date;
  recordName: string;
  createdBy: string;
  recordId: string;
}
export function BusinessProcess(props: IBusinessProcessProps) {
  const styles = mergeStyleSets({
    headerText: {
      fontWeight: FontWeights.semibold
    },
    descriptionText: {
      color: "#333333"
    },
    icon: {
      color: "#0078D4",
      fontSize: 16,
      fontWeight: FontWeights.regular
    },
    cardFooter: {
      borderLeft: "1px solid #F3F2F1"
    },
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
    persona: {
      padding: 5
    },
    sticky: {},
    footerStyle: {
      borderLeft: "5px solid rgb(59, 121, 183)"
    },
    stackStyles: {
      paddingTop: 5,
      paddingBottom: 5,
      height: "60vh"
    },
    cardStyle: {
      marginTop: 20,
      marginLeft: 10
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

  const cardTokens: ICardTokens = {
    childrenMargin: 12,
    padding: 10,
    boxShadow: "0 0 20px rgba(0, 0, 0, .2)",
    minWidth: 310
  };

  const footerStackTokens: IStackTokens = {
    childrenGap: 50,
    padding: 10
  };

  const cardClicked = (ev: React.MouseEvent<HTMLElement>): void => {
    if (props.triggerNavigate) {
      props.triggerNavigate(ev.currentTarget.id);
    }
  };

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

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {};
  return (
    <>
      <CommandBar farItems={rightCommands} items={leftCommands} />
      <Stack
        horizontal
        tokens={containerStackTokens}
        className={styles.containerStackStyle}
      >
        {props.businessProcessStages.map(stage => (
          <Stack
            tokens={sectionStackTokens}
            id={stage.labelId}
            key={stage.labelId}
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
                {
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId={stage.description}>
                      {(provided, snapshot) => (
                        <div ref={provided.innerRef}>
                          {props.records
                            .filter(r => r.activeStageId == stage.labelId)
                            .map((item, index) => (
                              <Draggable
                                key={item.recordId}
                                draggableId={item.recordId}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <Card
                                      tokens={cardTokens}
                                      id={item.recordId}
                                      key={item.recordId}
                                      onClick={cardClicked}
                                      className={styles.cardStyle}
                                    >
                                      <Card.Section fill={false} grow>
                                        <Persona
                                          text={item.createdBy}
                                          size={PersonaSize.extraSmall}
                                          className={styles.persona}
                                        />
                                        <Stack
                                          horizontal
                                          tokens={footerStackTokens}
                                          className={styles.footerStyle}
                                        >
                                          <Text
                                            variant="medium"
                                            className={styles.headerText}
                                          >
                                            {item.recordName}
                                          </Text>
                                          <Text
                                            variant="smallPlus"
                                            className={styles.descriptionText}
                                          >
                                            <TimeAgo
                                              datetime={
                                                item.activeStageStartedOn
                                              }
                                            />
                                          </Text>
                                        </Stack>
                                      </Card.Section>
                                    </Card>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                }
              </ScrollablePane>
            </div>
          </Stack>
        ))}
      </Stack>
    </>
  );
}
