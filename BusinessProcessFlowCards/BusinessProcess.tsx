import * as React from "react";
import { initializeIcons } from "office-ui-fabric-react/lib/Icons";
import { FontWeights } from "@uifabric/styling";
import { Card, ICardItemTokens, ICardTokens } from "@uifabric/react-cards";
import {
  ActionButton,
  IButtonStyles,
  Icon,
  IIconStyles,
  Image,
  Persona,
  Stack,
  IStackTokens,
  Text,
  ITextStyles
} from "office-ui-fabric-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Nav, INavLink } from "office-ui-fabric-react/lib/Nav";

initializeIcons(undefined, { disableWarnings: true });

export interface IBusinessProcessProps {}

export function BusinessProcess() {
  const siteTextStyles = {
    root: {
      color: "#025F52",
      fontWeight: FontWeights.semibold
    }
  };
  const descriptionTextStyles = {
    root: {
      color: "#333333",
      fontWeight: FontWeights.regular
    }
  };
  const helpfulTextStyles = {
    root: {
      color: "#333333",
      fontWeight: FontWeights.regular
    }
  };
  const iconStyles = {
    root: {
      color: "#0078D4",
      fontSize: 16,
      fontWeight: FontWeights.regular
    }
  };
  const footerCardSectionStyles = {
    root: {
      borderLeft: "1px solid #F3F2F1"
    }
  };

  const sectionStackTokens = { childrenGap: 20, padding: 10 };
  const containerStackTokens = { padding: 5 };
  const cardTokens = {
    childrenMargin: 12
  };
  const footerCardSectionTokens = { padding: "0px 0px 0px 12px" };
  const businessProcessStageStyles = {
    root: {
      padding: 10,
      fontWeight: FontWeights.semibold,
      background: "#8764b8",
      color: "#fcfcfc"
    }
  };

  const alertClicked = () => {
    alert("Clicked");
  };

  return (
    <Stack horizontal tokens={containerStackTokens}>
      <Stack tokens={sectionStackTokens}>
        <Nav
          selectedKey="key3"
          expandButtonAriaLabel="Expand or collapse"
          selectedAriaLabel="Selected"
          styles={{
            root: {
              width: 208,
              height: 350,
              boxSizing: "border-box",
              border: "1px solid #eee",
              overflowY: "auto"
            }
          }}
          groups={[
            {
              links: [
                {
                  name: "Case",
                  url: "http://example.com",
                  links: [
                    {
                      name: "Phonecall to Case Process",
                      url: "http://msn.com",
                      key: "key1",
                      target: "_blank"
                    },
                    {
                      name: "Case Escalation Process",
                      url: "http://msn.com",
                      disabled: true,
                      key: "key2",
                      target: "_blank"
                    }
                  ],
                  isExpanded: true
                },
                {
                  name: "Lead",
                  url: "http://cnn.com",
                  key: "key7",
                  target: "_blank",
                  links: [
                    {
                      name: "Qualify Lead Process",
                      url: "http://msn.com",
                      key: "key1",
                      target: "_blank",
                      isExpanded: true
                    },
                    {
                      name: "Lead to Opportunity Process",
                      url: "http://msn.com",
                      disabled: true,
                      key: "key2",
                      target: "_blank"
                    }
                  ],
                  isExpanded: true
                }
              ]
            }
          ]}
        />
      </Stack>
      <Stack tokens={sectionStackTokens}>
        <Text variant="medium" styles={businessProcessStageStyles}>
          Stage 1
        </Text>
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
                      <Card compact onClick={alertClicked} tokens={cardTokens}>
                        <Card.Section>
                          <Text variant="small" styles={siteTextStyles}>
                            Contoso
                          </Text>
                          <Text styles={descriptionTextStyles}>Item A</Text>
                        </Card.Section>
                        <Card.Section
                          styles={footerCardSectionStyles}
                          tokens={footerCardSectionTokens}
                        >
                          <Icon
                            iconName="NavigateForward"
                            styles={iconStyles}
                          />
                          <Icon iconName="NavigateBack" styles={iconStyles} />
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
      <Stack tokens={sectionStackTokens}>
        <Text variant="medium" styles={businessProcessStageStyles}>
          Stage 2
        </Text>
        <Card compact onClick={alertClicked} tokens={cardTokens}>
          <Card.Section>
            <Text variant="small" styles={siteTextStyles}>
              Contoso
            </Text>
            <Text styles={descriptionTextStyles}>Item B</Text>
          </Card.Section>
          <Card.Section
            styles={footerCardSectionStyles}
            tokens={footerCardSectionTokens}
          >
            <Icon iconName="NavigateBack" styles={iconStyles} />
            <Icon iconName="NavigateForward" styles={iconStyles} />
          </Card.Section>
        </Card>
      </Stack>
      <Stack tokens={sectionStackTokens}>
        <Text variant="medium" styles={businessProcessStageStyles}>
          Stage 3
        </Text>
        <Card compact onClick={alertClicked} tokens={cardTokens}>
          <Card.Section>
            <Text variant="small" styles={siteTextStyles}>
              Contoso
            </Text>
            <Text styles={descriptionTextStyles}>Item C</Text>
          </Card.Section>
          <Card.Section
            styles={footerCardSectionStyles}
            tokens={footerCardSectionTokens}
          >
            <Icon iconName="NavigateForward" styles={iconStyles} />
            <Icon iconName="NavigateBack" styles={iconStyles} />
          </Card.Section>
        </Card>
        <Card compact onClick={alertClicked} tokens={cardTokens}>
          <Card.Section>
            <Text variant="small" styles={siteTextStyles}>
              Acme
            </Text>
            <Text styles={descriptionTextStyles}>Item D</Text>
          </Card.Section>
          <Card.Section
            styles={footerCardSectionStyles}
            tokens={footerCardSectionTokens}
          >
            <Icon iconName="NavigateForward" styles={iconStyles} />
            <Icon iconName="NavigateBack" styles={iconStyles} />
          </Card.Section>
        </Card>        
      </Stack>
    </Stack>
  );
}
