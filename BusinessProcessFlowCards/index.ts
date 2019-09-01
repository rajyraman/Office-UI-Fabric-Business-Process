import { IInputs, IOutputs } from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;
import {
  BusinessProcess,
  IBusinessProcessProps,
  IBusinessProcessStage,
  IBPFRecord
} from "./BusinessProcess";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as JSONPath from "jsonpath";

export class BusinessProcessFlowCards
  implements ComponentFramework.StandardControl<IInputs, IOutputs> {
  private _container: HTMLDivElement;
  private _context: ComponentFramework.Context<IInputs>;
  private _props: IBusinessProcessProps = {
    businessProcessName: "",
    businessProcessStages: [],
    records: [],
    totalResultCount: 0
  };
  private _bpfLinkingAttributeName: string;

  private navigateToRecord(id: string): void {
    this._context.navigation.openForm({
      entityName: this._context.parameters.sampleDataSet.getTargetEntityType(),
      entityId: id
    });
  }

  private navigateToPage(pageCommand: string): void {
    switch (pageCommand) {
      case "next":
        if (this._context.parameters.sampleDataSet.paging.hasNextPage) {
          this._context.parameters.sampleDataSet.paging.loadNextPage();
        }
        break;
      case "previous":
        if (this._context.parameters.sampleDataSet.paging.hasPreviousPage) {
          this._context.parameters.sampleDataSet.paging.loadPreviousPage();
        }
        break;
    }
  }

  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
   * @param container If a control is marked control-type='starndard', it will receive an empty div element within which it can render its content.
   */
  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ) {
    this._container = container;
    this._context = context;
    this._props.businessProcessName =
      context.parameters.businessProcessName.raw;
    this._props.triggerNavigate = this.navigateToRecord.bind(this);
    this._props.triggerPaging = this.navigateToPage.bind(this);

    context.utils
      .getEntityMetadata(context.parameters.sampleDataSet.getTargetEntityType())
      .then(r => {
        this._bpfLinkingAttributeName = r.IsCustomEntity
          ? `bpf_${r.PrimaryIdAttribute}`
          : r.PrimaryIdAttribute;
        context.parameters.sampleDataSet.linking.addLinkedEntity({
          name: this._props.businessProcessName!,
          from: this._bpfLinkingAttributeName,
          to: r.PrimaryIdAttribute,
          linkType: "inner",
          alias: "bpfentity"
        });
        if (context.parameters.sampleDataSet.addColumn) {
          context.parameters.sampleDataSet.addColumn(
            "activestageid",
            "bpfentity"
          );
          context.parameters.sampleDataSet.addColumn(
            "activestagestartedon",
            "bpfentity"
          );
          context.parameters.sampleDataSet.addColumn("createdby", "bpfentity");
          context.parameters.sampleDataSet.addColumn(
            this._bpfLinkingAttributeName,
            "bpfentity"
          );
        }
      })
      .then(() => context.parameters.sampleDataSet.refresh());

    context.webAPI
      .retrieveMultipleRecords(
        "workflow",
        `?$select=clientdata&$filter=category eq 4 and type eq 1 and  uniquename eq '${this._props.businessProcessName}'`
      )
      .then(w => {
        if (w.entities.length == 0) return;
        this._props.businessProcessStages = <IBusinessProcessStage[]>(
          JSONPath.query(
            JSON.parse(w.entities[0]["clientdata"]),
            "$.steps.list[*].steps.list[*].stepLabels.list[*]"
          )
        );
      });
  }

  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   */
  public updateView(context: ComponentFramework.Context<IInputs>): void {
    if (context.parameters.sampleDataSet.loading) return;
    this._context = context;
    this._props.totalResultCount =
      context.parameters.sampleDataSet.paging.totalResultCount;

    this._props.records = context.parameters.sampleDataSet.sortedRecordIds.map(
      r =>
        <IBPFRecord>{
          activeStageName: context.parameters.sampleDataSet.records[
            r
          ].getFormattedValue("bpfentity.activestageid"),
          activeStageId: (<ComponentFramework.EntityReference>(
            context.parameters.sampleDataSet.records[r].getValue(
              "bpfentity.activestageid"
            )
          )).id.guid,
          activeStageStartedOn: new Date(
            context.parameters.sampleDataSet.records[r]
              .getValue("bpfentity.activestagestartedon")
              .toString()
          ),
          createdBy: context.parameters.sampleDataSet.records[
            r
          ].getFormattedValue("bpfentity.createdby"),
          recordName: context.parameters.sampleDataSet.records[
            r
          ].getFormattedValue(`bpfentity.${this._bpfLinkingAttributeName}`),
          recordId: r
        }
    );
    console.log(this._props.records);
    ReactDOM.render(
      React.createElement(BusinessProcess, this._props),
      this._container
    );
  }

  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
   */
  public getOutputs(): IOutputs {
    return {};
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    // Add code to cleanup control if necessary
    ReactDOM.unmountComponentAtNode(this._container);
  }
}
