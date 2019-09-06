import * as React from "react";
import { useContext } from "react";
import { Card, ICardTokens } from "@uifabric/react-cards";
import {
  FontWeights,
  mergeStyleSets,
  Persona,
  PersonaSize,
  Stack,
  IStackTokens,
  Text,
  IconButton,
  IIconProps,
  BaseButton,
  Button
} from "office-ui-fabric-react";

// @ts-ignore
import TimeAgo from "timeago-react";
import { IBPFRecord } from "./Interfaces";
import { BPFStageContext } from "./BPFCardsApp";

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
    fontWeight: FontWeights.semibold,
    paddingTop: 5
  },
  persona: {
    padding: 5
  },
  footer: {
    borderLeft: "5px solid rgb(59, 121, 183)"
  },
  card: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 5
  },
  navigationSection: {
    borderLeft: "2px solid #F3F2F1",
    paddingLeft: 5
  }
});

export enum Action {
  "Navigate",
  "Left",
  "Right"
}

const footerStackTokens: IStackTokens = {
  childrenGap: 50,
  padding: 10
};

const cardTokens: ICardTokens = {
  childrenMargin: 12,
  padding: 10,
  boxShadow: "0 0 20px rgba(0, 0, 0, .2)",
  width: 320
};

export interface IBusinessProcessRecordCardProps {
  bpfDetail: IBPFRecord;
  onClick?: (card: IBPFRecord, action: Action) => void;
  triggerNavigate?: (id: string) => void;
}

export function BusinessProcessRecordCard(
  props: IBusinessProcessRecordCardProps
): JSX.Element {
  const bpfStage = useContext(BPFStageContext);
  const cardClicked = (
    ev: React.MouseEvent<
      | HTMLElement
      | HTMLAnchorElement
      | HTMLButtonElement
      | HTMLDivElement
      | BaseButton
      | Button
    >,
    action: Action,
    recordId: string
  ): void => {
    ev.preventDefault();
    switch (action) {
      case Action.Navigate:
        if (props.triggerNavigate) {
          props.triggerNavigate(recordId);
        }
        break;
      default:
        if (props.onClick) {
          props.onClick(props.bpfDetail, action);
        }
        break;
    }
  };

  return (
    <Card
      compact
      tokens={cardTokens}
      id={props.bpfDetail.recordId}
      key={props.bpfDetail.recordId}
      className={styles.card}
    >
      <Card.Section fill={false} grow>
        <Persona
          text={props.bpfDetail.createdBy}
          size={PersonaSize.extraSmall}
          className={styles.persona}
        />
        <Stack horizontal tokens={footerStackTokens} className={styles.footer}>
          <Text variant="medium" className={styles.headerText}>
            {props.bpfDetail.recordName}
          </Text>
          <Text variant="smallPlus" className={styles.descriptionText}>
            <TimeAgo datetime={props.bpfDetail.activeStageStartedOn} />
          </Text>
        </Stack>
      </Card.Section>
      <Card.Section className={styles.navigationSection}>
        <IconButton
          iconProps={{ iconName: "ChevronLeft" }}
          className={styles.icon}
          onClick={e => cardClicked(e, Action.Left, props.bpfDetail.recordId)}
        />
        <IconButton
          iconProps={{ iconName: "ChevronRight" }}
          className={styles.icon}
          onClick={e => cardClicked(e, Action.Right, props.bpfDetail.recordId)}
        />
        <IconButton
          iconProps={{ iconName: "RedEye" }}
          className={styles.icon}
          onClick={e =>
            cardClicked(e, Action.Navigate, props.bpfDetail.recordId)
          }
        />
      </Card.Section>
    </Card>
  );
}
