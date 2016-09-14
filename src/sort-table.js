import ReportalBase from "r-reporal-base/src/reportal-base";
import TableColumns from "./table-columns";
import SortOrder from "./sort-order";


class SortTable {
  /**
   * Makes a table sortable, gives API for sorting. It sorts `data` array, but doesn't move rows in the `source` table, because of differences in implementation
   * @param {Object} options - options passed to configure the Sorting
   * @param {Boolean} options.enabled=false - enables sorting on a header of a table
   * @param {HTMLTableElement} options.source - source table sorting will be applied to
   * @param {HTMLTableElement} [options.refSource] - the floating header if any, will reflect and trigger sorting on header when scrolled.
   * @param {Number} [options.defaultHeaderRow=-1] - index of the row in `thead` (incremented from 0) that will have sorting enabled for columns. If `-1` then last row.
   * @param {Array} [options.columns] - Array of column indices (incremented from 0) that will have sorting enabled. If not specified, all columns will be sortable. Optionally `excludedColumns` can be specified instead as a shorthand to pass only indices of columns to be excluded from sorting, assumning that others will be made sortable. It's important to count the column index in the defaultHeaderRow
   * @param {Array} [options.excludedColumns] - Array of column indices (incremented from 0) that will be excluded from sorting. Can be used as a shorthand instead of `columns`.
   * @param {Object} [options.defaultSorting] - an array of objects that specify default sorting
   * @param {Number} options.defaultSorting.column - column index
   * @param {String} options.defaultSorting.direction - sort direction (`asc`|`desc`)
   * @param {Array} options.data - data with information for rows to be sorted
   * */

  constructor(options){
    let {enabled=false,source,refSource,defaultHeaderRow=-1,columns,excludedColumns,defaultSorting=[],data=[]}=options;
    this._sortEvent = ReportalBase.newEvent('reportal-table-sort');

    this.enabled=enabled;
    if(source){
      this.source=source;
    } else {
      throw new Error('`source` table is not specified for SortTable');
    }

    this.data = data;

    //let tableColumns= new TableColumns({source, refSource, defaultHeaderRow});
    // setup sort order and do initial default sorting
    let sortableColumns=SortTable.defineSortableColumns(new TableColumns({source, refSource, defaultHeaderRow}), columns, excludedColumns);
    [source,refSource].forEach(src=>SortTable.listenForSort(TableColumns.getHeader(src),sortableColumns));// set up listeners for headers
    this.sortOrder = new SortOrder(sortableColumns, SortTable.sort, defaultSorting);

    SortTable.sort(); //initial sorting if any
  }


  //{index:Number, title:String, colSpan:Number, cell: HTMLTableCellElement, ?refCell:HTMLTableCellElement}
  static defineSortableColumns(columns, included, excluded){
    return columns.map((column,index)=>{
      let sortable = (!(included && included.indexOf(column.cell.cellIndex)==-1) || (excluded && excluded.indexOf(index)==-1)); // is in columns and not in excluded,
      if(sortable){
        column.cell.classList.add('sortable');
        column.sortable = true;
      }
    })
  }

  /**
   * sets up listeners for column headers available for click
   * @param {HTMLElement} delegatedTarget - element that will receive clicks and see if they are valid, `thead` is recommended to boil down to header clicks only
   * @param {Array} columns - array of table columns from {@link SortTable#defineSortableColumns}
   * @listens click
   * */
  static listenForSort(delegatedTarget, columns){
    delegatedTarget.addEventListener('click',e=>{
      if((e.target.tagName == 'TD' || e.target.tagName == 'TH') && columns.filter(col=>col.sortable).map(function(col){return col.column;}).indexOf(e.target)>-1){
        this.constructor.updateSortOrder(e.target);
      }
    })
  }


  /**
   * Performs sorting. Can sort two columns if `sortOrder` has two items, the first of which has priority.
   * @return {Event} - `reportal-table-sort` event
   * */
  static sort(){
    if(this.sortOrder && this.sortOrder.length>0){
      this.data.forEach((block,index,array)=>{
        block.sort((a, b)=>{ // sort rows
          if(this.sortOrder.length>1){
            return this.constructor.sorter(a[this.columns[this.sortOrder[0].column].index],b[this.columns[this.sortOrder[0].column].index], this.sortOrder[0].direction === 'desc' ? -1 : 1) || this.constructor.sorter(a[this.columns[this.sortOrder[1].column].index],b[this.columns[this.sortOrder[1].column].index], this.sortOrder[1].direction === 'desc' ? -1 : 1)
          } else {
            return this.constructor.sorter(a[this.columns[this.sortOrder[0].column].index],b[this.columns[this.sortOrder[0].column].index], this.sortOrder[0].direction === 'desc' ? -1 : 1);
          }
        });
      });
      this.columns[this.sortOrder[0].column].cell.dispatchEvent(this._sortEvent);
    }
  }

  /**
   * Updates `sortOrder` with the clicked cell
   * @param {HTMLTableCellElement} cell - the cell that was clicked
   * */
  static updateSortOrder(cell){
    if(!cell.classList.contains('sorted')){ // this column is not sorted, there might be others that are.
      this.sortOrder.replace({column:cell.cellIndex, direction: 'asc'});
    } else { //swaps sorting from asc to desc
      this.sortOrder.replace({column:cell.cellIndex, direction: cell.classList.contains('asc')?'desc':'asc'});
    }
  }

  /**
   * Function that performs case insensitive sorting in the array. It can distinguish between numbers, numbers as strings, HTML and plain strings
   * */
  static sorter(a,b,lesser){
    //let x = a[idx],y = b[idx];
    let regex = /[<>]/g;
    if(regex.test(a) || regex.test(b)){ // if we need to sort elements that have HTML like links
      let tempEl1 = document.createElement('span'); tempEl1.innerHTML = a;
      a=tempEl1.textContent.trim();
      let tempEl2 = document.createElement('span'); tempEl2.innerHTML = b;
      b=tempEl2.textContent.trim();
    }
    if(!isNaN(a) && !isNaN(b)){//they might be numbers or null
      if(a===null){return 1} else if(b===null){return -1}
      return a <  b ? lesser :  a >  b ? -lesser : 0;
    }
    else if(!isNaN(parseFloat(a)) && !isNaN(parseFloat(b))){ // they might be number strings
      return parseFloat(a) <  parseFloat(b) ? lesser :  parseFloat(a) >  parseFloat(b) ? -lesser : 0;
    } else { //they might be simple strings
      return a.toLowerCase() < b.toLowerCase() ? lesser : a.toLowerCase() > b.toLowerCase() ? -lesser : 0;
    }
  }

}

export default SortTable
