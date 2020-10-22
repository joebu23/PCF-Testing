import * as React from 'react';
import { IInputs } from './generated/ManifestTypes';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';

export interface INestedSelectorProps {
  context: ComponentFramework.Context<IInputs>;
  allBaseItemsNested: any[];
  allBaseItemsFlat: any[];
  selectedFilter: string;
  selectedItems: string[]
}

let _context: ComponentFramework.Context<IInputs>;

function NestedSelector2({context, allBaseItemsNested, allBaseItemsFlat, selectedFilter, selectedItems}: INestedSelectorProps) {
  _context = context;

  const useStyles = makeStyles({
    root: {
      flexGrow: 1
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

  const [allItems, setAllItems] = React.useState(allBaseItemsNested);
  React.useEffect(() => {
    setAllItems(allBaseItemsNested);
    
  }, [allBaseItemsNested]);

  const [filteredItems, setFilteredItems] = React.useState(allItems);
  React.useEffect(() => {
    setFilteredItems(allItems.filter(ai => ai.data.av_name === selectedFilter)[0].children);

    setSelected(selectedItems);
    let itemsToExpand: string[] = [];

    // expand the tree so you can see everyone's pretty face
    selectedItems.forEach((item) => {
      let parentThere: boolean = true;
      let idToFind: string = item;
      while(parentThere == true) {
        const childObject = allBaseItemsFlat.filter(fi => fi.av_companytypeid === idToFind)[0];

        if (childObject) {
          const parentObject = allBaseItemsFlat.filter(po => po.av_companytypeid === childObject._av_parent_value)[0];

          if (parentObject) {
            if (selectedItems.indexOf(parentObject.av_companytypeid) == -1) {
              itemsToExpand.push(parentObject.av_companytypeid);
            }

            idToFind = parentObject.av_companytypeid;
          } else {
            parentThere = false;
          }
        } else {
          parentThere = false;
        }
      }
    });

    setExpanded(itemsToExpand);
    
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
      </TreeView>
    </div>
  );
}

export default NestedSelector2;
