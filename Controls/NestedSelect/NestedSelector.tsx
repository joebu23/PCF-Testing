import * as React from 'react';
import { useEffect, useState } from 'react';
import { GroupedList } from 'office-ui-fabric-react/lib/GroupedList';
import { IColumn, DetailsRow, IObjectWithKey } from 'office-ui-fabric-react/lib/DetailsList';
import { Selection, SelectionMode, SelectionZone } from 'office-ui-fabric-react/lib/Selection';
import { Toggle, IToggleStyles } from 'office-ui-fabric-react/lib/Toggle';
import { useBoolean, useConst } from '@uifabric/react-hooks';
import { createListItems, createGroups, IExampleItem } from '@uifabric/example-data';
import { IInputs } from './generated/ManifestTypes';
import { ISelection } from '@fluentui/react';

export interface INestedSelectorProps {
    context: ComponentFramework.Context<IInputs>;
}

const toggleStyles: Partial<IToggleStyles> = { root: { marginBottom: '20px' } };

const groupCount = 3;
const groupDepth = 5;
const items = createListItems(Math.pow(groupCount, groupDepth + 1));


const columns = Object.keys(items[0])
  .slice(0, 3)
  .map(
    (key: string): IColumn => ({
      key: key,
      name: key,
      fieldName: key,
      minWidth: 300,
    }),
  );

const groups = createGroups(groupCount, groupDepth, 0, groupCount);

export const NestedSelector = React.memo(function NestedSelectApp({
    context
} : INestedSelectorProps) : JSX.Element {
    console.log(context);
      const [isCompactMode, { toggle: toggleIsCompactMode }] = useBoolean(false);
        const selection = useConst(() => {
        const s = new Selection();
            s.setItems(items, true);
            return s;
        });

        const onRenderCell = (nestingDepth?: number, item?: IExampleItem, itemIndex?: number): React.ReactNode => {
            return item && typeof itemIndex === 'number' && itemIndex > -1 ? (
                <DetailsRow
                    columns={columns}
                    groupNestingDepth={nestingDepth}
                    item={item}
                    itemIndex={itemIndex}
                    selection={selection}
                    selectionMode={SelectionMode.multiple}
                    compact={isCompactMode}
                />
            ) : null;
        };

        console.log(selection);

        return (
            <div>
                <Toggle
                    label="Enable compact mode"
                    checked={isCompactMode}
                    onChange={toggleIsCompactMode}
                    onText="Compact"
                    offText="Normal"
                    styles={toggleStyles}
                />
                <SelectionZone selection={selection} selectionMode={SelectionMode.multiple}>
                    <GroupedList
                        items={items}
                        // eslint-disable-next-line react/jsx-no-bind
                        onRenderCell={onRenderCell}
                        selection={selection}
                        selectionMode={SelectionMode.multiple}
                        groups={groups}
                        compact={isCompactMode}
                    />
                </SelectionZone>
            </div>
        );
    }
);



// type DataSet = ComponentFramework.PropertyTypes.DataSet;
// type OptionMetadata = ComponentFramework.PropertyHelper.OptionMetadata;
// declare var Xrm: any;

// const toggleStyles: Partial<IToggleStyles> = { root: { marginBottom: '20px' } };

// const groupCount = 3;
// const groupDepth = 3;
// const items = createListItems(Math.pow(groupCount, groupDepth + 1));
// const columns = Object.keys(items[0])
//     .slice(0, 3)
//     .map(
//         (key: string): IColumn => ({
//             key: key,
//             name: key,
//             fieldName: key,
//             minWidth: 300,
//         }),
//     );

// const groups = createGroups(groupCount, groupDepth, 0, groupCount);


// // const selection = useConst(() => {
// //     const s = new Selection();
// //     s.setItems(items, true);
// //     return s;
// // });

// function useSelection() {
//     // const [selection, setItems] = useState(null);

//     const selection = useConst(() => {
//         const s = new Selection();
//         s.setItems(items, true);
//         return s;
//     });

//     return selection;
//     // function handleSelectionChange(selectionId: string) {
//     //   setItems(selectionId);
//     // }

//     // useEffect(() => {

//     //   ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
//     //   return () => {
//     //     ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
//     //   };
//     // });

//     // return isOnline;
// }

// export class NestedSelector extends React.Component<INestedSelectorProps> {
//     private _properties: any;
//     private _context: any; // ComponentFramework.Context<IInputs>;

//     private _successCallback: any;
//     private _relationshipSuccessCallback: any;

//     // private selection: Selection<IObjectWithKey>;


//     constructor(props: INestedSelectorProps) {
//         super(props);
//         this._properties = props;
//         this._context = this._properties.context;

//         this.state = {
//             allItems: [],
//             filteredItems: [],
//             selectedItems: []
//         }

