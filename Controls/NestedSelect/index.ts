import { IInputs, IOutputs } from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
import * as React from "react";
import * as ReactDom from "react-dom";
import { ContextualMenu } from "@fluentui/react";
import { INestedSelectorProps, NestedSelector } from "./NestedSelector";
import { arrayToTree } from 'performant-array-to-tree';
// type DataSet = ComponentFramework.PropertyTypes.DataSet;

// type OptionSet = ComponentFramework.PropertyTypes.OptionSetProperty;
type OptionMetadata = ComponentFramework.PropertyHelper.OptionMetadata;

declare var Xrm: any;

export class NestedSelect implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _container: HTMLDivElement;
	private _contextObj: ComponentFramework.Context<IInputs>;
	private _notifyOutputChanged: () => void;
	private _props: INestedSelectorProps;

	// Div element created as part of this control's main container
	private mainContainer: HTMLSelectElement;
	private errorElement: HTMLDivElement;
	private selectedItems: string[] = [];
	private allItems: any[];
	// private filteredItems: any[];

	private _onFilterClickCheck: string;
	// private _filterField: OptionSet;
	private _filterFieldValue: number;
	private _filterOptions: Array<OptionMetadata>;

	// private overlayDiv: HTMLDivElement;
	// private container: HTMLDivElement;
	private _isValidState: boolean = true;

	// private _relData : NToNData;

	// private _linkedEntityName: string;
	// private _relationshipEntity: string;
	// private _relationshipName: string;
	// private _idAttribute: string;
	// private _nameAttribute: string;
	// private _linkedEntityFetchXmlResource: string;

	private _linkedEntityCollectionName: string;
	private _mainEntityCollectionName: string;

	private _entityMetadataSuccessCallback: any;
	private _linkedEntityMetadataSuccessCallback: any;
	private _relationshipSuccessCallback: any;
	private _successCallback: any;

	private _ctrlId: string;


	/**
	 * Empty constructor.
	 */
	constructor() {

	}

	private renderGrid() {
		if (this.allItems.length > 0) {
			if (this._contextObj.parameters.filterField != null) {
				this._filterFieldValue = this._contextObj.parameters.filterField.raw!;
			} else {
				this._filterFieldValue = 0;
			}

			// if (this._contextObj.parameters.filterField.attributes) {
			// 	this._filterOptions = this._contextObj.parameters.filterField.attributes?.Options!;
			// }

			// const selectedSet = this._filterOptions.filter(val => val.Value === this._filterFieldValue)[0];
			// 	this.filteredItems = this.allItems.filter(ai => ai.data.av_name === selectedSet.Label);

			this._props = {
				// dataset: this._contextObj.parameters.dataset,
				context: this._contextObj,
				allBaseItems: this.allItems,
				selectedFilter: "Customer" //selectedSet.Label
				// allItems: this.allItems,
				// filteredItems: this.filteredItems
			}

			const element: React.ReactElement<INestedSelectorProps> = React.createElement(
				NestedSelector, this._props);

			ReactDom.render(element, this._container);

			// ReactDom.render(React.createElement(NestedSelector, props), this._container);
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
		this._container = container;
		this._contextObj = context;
		this._notifyOutputChanged = notifyOutputChanged;

		if (typeof Xrm == 'undefined') {
			this.errorElement = document.createElement("div");
			this.errorElement.innerHTML = "<H2>This control only works on model-driven forms!</H2>";
			container.appendChild(this.errorElement);
			this._isValidState = false;
		}
		else {
			context.mode.trackContainerResize(true);

			this._entityMetadataSuccessCallback = this.entityMetadataSuccessCallback.bind(this);
			this._linkedEntityMetadataSuccessCallback = this.linkedEntityMetadataSuccessCallback.bind(this);
			this._relationshipSuccessCallback = this.relationshipSuccessCallback.bind(this);
			this._successCallback = this.successCallback.bind(this);

			this._notifyOutputChanged = notifyOutputChanged;

			(<any>Xrm).Utility.getEntityMetadata((<any>this._contextObj).page.entityTypeName, []).then(this._entityMetadataSuccessCallback, this.errorCallback);
			(<any>Xrm).Utility.getEntityMetadata("av_companytype", []).then(this._linkedEntityMetadataSuccessCallback, this.errorCallback);
			//(<any>Xrm).WebApi.retrieveMultipleRecords(this._relationshipEntity, "?$filter="+ (<any>this.contextObj).page.entityTypeName+"id eq " + (<any>this.contextObj).page.entityId, 5000).then(this._relationshipSuccessCallback, this.errorCallback);

			if ((<any>this._contextObj).page.entityId != null
				&& (<any>this._contextObj).page.entityId != "00000000-0000-0000-0000-000000000000") {
				this._contextObj.webAPI.retrieveMultipleRecords("av_account_av_companytype", "?$filter=" + (<any>this._contextObj).page.entityTypeName + "id eq " + (<any>this._contextObj).page.entityId, 5000).then(this._relationshipSuccessCallback, this.errorCallback);
			}
			else {
				this.relationshipSuccessCallback(null);
			}

			// 	var thisVar: any;
			// 	thisVar = this;
		}
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		console.log(context.updatedProperties);
		console.log('view change');
		this.renderGrid();
		// // Add code to update control view
		// this._props = {
		// 	context: this._contextObj,
		// 	allItems: this.allItems,
		// 	selectedFilter: this._filterFieldValue
		// };

		// ReactDom.render(React.createElement(NestedSelector, this._props), this._container);
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
		ReactDom.unmountComponentAtNode(this._container);
		// ReactDOM.unmountComponentAtNode(this._container);
	}

	public entityMetadataSuccessCallback(value: any): void | PromiseLike<void> {
		this._mainEntityCollectionName = value.EntitySetName;
	}

	public linkedEntityMetadataSuccessCallback(value: any): void | PromiseLike<void> {
		this._linkedEntityCollectionName = value.EntitySetName;
	}

	public addOptions(value: any) {
		for (const i in value.entities) {
			const current: any = value.entities[i];
			const checked = this.selectedItems.indexOf(<string>current["av_companytypeid"]) > -1;

			current["selected"] = checked;
		}

		const result: any[] = [];
		const itemMap = (e: any) => {
			result.push({
				name: e.av_name,
				id: e.av_companytypeid,
				parentId: e._av_parent_value,
				selected: e.selected
			});
		}

		value.entities.map(itemMap);

		const testtest = arrayToTree(result, {
			id: 'id',
			parentId: 'parentId',
			childrenField: 'children'
		});

		console.log(testtest);
		this.allItems = testtest;
		
		// const convertedItems = arrayToTree(value.entities, {
		// 	id: 'av_companytypeid',
		// 	parentId: '_av_parent_value',
		// 	childrenField: 'children',
		// });

		// const result: ListItem[] = [];
		// const itemMap = (e: any) => {
		// 	let allChildren: ListItem[] = [];
		// 	if (e.children.length > 0) {
		// 		allChildren = e.children.forEach(itemMap);
		// 	}

		// 	result.push({
		// 		name: e.data.av_name,
		// 		id: e.data.av_companytypeid,
		// 		selected: e.data.selected
		// 	});
		// }

		// convertedItems.forEach(itemMap);

		// this.allItems = result;
		
		// this.allItems = convertedItems.map((item) => {
		// 	var childrenCount = item.children.length;
		// 	let children: ListItem[] = [];

		// 	if (childrenCount > 0) {

		// 	}

		// 	return {
		// 		name: item.av_name,
		// 		children: children,
		// 		id: item.av_companytypeid,
		// 		selected: item.selected
		// 	}
		// })

		// const columns = Object.keys(items[0])
//   .slice(0, 3)
//   .map(
//     (key: string): IColumn => ({
//       key: key,
//       name: key,
//       fieldName: key,
//       minWidth: 300,
//     }),
//   );

		this.renderGrid();
	}

	public successCallback(value: any): void | PromiseLike<void> {
		this.addOptions(value);
	}


	public relationshipSuccessCallback(value: any): void | PromiseLike<void> {
		if (value != null) {
			for (const i in value.entities) {
				this.selectedItems.push(value.entities[i]["av_companytypeid"]);
			}
		}

		this._contextObj.webAPI.retrieveMultipleRecords("av_companytype", "?$orderby=" + "av_name" + " asc", 5000).then(this._successCallback, this.errorCallback);
	}

	public errorCallback(value: any) {
		console.log(value);
		alert(value);
	}
}