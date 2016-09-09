/**
 * Created by IvanP on 09.09.2016.
 */

class TableColumns{
  /**
   * Creates an array of objects corresponding to the cells of `defaultHeaderRow`, that contain `sortable` property, denoting the column is sortable,
   * `index` of the column and reference to the `cell`. Adds `.sortable` to a sortable cell
   * @param {Object} options - options passed to configure the Sorting
   * @param {HTMLTableElement} options.source - source table sorting will be applied to
   * @param {Number|Object} [options.defaultHeaderRow=-1] - index of the row in `thead` (incremented from 0) that will have sorting enabled for columns. If `-1` then last row.
   * @return {{sortable:Boolean, index:Number, cell: HTMLTableCellElement}} - an array of objects that have this structure
   * */
  constructor(options){
    let {source, defaultHeaderRow=-1} = options;
    let thead;
    if(source){
      thead=this.constructor.getHeader(source);
    } else {
      throw new Error('`source` table is not specified, cannot create TableColumns');
    }
    const headerRow = typeof defaultHeaderRow === 'object'? defaultHeaderRow : this.constructor.getDefaultHeaderRow(thead,defaultHeaderRow);
    return this.constructor.computeColumns(thead, headerRow);
  }

  /**
   * Gets a header
   * @param {HTMLTableElement} source - source table headers are created for
   * */
  static getHeader(source){
    let header = source.parentNode.querySelector("table#${source.id}>thead");
    if(!header || header.children.length==0){
      throw new Error('`source` table has no header or rows');
    }
  }

  /**
   * Calculates defaultHeaderRow
   * @param {HTMLTableElement} thead - source table header
   * @param {Number} defaultHeaderRow - index of the row in `thead` (incremented from 0) that will be considered default to have actions executed upon.
   * */
  static getDefaultHeaderRow(thead, defaultHeaderRow){
    // calculate default header row
    let headerRows = thead.children,
        //auxHeaderRows = auxHeader?auxHeader.querySelector('thead').children:null,
        headerRowIndex = defaultHeaderRow==-1?headerRows.length+defaultHeaderRow:defaultHeaderRow;
    return {
      index:headerRowIndex,
      row:headerRows.item(headerRowIndex),
      //auxRow:auxHeaderRows?auxHeaderRows.item(headerRowIndex):null
    };
  }

  static computeColumns(thead, defaultHeaderRow){
    var headerRows = thead.children;
    let headerColumns = [].slice.call(defaultHeaderRow.row.children);
    // if there is more than one row in header and if the first header has a cell with rowspan, add it to the array as a data item
    if(headerRows.length>1 && headerRows.item(0).children.item(0).rowSpan>1){
      headerColumns.unshift(headerRows.item(0).children.item(0));
    }
    let realColumnIndex=0;
    return headerColumns.map((cell,index)=>{
      let obj = {
        index: realColumnIndex,
        title: cell.textContent,
        HTMLElement: cell,
        colSpan:cell.colSpan,
        //auxCell: auxCell
      };
      // we need to increment the colspan only for columns that follow rowheader because the block is not in data.
      realColumnIndex= realColumnIndex>0?(realColumnIndex + cell.colSpan):realColumnIndex+1;
      return obj;
    });
  }

  /*setupColumns1(columns,excluded){
    var headerRows = this.source.querySelector('thead').children;
    if(headerRows.length==0){console.warn(`Sorting is impossible because table#${source.id} doesn't have headers`);return;}
    let headerColumns = [].slice.call(this.defaultHeaderRow.row.children);
    if(headerRows.length>1 && headerRows.item(0).children.item(0).rowSpan>1){ // if there is more than one row in header and if the first header has a cell with rowspan, add it to the array
      headerColumns.unshift(headerRows.item(0).children.item(0));
    }
    if(this.defaultHeaderRow.auxRow){
      var auxHeaderRows = this.defaultHeaderRow.auxRow.parentNode.children;
      var auxHeaderColumns = [].slice.call(this.defaultHeaderRow.auxRow.children);
      if(headerRows.length>1 && headerRows.item(0).children.item(0).rowSpan>1){
        auxHeaderColumns.unshift(auxHeaderRows.item(0).children.item(0));
      }
    }
    var realColumnIndex=0;
    return headerColumns.map((cell,index)=>{
      let sortable = (!(columns && columns.indexOf(cell.cellIndex)==-1) || (excluded && excluded.indexOf(index)==-1)); // is in columns and not in excluded,
      if(sortable){
        cell.addEventListener('click',(el)=>{
          if(el.target.localName =='td'||el.target.localName =='th'){this.updateSorting(el.target);} //we want to capture click on the cell and not buttons in it
        });
        cell.classList.add('sortable');
        if(auxHeaderColumns){
          var auxCell = auxHeaderColumns[index];
          auxCell.addEventListener('click',(el)=>{
            if(el.target.localName =='td'||el.target.localName =='th'){this.updateSorting(el.target);} //we want to capture click on the cell and not buttons in it
          });
          auxCell.classList.add('sortable');
        }
      }
      let _sorted = null,
        self = this;
      var obj = {
        sortable:sortable,
        get sorted(){return _sorted},
        set sorted(val){
          _sorted = val;
          if(val){
            this.cell.classList.add('sorted');
            this.auxCell?this.auxCell.classList.add('sorted'):null;
          } else {
            this.cell.classList.remove('sorted','asc','desc');
            this.auxCell?this.auxCell.classList.remove('sorted','asc','desc'):null;
          }
        },
        index: realColumnIndex,
        cell: cell,
        auxCell: auxCell
      };
      // we need to increment the colspan only for columns that follow rowheader because the block is not in data.
      realColumnIndex= realColumnIndex>0?(realColumnIndex + cell.colSpan):realColumnIndex+1;
      return obj;
    });
  }*/


}
export default TableColumns
