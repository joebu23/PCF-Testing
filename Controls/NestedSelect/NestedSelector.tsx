import * as React from 'react';
import { IInputs } from './generated/ManifestTypes';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import { Checkbox, FormControlLabel, Typography } from '@material-ui/core';
import { unstable_renderSubtreeIntoContainer } from 'react-dom';
import { ChildFriendlyOutlined } from '@material-ui/icons';
import { AnyRecord } from 'dns';

export interface INestedSelectorProps {
  context: ComponentFramework.Context<IInputs>;
  allBaseItemsNested: any[];
  allBaseItemsFlat: any[];
  selectedFilter: string;
  selectedItems: string[];
  clientUrl: string;
}

// let _context: ComponentFramework.Context<IInputs>;
// let _allItems: any[];
// let _clientUrl: string;

function NestedSelector2({ context, allBaseItemsNested, allBaseItemsFlat, selectedFilter, selectedItems, clientUrl }: INestedSelectorProps) {
  // _context = context;
  // _allItems = allBaseItemsNested;
  // _clientUrl = clientUrl;

  const useStyles = makeStyles({
    root: {
      flexGrow: 1
    },
    globalFilterCheckbox: {
      "font-face": "SegoeUI",
      "font-size": "14px"
    }
  });

  // const [expanded, setExpanded] = React.useState<string[]>([]);
  const [selected, setSelected] = React.useState<string[]>([]);

  // const handleToggle = (event: React.ChangeEvent<{}>, nodeIds: string[]) => {
  //   console.log("Toggle changed");
  //   console.log(nodeIds);
  //   setExpanded(nodeIds);
  // };

  const handleSelect = (event: React.ChangeEvent<{}>, nodeIds: string[]) => {
    console.log("Select changed");
    console.log(nodeIds);
    setSelected(nodeIds);
  };

  const [allItems, setAllItems] = React.useState(allBaseItemsNested);
  React.useEffect(() => {
    console.log("set all items changed");
    setAllItems(allBaseItemsNested);

  }, [allBaseItemsNested]);

  const [filteredItems, setFilteredItems] = React.useState(allItems);
  React.useEffect(() => {
    console.log("set filtered items changed");
    setFilteredItems(allItems.filter(ai => ai.data.av_name === selectedFilter)[0].children);

    setSelected(selectedItems);
    let itemsToExpand: string[] = [];

    // expand the tree so you can see everyone's pretty face
    selectedItems.forEach((item) => {
      let parentThere: boolean = true;
      let idToFind: string = item;
      while (parentThere == true) {
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

    // setExpanded(itemsToExpand);

  }, [selectedFilter])

  function getOnChange(checked: boolean, id: string) {
    console.log("getonchange 'cause you clicked it");
    let array = checked
      ? [...selected, id]
      : selected.filter(ai => ai !== id);

    setSelected(array);
  }

  const getTreeItemsFromData = (treeItems: any[]) => {
    console.log("tree render");
    console.log(selected)
    return treeItems.map(treeItemData => {
      let children = undefined;
      if (treeItemData.children && treeItemData.children.length > 0) {
        children = getTreeItemsFromData(treeItemData.children);
      }
      return (
        <TreeItem
          key={treeItemData.data.av_companytypeid}
          nodeId={treeItemData.data.av_companytypeid}
          label={(
            <div style={{ display: 'flex', alignItems: 'center' }} className={(treeItemData.children.filter((el: { data: { av_companytypeid: string; }; }) => selected.includes(el.data.av_companytypeid))).length > 0 ? 'should' : 'shouldnot'}>
              <Checkbox
                id={`checkbox-${treeItemData.data.av_companytypeid}`}
                className={classes.globalFilterCheckbox}
                checked={selected.indexOf(treeItemData.data.av_companytypeid) > -1}//selected.some((item) => item === treeItemData.data.av_companytypeid)}
                onChange={(event) => getOnChange(event.currentTarget.checked, treeItemData.data.av_companytypeid)}
                onClick={e => e.stopPropagation()}
                color="primary"
              />
              <Typography variant="inherit">{treeItemData.data.av_name}</Typography>
            </div>
          )}
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
        // expanded={expanded}
        // defaultExpanded={selected}
        selected={selected}
        multiSelect
        // onNodeToggle={handleToggle}
        // onNodeSelect={handleSelect}
      >
        {getTreeItemsFromData(filteredItems)}
      </TreeView>
    </div>
  );
}

export default NestedSelector2;


// const checkBoxClicked = (event: any, checked: any, id: any) => {
  //   console.log("Click Change");
  //   console.log(event);
  //   console.log(checked);
  //   console.log(id);

  //   // const url: string = (Xrm as any).Utility.getGlobalContext().getClientUrl();
  //   // const recordUrl: string = _clientUrl + "/api/data/v9.1/" + "account" + "(" + (_context as any).page.entityId + ")";

  //   if (selected.indexOf(id) > -1) { // the item is there so we will remove it
  //     selected.slice(selected.indexOf(id), 1);
  //     setSelected(selected);
  //     // _context.webAPI.deleteRecord("av_account_av_companytype", id)

  //     // var disassociateRequest = {
  //     //   getMetadata: () => ({
  //     //     boundParameter: null,
  //     //     parameterTypes: {},
  //     //     operationType: 2,
  //     //     operationName: "Disassociate"
  //     //   }),

  //     //   relationship: "av_account_av_companytype",

  //     //   target: {
  //     //     entityType: "account",
  //     //     id: (_context as any).page.entityId
  //     //   },

  //     //   relatedEntityId: id
  //     // };

  //     // (context as any).webAPI.execute(disassociateRequest).then((result: any) => {
  //     //   console.log(result);
  //     //   setExpanded(selected);
  //     // });
  //   } else { // the item ISN'T there so we will add it.....fancy!!!!
  //     selected.push(id);
  //     setSelected(selected);

  //     // let req = new XMLHttpRequest();
  //     // req.open("POST", _clientUrl + "/api/data/v9.1/" + "av_companytypes" + "(" + id + ")/" + "av_account_av_companytype" + "/$ref", true);
  //     // req.setRequestHeader("Accept", "application/json");
  //     // req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  //     // req.setRequestHeader("OData-MaxVersion", "4.0");
  //     // req.setRequestHeader("OData-Version", "4.0");
  //     // req.onreadystatechange = function () {
  //     //   if (this.readyState == 4 /* complete */) {
  //     //     req.onreadystatechange = null;
  //     //     if (this.status == 204) {
  //     //       //alert('Record Associated');
  //     //     } else {
  //     //       var error = JSON.parse(this.response).error;
  //     //       console.log(this.response);
  //     //       alert(error.message);
  //     //     }
  //     //   }
  //     // };
  //     // req.send(JSON.stringify(recordUrl));

  //     // var associateRequest = {
  //     //   getMetadata: () => ({
  //     //     boundParameter: null,
  //     //     parameterTypes: {},
  //     //     operationType: 2,
  //     //     operationName: "Associate"
  //     //   }),

  //     //   relationship: "av_account_av_companytype",

  //     //   target: {
  //     //     entityType: "account",
  //     //     id: (_context as any).page.entityId
  //     //   },

  //     //   relatedEntityId: id
  //     // };

  //     // (context as any).webAPI.execute(associateRequest).then((result: any) => {
  //     //   console.log(result);
  //     //   setExpanded(selected);
  //     // });
  //   }
  // };