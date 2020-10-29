import * as React from 'react';
import { IInputs } from './generated/ManifestTypes';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import { Checkbox, Typography } from '@material-ui/core';

export interface INestedSelectorProps {
  context: ComponentFramework.Context<IInputs>;
  allBaseItemsNested: any[];
  allBaseItemsFlat: any[];
  selectedFilter: string;
  selectedItems: string[];
  clientUrl: string;
  mainEntityName: string;
  relatedEntityName: string;
  relationshipName: string;
  relatedEntityIdFieldName: string;
  relatedEntityNameFieldName: string;
  relatedEntityParentFieldName: string;
}

function NestedSelector({
  context,
  allBaseItemsNested,
  allBaseItemsFlat,
  selectedFilter,
  selectedItems,
  clientUrl,
  mainEntityName,
  relatedEntityName,
  relationshipName,
  relatedEntityIdFieldName,
  relatedEntityNameFieldName,
  relatedEntityParentFieldName
}: INestedSelectorProps) {
  const useStyles = makeStyles({
    root: {
      flexGrow: 1
    },
    globalFilterCheckbox: {
      "font-face": "SegoeUI",
      "font-size": "14px"
    }
  });

  const [selected, setSelected] = React.useState<string[]>([]);
  const handleSelect = (event: React.ChangeEvent<{}>, nodeIds: string[]) => {
    setSelected(nodeIds);
  };

  const [allItems, setAllItems] = React.useState(allBaseItemsNested);
  React.useEffect(() => {
    setAllItems(allBaseItemsNested);
  }, [allBaseItemsNested]);

  const [filteredItems, setFilteredItems] = React.useState(allItems);
  React.useEffect(() => {
    setFilteredItems(allItems.filter(ai => ai.data[relatedEntityNameFieldName] === selectedFilter)[0].children);
    setSelected(selectedItems);
  }, [selectedFilter])

  const [markedAncestors, setAncestors] = React.useState(selected);
  React.useEffect(() => {
    let itemsToExpand: string[] = [];

    // expand the tree so you can see everyone's pretty face
    selected.forEach((item) => {
      let parentThere: boolean = true;
      let idToFind: string = item;
      while(parentThere == true) {
        const currentObject = allBaseItemsFlat.filter(fi => fi[relatedEntityIdFieldName] === idToFind)[0];

        if (currentObject) {
          const parentObject = allBaseItemsFlat.filter(po => po[relatedEntityIdFieldName] === currentObject[relatedEntityParentFieldName])[0];

          if (parentObject) {
            if (itemsToExpand.indexOf(parentObject[relatedEntityIdFieldName]) == -1) {
              itemsToExpand.push(parentObject[relatedEntityIdFieldName]);
            }

            idToFind = parentObject[relatedEntityIdFieldName];
          } else {
            parentThere = false;
          }
        } else {
          parentThere = false;
        }
      }
    });

    setAncestors(itemsToExpand);
  }, [selected])

  function getOnChange(checked: boolean, id: string) {
    let array = checked
      ? [...selected, id]
      : selected.filter(ai => ai !== id);

    setSelected(array);

    const recordUrl: string = clientUrl + "/api/data/v9.1/" + mainEntityName + "s(" + (context as any).page.entityId + ")";

    if (checked) {
      var associate = {
        "@odata.id": recordUrl
      };

      // add the item to the relationships
      let req = new XMLHttpRequest();
      req.open("POST", clientUrl + "/api/data/v9.1/" + relatedEntityName + "s(" + id + ")/" + relationshipName + "/$ref", true);
      req.setRequestHeader("Accept", "application/json");
      req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
      req.setRequestHeader("OData-MaxVersion", "4.0");
      req.setRequestHeader("OData-Version", "4.0");
      req.onreadystatechange = function () {
        if (this.readyState == 4 /* complete */) {
          req.onreadystatechange = null;
          if (this.status == 204) {
            //alert('Record Associated');
          } else {
            var error = JSON.parse(this.response).error;
            console.log(this.response);
            alert(error.message);
          }
        }
      };
      req.send(JSON.stringify(associate));
    } else {
      // remove the item from the relationships
      var req = new XMLHttpRequest();
      req.open("DELETE", clientUrl + "/api/data/v9.1/" + relatedEntityName + "s(" + id + ")/" + relationshipName + "/$ref" + "?$id=" + recordUrl, true);
      req.setRequestHeader("Accept", "application/json");
      req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
      req.setRequestHeader("OData-MaxVersion", "4.0");
      req.setRequestHeader("OData-Version", "4.0");
      req.onreadystatechange = function () {
        if (this.readyState == 4 /* complete */) {
          req.onreadystatechange = null;
          if (this.status == 204) {
            //alert('Record Disassociated');
          } else {
            var error = JSON.parse(this.response).error;
            alert(error.message);
          }
        }
      };
      req.send();
    }
  }

  const getTreeItemsFromData = (treeItems: any[]) => {
    return treeItems.map(treeItemData => {
      let children = undefined;
      if (treeItemData.children && treeItemData.children.length > 0) {
        children = getTreeItemsFromData(treeItemData.children);
      }

      return (
        <TreeItem
          key={treeItemData.data[relatedEntityIdFieldName]}
          nodeId={treeItemData.data[relatedEntityIdFieldName]}
          label={(
            <div style={{ display: 'flex', alignItems: 'center' }} className={markedAncestors.indexOf(treeItemData.data[relatedEntityIdFieldName]) > -1 ? 'parent' : 'noparent'}>
              <Checkbox
                id={`checkbox-${treeItemData.data[relatedEntityIdFieldName]}`}
                className={classes.globalFilterCheckbox}
                checked={selected.indexOf(treeItemData.data[relatedEntityIdFieldName]) > -1}
                onChange={(event) => getOnChange(event.currentTarget.checked, treeItemData.data[relatedEntityIdFieldName])}
                onClick={e => e.stopPropagation()}
                color="primary"
              />
              <Typography variant="inherit">{treeItemData.data[relatedEntityNameFieldName]}</Typography>
            </div>
          )}
          children={children}
        />
      );
    });
  };

  const classes = useStyles();

  return (
    <div>
      <TreeView
        className={classes.root}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        selected={selected}
        multiSelect
      >
        {getTreeItemsFromData(filteredItems)}
      </TreeView>
    </div>
  );
}

export default NestedSelector;
