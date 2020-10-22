import * as React from 'react';
import { IInputs } from './generated/ManifestTypes';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';

// declare var Xrm: any;

export interface INestedSelectorProps {
  context: ComponentFramework.Context<IInputs>;
  allBaseItems: any[];
  selectedFilter: string;
}

let _context: ComponentFramework.Context<IInputs>;

function NestedSelector2({context, allBaseItems, selectedFilter}: INestedSelectorProps) {
  _context = context;

  const useStyles = makeStyles({
    root: {
      // height: 216,
      flexGrow: 1,
      // maxWidth: 400,
    },
  });

  const [expanded, setExpanded] = React.useState<string[]>([]);
  const [selected, setSelected] = React.useState<string[]>([]);

  const handleToggle = (event: React.ChangeEvent<{}>, nodeIds: string[]) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event: React.ChangeEvent<{}>, nodeIds: string[]) => {
    setSelected(nodeIds);
  };

  const [allItems, setAllItems] = React.useState(allBaseItems);
  React.useEffect(() => {
    setAllItems(allBaseItems);
  }, [allBaseItems]);

  const [filteredItems, setFilteredItems] = React.useState(allItems);
  React.useEffect(() => {
    setFilteredItems(allItems.filter(ai => ai.data.av_name === selectedFilter)[0].children);
  }, [selectedFilter])

  const getTreeItemsFromData = (treeItems: any[]) => {
    return treeItems.map(treeItemData => {
      let children = undefined;
      if (treeItemData.children && treeItemData.children.length > 0) {
        children = getTreeItemsFromData(treeItemData.children);
      }
      return (
        <TreeItem
          key={treeItemData.data.av_companytypeid}
          nodeId={treeItemData.data.av_companytypeid}
          label={treeItemData.data.av_name}
          children={children}
        />
      );
    });
  };

  const classes = useStyles();

  console.log(allItems);
  console.log(filteredItems);

  return (
    <div>
      <TreeView
        className={classes.root}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={expanded}
        selected={selected}
        multiSelect
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
      >
        {getTreeItemsFromData(filteredItems)}
        <TreeItem nodeId="1" label="Applications">
          <TreeItem nodeId="2" label="Calendar" />
          <TreeItem nodeId="3" label="Chrome" />
          <TreeItem nodeId="4" label="Webstorm" />
        </TreeItem>
        <TreeItem nodeId="5" label="Documents">
          <TreeItem nodeId="6" label="Material-UI">
            <TreeItem nodeId="7" label="src">
              <TreeItem nodeId="8" label="index.js" />
              <TreeItem nodeId="9" label="tree-view.js" />
            </TreeItem>
          </TreeItem>
        </TreeItem>
      </TreeView>
    </div>
  );
}

export default NestedSelector2;


// const onRenderCell = (nestingDepth?: number, item?: IExampleItem, itemIndex?: number): React.ReactNode => {
//   return item && typeof itemIndex === 'number' && itemIndex > -1 ? (
//     <DetailsRow
//       columns={columns}
//       groupNestingDepth={nestingDepth}
//       item={item}
//       itemIndex={itemIndex}
//       selection={selection}
//       selectionMode={SelectionMode.multiple}
//       compact={isCompactMode}
//     />
//   ) : null;
// };
// export const NestedSelector = React.memo(function NestedSelectApp({
//   context, allBaseItems, selectedFilter
// }: INestedSelectorProps): JSX.Element {
//   _context = context;

//   const [allItems, setAllItems] = React.useState(allBaseItems);
//   React.useEffect(() => {
//     setAllItems(allBaseItems);
//   }, [allBaseItems]);

//   const [filteredItems, setFilteredItems] = React.useState(allItems);
//   React.useEffect(() => {
//     setFilteredItems(allItems.filter(ai => ai.data.av_name === selectedFilter));
//   }, [selectedFilter])

//   const useStyles = makeStyles({
//     root: {
//       height: 216,
//       flexGrow: 1,
//       maxWidth: 400,
//     },
//   });

//   const [expanded, setExpanded] = React.useState<string[]>([]);
//   const [selected, setSelected] = React.useState<string[]>([]);

//   const handleToggle = (event: React.ChangeEvent<{}>, nodeIds: string[]) => {
//     setExpanded(nodeIds);
//   };

//   const handleSelect = (event: React.ChangeEvent<{}>, nodeIds: string[]) => {
//     setSelected(nodeIds);
//   };

//   const classes = useStyles();
//   // console.log(filteredItems);

//   return (
//     <div>
//       <TreeView
//       className={classes.root}
//       defaultCollapseIcon={<ExpandMoreIcon />}
//       defaultExpandIcon={<ChevronRightIcon />}
//       expanded={expanded}
//       selected={selected}
//       onNodeToggle={handleToggle}
//       onNodeSelect={handleSelect}
//     >
//       <TreeItem nodeId="1" label="Applications">
//         <TreeItem nodeId="2" label="Calendar" />
//         <TreeItem nodeId="3" label="Chrome" />
//         <TreeItem nodeId="4" label="Webstorm" />
//       </TreeItem>
//       <TreeItem nodeId="5" label="Documents">
//         <TreeItem nodeId="6" label="Material-UI">
//           <TreeItem nodeId="7" label="src">
//             <TreeItem nodeId="8" label="index.js" />
//             <TreeItem nodeId="9" label="tree-view.js" />
//           </TreeItem>
//         </TreeItem>
//       </TreeItem>
//     </TreeView>
//     </div>
//   );
// }
// );