//         console.log(this.props);


//     }

//     public getData() {
//         this._context.webAPI.retrieveMultipleRecords("av_account_av_companytype", "?$filter=" + this._context.page.entityTypeName + "id eq " + this._context.page.entityId, 5000).then(this._relationshipSuccessCallback, this.errorCallback);
//     }

//     public relationshipSuccessCallback(value: any): void | PromiseLike<void> {
//         if (value != null) {
//             for (var i in value.entities) {
//                 // this.selectedItems.push(value.entities[i]["av_companytypeid"]);
//             }
//         }

//         this._context.webAPI.retrieveMultipleRecords("av_companytype", "?$orderby=" + "av_name" + " asc", 5000).then(this._successCallback, this.errorCallback);
//     }

//     public errorCallback(value: any) {
//         console.log(value);
//         alert(value);
//     }

//     public addOptions(value: any) {
//         // for (var i in value.entities) {
//         // 	var current: any = value.entities[i];
//         // 	var checked = this.selectedItems.indexOf(<string>current["av_companytypeid"]) > -1;

//         // 	current["selected"] = checked;
//         // }

//         // this.allItems = arrayToTree(value.entities, {
//         // 	id: 'av_companytypeid',
//         // 	parentId: '_av_parent_value',
//         // 	childrenField: 'children',
//         // });

//         // this.renderGrid();
//     }


//     public successCallback(value: any): void {
//         // this.addOptions(value);
//     }

//     // public getSelection(): Selection<IObjectWithKey> {
//     //     const selection = useConst(() => {
//     //         const s = new Selection();
//     //         s.setItems(items, true);
//     //         return s;
//     //     });

//     //     return selection;
//     // }

//     // public useSelection() {
//     //     const selection = useConst(() => {
//     //         const s = new Selection();
//     //         s.setItems(items, true);
//     //         return s;
//     //     });

//     //     return selection;
//     // }





//     // public render(): React.ReactElement<INestedSelectorProps> {
//     public view: React.FunctionComponent = () => {
//         const isCompactMode = true;

//         // const selection = useConst(() => {
//         //     const s = new Selection();
//         //     s.setItems(items, true);
//         //     return s;
//         // });
//         // let selection: ISelection<IObjectWithKey>; // = new ISelection<IObjectWithKey>;
//         const selection = useSelection();

//         const onRenderCell = (nestingDepth?: number, item?: IExampleItem, itemIndex?: number): React.ReactNode => {
//             return item && typeof itemIndex === 'number' && itemIndex > -1 ? (
//                 <DetailsRow
//                     columns={columns}
//                     groupNestingDepth={nestingDepth}
//                     item={item}
//                     itemIndex={itemIndex}
//                     selection={selection}
//                     selectionMode={SelectionMode.multiple}
//                     compact={isCompactMode}
//                 />
//             ) : null;
//         };

//         return (
//             <div>
//                 <SelectionZone selection={selection} selectionMode={SelectionMode.multiple}>
//                     <GroupedList
//                         items={items}
//                         // eslint-disable-next-line react/jsx-no-bind
//                         onRenderCell={onRenderCell}
//                         selection={selection}
//                         selectionMode={SelectionMode.multiple}
//                         groups={groups}
//                         compact={isCompactMode}
//                     />
//                 </SelectionZone>
//             </div>
//         );
//     }
// }
// // export const NestedSelector = React.memo(function NestedSelectApp({
// //     context
// // }: INestedSelectorProps): JSX.Element {
// //     const isCompactMode = true;

// //     const selection = useConst(() => {
// //         const s = new Selection();
// //         s.setItems(items, true);
// //         return s;
// //     });

// //     console.log(items);
// //     console.log(columns);
// //     console.log(selection);

// //     const onRenderCell = (nestingDepth?: number, item?: IExampleItem, itemIndex?: number): React.ReactNode => {
// //         return item && typeof itemIndex === 'number' && itemIndex > -1 ? (
// //             <DetailsRow
// //                 columns={columns}
// //                 groupNestingDepth={nestingDepth}
// //                 item={item}
// //                 itemIndex={itemIndex}
// //                 selection={selection}
// //                 selectionMode={SelectionMode.multiple}
// //                 compact={isCompactMode}
// //             />
// //         ) : null;
// //     };

// //     return (
// //         <div>
// //             <SelectionZone selection={selection} selectionMode={SelectionMode.multiple}>
// //                 <GroupedList
// //                     items={items}
// //                     // eslint-disable-next-line react/jsx-no-bind
// //                     onRenderCell={onRenderCell}
// //                     selection={selection}
// //                     selectionMode={SelectionMode.multiple}
// //                     groups={groups}
// //                     compact={isCompactMode}
// //                 />
// //             </SelectionZone>
// //         </div>
// //     );
// // }
// // );
