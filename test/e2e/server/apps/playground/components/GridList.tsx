import * as React from "react";

import { ListProps, ItemProps, FastClick } from "searchkit"

const block = require('bem-cn')

const map = require("lodash/map")
const includes = require("lodash/includes")
const defaults = require("lodash/defaults")
const identity = require("lodash/identity")


export interface GridListItemProps extends ItemProps {
  columnCount: number
}

export class GridListItem extends React.Component<GridListItemProps, {}> {
  render(){
    const {bemBlocks, onClick, active, label, count, showCount, columnCount} = this.props;
    const block = bemBlocks.option;
    const className = block()
                      .state({active})
                      .mix("grid-" + columnCount)
                      .mix(bemBlocks.container("item"));
    return (
      <FastClick handler={onClick}>
        <div className={className} data-qa="option">
          <div data-qa="label" className={block("text")}>{label}</div>
          {showCount ? <div data-qa="count" className={block("count")}>{count}</div> : undefined}
        </div>
      </FastClick>
    )
  }
}

export interface GridListProps extends ListProps {
  labelComponent?: any
  itemComponent?: any
  columnCount?: number
}

export class GridList extends React.Component<GridListProps, {}> {
  
  static defaultProps:any = {
    items: [],
    selectItems: [],
    mod: "sk-grid-list",
    showCount: true,
    itemComponent: GridListItem,
    translate:identity,
    multiselect: true,
    columnCount: 3,
  }

  isActive(option){
    const { selectedItems, multiselect } = this.props
    if (multiselect){
      return includes(selectedItems, option.key)
    } else {
      if (selectedItems.length == 0) return null
      return selectedItems[0] == option.key
    }
  }

  render() {
    const {
      mod, itemComponent, items, selectedItems = [], translate,
      toggleItem, setItems, multiselect, columnCount,
      disabled, showCount, className, docCount
    } = this.props
    console.log('itemComponent', itemComponent);

    const bemBlocks = {
      container: block(mod),
      option: block(`${mod}-option`)
    }

    const toggleFunc = multiselect ? toggleItem : (key => setItems([key]))

    const actions = map(items, (option) => {
      const label = option.title || option.label || option.key
      return React.createElement(itemComponent, {
        label: translate(label),
        onClick: () => toggleFunc(option.key),
        bemBlocks: bemBlocks,
        key: option.key,
        itemKey:option.key,
        count: option.doc_count,
        listDocCount: docCount,
        disabled:option.disabled,
        columnCount, showCount,
        active: this.isActive(option)
      })
    })
    return (
      <div data-qa="options" className={bemBlocks.container().mix(className).state({ disabled }) }>
        {actions}
      </div>
    )
  }
}

console.log("GridList", GridList.defaultProps)