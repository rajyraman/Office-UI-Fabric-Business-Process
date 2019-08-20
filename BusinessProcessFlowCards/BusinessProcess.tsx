import * as React from "react";
import { Card, ICardItemTokens, ICardTokens } from "@uifabric/react-cards";
import {
  initializeIcons,
  FontWeights,
  mergeStyleSets,
  FontSizes,
  ColorClassNames,
  Persona,
  PersonaSize,
  Stack,
  IStackTokens,
  Text,
  ITextStyles,
  Sticky,
  StickyPositionType,
  Nav,
  INavLink,
  ITheme,
  createTheme
} from "office-ui-fabric-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

initializeIcons(undefined, { disableWarnings: true });

export interface IBusinessProcessProps {}

export function BusinessProcess() {
  const styles = mergeStyleSets({
    headerText: {
      fontWeight: FontWeights.semibold,
      fontSize: FontSizes.medium
    },
    descriptionText: {
      color: "#333333",
      fontWeight: FontWeights.regular
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
      width: "inherit"
    },
    persona: {
      padding: 5
    },
    sticky: {
      width: 300
    }
  });
  const theme: ITheme = createTheme({});

  const sectionStackTokens = {
    childrenGap: 20,
    padding: 10,
    background: theme.palette.themePrimary
  };
  const containerStackTokens = { padding: 5 };
  const cardTokens = {
    childrenMargin: 12,
    minWidth: 200,
    width: 300,
    maxWidth: 400,
    padding: 20,
    boxShadow: "0 0 20px rgba(0, 0, 0, .2)"
  };

  const alertClicked = () => {
    alert("Clicked");
  };

  return (
    <Stack horizontal tokens={containerStackTokens}>
      <Stack tokens={sectionStackTokens}>
        <Sticky
          stickyPosition={StickyPositionType.Header}
          stickyClassName={styles.sticky}
        >
          <Text variant="medium" className={styles.businessProcessStage}>
            Stage 1
          </Text>
        </Sticky>
        <DragDropContext onDragEnd={x => true}>
          <Droppable droppableId="droppable">
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <Draggable key={1} draggableId={"1"} index={1}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Card onClick={alertClicked} tokens={cardTokens}>
                        <Card.Section fill>
                          <Persona
                            text={"Natraj Yegnaraman"}
                            size={PersonaSize.extraSmall}
                            className={styles.persona}
                          />
                          <Stack grow horizontal>
                            <Text variant="small" className={styles.headerText}>
                              Contoso
                            </Text>
                            <Text className={styles.descriptionText}>
                              62 days
                            </Text>
                          </Stack>
                        </Card.Section>
                      </Card>
                    </div>
                  )}
                </Draggable>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Stack>
    </Stack>
  );
}
