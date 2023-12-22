// test //
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDom from "react-dom";
import NestedSelector, { INestedSelectorProps } from "./NestedSelector";
import { arrayToTree } from 'performant-array-to-tree';

declare var Xrm: any;

export class NestedSelect implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _container: HTMLDivElement;
	private _contextObj: ComponentFramework.Context<IInputs>;
	private _notifyOutputChanged: () => void;
	private _isValidState: boolean;

	// Div element created as part of this control's main container
	private errorElement: HTMLDivElement;
	private _selectedItems: string[] = [];
	private _allItemsNested: any[];
	private _allItemsFlat: any[];
	private _clientUrl: string;
	// private filteredItems: any[];

	private _entityMetadataSuccessCallback: any;
	private _linkedEntityMetadataSuccessCallback: any;
	private _relationshipSuccessCallback: any;
	private _successCallback: any;

	private _mainEntity: string;
    private _relatedEntity: string;
    private _relationshipEntity: string;
    private _relatedFieldId: string;
    private _relatedParentIdField: string;
	private _relatedFieldName: string;
	private _inputFieldName: string;

	/**
	 * Empty constructor.
	 */
	constructor() {

	}

	private renderGrid() {
		if (this._allItemsFlat.length > 0) {
			const props: INestedSelectorProps = {
				context: this._contextObj,
				allBaseItemsNested: this._allItemsNested,
				allBaseItemsFlat: this._allItemsFlat,
				selectedFilter: this._contextObj.parameters.filterField.formatted || "",
				selectedItems: this._selectedItems,
				clientUrl: this._clientUrl,
				mainEntityName: this._mainEntity,
				relatedEntityName: this._relatedEntity,
				relationshipName: this._relationshipEntity,
				relatedEntityIdFieldName: this._relatedFieldId,
				relatedEntityNameFieldName: this._relatedFieldName,
				relatedEntityParentFieldName: this._relatedParentIdField,
				inputFieldName: this._inputFieldName
			};
			
			const element: React.ReactElement = React.createElement(NestedSelector, props);
			ReactDom.render(element, this._container);
		} else {
			console.log("Have no data");
		}
	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
		this._mainEntity = context.parameters.mainEntity.raw!;
		this._relatedEntity = context.parameters.relatedEntity.raw!;
		this._relationshipEntity = context.parameters.relationshipEntity.raw!;
		this._relatedFieldId = context.parameters.relatedFieldId.raw!;
		this._relatedParentIdField = context.parameters.relatedParentIdField.raw!;
		this._relatedFieldName = context.parameters.relatedFieldName.raw!;
		this._inputFieldName = context.parameters.inputField.attributes!.LogicalName;

		this._container = container;
		this._contextObj = context;
		this._clientUrl = (<any>Xrm).Utility.getGlobalContext().getClientUrl();

		this._notifyOutputChanged = notifyOutputChanged;

		if (typeof Xrm == 'undefined') {
			this.errorElement = document.createElement("div");
			this.errorElement.innerHTML = "<H2>This control only works on model-driven forms!</H2>";
			this._container.appendChild(this.errorElement);
			this._isValidState = false;
		}
		else {
			context.mode.trackContainerResize(true);
			this._relationshipSuccessCallback = this.relationshipSuccessCallback.bind(this);
			this._successCallback = this.successCallback.bind(this);

			(<any>Xrm).Utility.getEntityMetadata((<any>this._contextObj).page.entityTypeName, []).then(this._entityMetadataSuccessCallback, this.errorCallback);
			(<any>Xrm).Utility.getEntityMetadata(this._relatedEntity, []).then(this._linkedEntityMetadataSuccessCallback, this.errorCallback);

			if ((<any>this._contextObj).page.entityId != null
				&& (<any>this._contextObj).page.entityId != "00000000-0000-0000-0000-000000000000") {
				this._contextObj.webAPI.retrieveMultipleRecords(this._relationshipEntity, "?$filter=" + (<any>this._contextObj).page.entityTypeName + "id eq " + (<any>this._contextObj).page.entityId, 5000).then(this._relationshipSuccessCallback, this.errorCallback);
			}
			else {
				this.relationshipSuccessCallback(null);
			}
		}
	}

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		this.renderGrid();
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
		ReactDom.unmountComponentAtNode(this._container);
	}

	public addOptions(value: any) {
		this._allItemsFlat = value.entities;
		this._allItemsNested = arrayToTree(value.entities, {
			id: this._relatedFieldId,
			parentId: this._relatedParentIdField,
			childrenField: 'children',
		});

		this.renderGrid();
	}

	public successCallback(value: any): void | PromiseLike<void> {
		this.addOptions(value);
	}


	public relationshipSuccessCallback(value: any): void | PromiseLike<void> {
		if (value != null) {
			for (const i in value.entities) {
				this._selectedItems.push(value.entities[i][this._relatedFieldId]);
			}
		}

		this._contextObj.webAPI.retrieveMultipleRecords(this._relatedEntity, "?$orderby=" + this._relatedFieldName + " asc", 5000).then(this._successCallback, this.errorCallback);
	}

	public errorCallback(value: any) {
		console.log(value);
		alert(value);
	}
}
