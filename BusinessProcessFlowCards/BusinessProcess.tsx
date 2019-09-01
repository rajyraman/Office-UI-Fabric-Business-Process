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
  ITheme,
  createTheme
} from "office-ui-fabric-react";
// @ts-ignore
import TimeAgo from "timeago-react";

initializeIcons(undefined, { disableWarnings: true });

export interface IBusinessProcessProps {
  businessProcessName: string | null;
  businessProcessStages: IBusinessProcessStage[];
  records: IBPFRecord[];
  triggerNavigate?: (id: string) => void;
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
      width: "inherit",
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
      paddingTop: 10,
      paddingBottom: 10,
      overflow: "auto",
      alignItems: "center"
    },
    cardStyle: {
      marginBottom: 20
    }
  });

  const sectionStackTokens: IStackTokens = {
    childrenGap: 20,
    padding: 10
  };
  const containerStackTokens: IStackTokens = { padding: 5 };

  const cardTokens: ICardTokens = {
    childrenMargin: 12,
    minWidth: 200,
    width: 300,
    maxWidth: 400,
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

  return (
    <Stack horizontal tokens={containerStackTokens}>
      {props.businessProcessStages.map(stage => (
        <Stack
          tokens={sectionStackTokens}
          id={stage.labelId}
          key={stage.labelId}
          className={styles.stackStyles}
        >
          <Sticky
            stickyPosition={StickyPositionType.Header}
            stickyClassName={styles.sticky}
          >
            <Text variant="mediumPlus" className={styles.businessProcessStage}>
              {stage.description}
            </Text>
          </Sticky>
          <div>
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
                  <Card.Section fill>
                    <Persona
                      text={r.createdBy}
                      size={PersonaSize.extraSmall}
                      className={styles.persona}
                    />
                    <Stack
                      grow
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
          </div>
        </Stack>
      ))}
    </Stack>
  );
}
