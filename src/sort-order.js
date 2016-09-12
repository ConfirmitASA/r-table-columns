class SortOrder {
  /**
   * Creates a `sortOrder` array with static functions `add`,`remove`,`replace`
   * @param {Object} columns - an array of columns from {@link TableColumns}
   * @param sortCallback - function that performs sorting based on the `sortOrder`
   * @param {Object} defaultSorting - an array of objects that specify default sorting
   * @param {Number} defaultSorting.column - column index
   * @param {String} defaultSorting.direction - sort direction (`asc`|`desc`)
   * @return {Array}
   * */

  constructor(columns, sortCallback, defaultSorting){
    this.sortOrder = [];
    this.columns = columns;
    if(defaultSorting.length>0){
      defaultSorting.forEach(item=>this.constructor.add(item));
    }
    this.constructor.sort = sortCallback && typeof sortCallback === 'function'? sortCallback : function(){};

    return this.sortOrder;
  }

  static getCell(column){
    let cells = [];
    if(this.columns[column].cell){cells.push(this.columns[column].cell)}
    if(this.columns[column].refCell){cells.push(this.columns[column].refCell)}
    return cells;
  }

  /**
   * Adds another column to be sorted
   * @param {!Object} obj - object describing sorting
   * @param {Number} obj.column - column index
   * @param {String} obj.direction - sort direction (`asc`|`desc`)
   * */

  static add (obj){
    this.constructor.getCell(obj.column).forEach(cell=>{
      if(!cell.classList.contains('sorted')){ // this column is not sorted, there might be others that are.
        ['sorted',obj.direction].forEach(className=>cell.classList.add(className));
      } else { //swaps sorting from asc to desc
        ['asc','desc'].forEach(className=>cell.classList.toggle(className));
      }
    });
    this.sortOrder.push(obj);
  }

  /**
   * Removes a column from `sortOrder`
   * @param {Number} column - column index as reference to the item to be removed.
   * @param {Number} index - index of item in `sortOrder` array to be removed
   * */
  static remove (column,index){
    ['sorted','asc','desc'].forEach(className=>{
      this.constructor.getCell(column).forEach(cell=>cell.classList.remove(className))
    });
    this.sortOrder.splice(index,1);
  };

  /**
   * Replaces all items in `sortOrder`
   * @param {!Object} obj - object describing sorting
   * @param {Number} obj.column - column index
   * @param {String} obj.direction - sort direction (`asc`|`desc`)
   * */
  static replace (obj){
    if(this.sortOrder.length>0){
      this.sortOrder.forEach((item,index)=>{
        this.constructor.remove(item.column,index);
      });
    }
    this.constructor.add(obj);
    this.constructor.sort();
  };
}
export default SortOrder;
