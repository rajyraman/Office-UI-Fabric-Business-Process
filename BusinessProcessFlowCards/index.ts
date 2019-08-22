import { IInputs, IOutputs } from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;
import { BusinessProcess, IBusinessProcessProps } from "./BusinessProcess";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as JSONPath from "jsonpath";

export class BusinessProcessFlowCards
  implements ComponentFramework.StandardControl<IInputs, IOutputs> {
  private _container: HTMLDivElement;
  private _context: ComponentFramework.Context<IInputs>;
  private _props: IBusinessProcessProps = {
    businessProcessName: "",
    businessProcessStages: []
  };

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
  }

  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   */
  public updateView(context: ComponentFramework.Context<IInputs>): void {
    if (context.parameters.sampleDataSet.loading) return;
    this._context = context;

    this._props.businessProcessName =
      context.parameters.businessProcessName.raw;
    
    context.webAPI
      .retrieveMultipleRecords(
        "workflow",
        `?$select=clientdata&$filter=category eq 4 and type eq 1 and  uniquename eq '${
          this._props.businessProcessName
        }'`
      )
      .then(w => {
        console.log(w);
        if (w.entities.length == 0) return;
        this._props.businessProcessStages = JSONPath.query(
          w.entities[0]["clientdata"],
          "$.steps.list[*].steps.list[*].stepLabels.list[*].description"
        );
        console.log(this._props.businessProcessStages);
      });

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
