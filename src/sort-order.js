class SortOrder {
  /**
   * Creates a `sortOrder` array
   * @param {Object} columns - an array of columns from {@link TableColumns}
   * @param sortCallback - function that performs sorting based on the `sortOrder`
   * @param {Object} [defaultSorting] - an array of objects that specify default sorting
   * @param {Number} defaultSorting.column - column index
   * @param {String} defaultSorting.direction - sort direction (`asc`|`desc`)
   * @return {Array}
   * */
  constructor(columns, sortCallback, defaultSorting=[]){
    this.sortOrder = [];
    if(typeof columns != undefined && columns != null){
      this.columns = columns;
    } else {
      throw new TypeError('SortOrder: columns must be specified');
    }
    this.constructor.sort = sortCallback && typeof sortCallback === 'function'? sortCallback : function(){};
    if(defaultSorting.length>0){
      defaultSorting.forEach(item=>this.add(item));
      this.constructor.sort();
    }
  }

  /**
   * Returns an array containing a `cell` from the table and a reference cell (`refCell`) from the floating header if any
   * @param {!Number} columnIndex - index of the column from the array of columns from {@link TableColumns}
   * @return {[{cell:HTMLTableCellElement, ?refCell:HTMLTableCellElement}]}
   * */
  getCell(columnIndex){
    if(typeof columnIndex != 'undefined' && columnIndex!=null){
      let cells = [];
      if(this.columns[columnIndex].cell){cells.push(this.columns[columnIndex].cell)}
      if(this.columns[columnIndex].refCell){cells.push(this.columns[columnIndex].refCell)}
      return cells;
    } else {
      throw new TypeError('columnIndex parameter should not be null');
    }
  }

  /**
   * Adds another column to be sorted
   * @param {!Object} obj - object describing sorting
   * @param {Number} obj.column - column index
   * @param {String} obj.direction - sort direction (`asc`|`desc`)
   * */

  add (obj){
    this.getCell(obj.column).forEach(cell=>{
      //if(!cell.classList.contains('sorted')){ // this column is not sorted, there might be others that are.
        ['sorted',obj.direction].forEach(className=>cell.classList.add(className));
      //} else { //swaps sorting from asc to desc
      //  ['asc','desc'].forEach(className=>cell.classList.toggle(className));
      //}
    });
    this.sortOrder.push(obj);
  }

  /**
   * Removes a column from `sortOrder`
   * @param {Number} column - column index as reference to the item to be removed.
   * @param {Number} index - index of item in `sortOrder` array to be removed
   * */
  remove (column,index){
    ['sorted','asc','desc'].forEach(className=>{
      this.getCell(column).forEach(cell=>cell.classList.remove(className))
    });
    this.sortOrder.splice(index,1);
  };

  /**
   * Replaces all items in `sortOrder`
   * @param {!Object} obj - object describing sorting
   * @param {Number} obj.column - column index
   * @param {String} obj.direction - sort direction (`asc`|`desc`)
   * */
  replace (obj){
    if(this.sortOrder.length>0){
      this.sortOrder.forEach((item,index)=>{
        this.remove(item.column,index);
      });
    }
    this.add(obj);
    this.constructor.sort();
  };
  //static sort(){}
}
export default SortOrder;
