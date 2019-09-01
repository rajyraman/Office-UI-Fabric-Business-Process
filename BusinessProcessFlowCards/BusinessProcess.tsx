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
  StickyPositionType,
  CommandBar,
  ICommandBarItemProps,
  ColorClassNames,
  ScrollablePane,
  ScrollbarVisibility
} from "office-ui-fabric-react";

// @ts-ignore
import TimeAgo from "timeago-react";

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
      background: "#0078D4",
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
      borderLeft: "5px solid rgb(0, 120, 212)"
    },
    stackStyles: {
      paddingTop: 5,
      paddingBottom: 5,
      alignItems: "center",
      height: "60vh"
    },
    cardStyle: {
      marginBottom: 5,
    },
    containerStackStyle: {
      overflow: "scroll"
    },
    bpfStageStyle: {
      overflow: "scroll",
      height: "60vh"
    },
    scrollableContainer: {
      height: "60vh",
      maxHeight: "inherit",
      overflow: "scroll"
    }
  });

  const sectionStackTokens: IStackTokens = {
    childrenGap: 20,
    padding: 10
  };
  const containerStackTokens: IStackTokens = { padding: 5 };

  const cardTokens: ICardTokens = {
    childrenMargin: 12,
    minWidth: 300,
    maxHeight: 150,
    padding: 20,
    boxShadow: "0 0 20px rgba(0, 0, 0, .2)"
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
            <div>
              <Text
                variant="mediumPlus"
                className={styles.businessProcessStage}
              >
                {stage.description}
              </Text>
            </div>
            {props.records
              .filter(r => r.activeStageId == stage.labelId)
              .map(r => (
                <Card
                  tokens={cardTokens}
                  id={r.recordId}
                  key={r.recordId}
                  onClick={cardClicked}
                  className={styles.cardStyle}
                >
                  <Card.Section fill={false}>
                    <Persona
                      text={r.createdBy}
                      size={PersonaSize.extraSmall}
                      className={styles.persona}
                    />
                    <Stack
                      horizontal
                      tokens={footerStackTokens}
                      className={styles.footerStyle}
                    >
                      <Text variant="medium" className={styles.headerText}>
                        {r.recordName}
                      </Text>
                      <Text
                        variant="smallPlus"
                        className={styles.descriptionText}
                      >
                        <TimeAgo datetime={r.activeStageStartedOn} />
                      </Text>
                    </Stack>
                  </Card.Section>
                </Card>
              ))}
          </Stack>
        ))}
      </Stack>
    </>
  );
}
