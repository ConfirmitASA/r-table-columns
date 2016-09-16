/**
 * Created by IvanP on 09.09.2016.
 */

class TableColumns{
  /**
   * Creates an array of objects corresponding to the cells of `defaultHeaderRow`, that contain `sortable` property, denoting the column is sortable,
   * `index` of the column and reference to the `cell`. Adds `.sortable` to a sortable cell
   * @param {Object} options - options passed to configure the Sorting
   * @param {HTMLTableElement} options.source - source table sorting will be applied to
   * @param {HTMLTableElement} options.refSource - floating header if any
   * @param {Number|Object} [options.defaultHeaderRow=-1] - index of the row in `thead` (incremented from 0) that will have sorting enabled for columns. If `-1` then last row.
   * @return {{index:Number, title:String, colSpan:Number, cell: HTMLTableCellElement, ?refCell:HTMLTableCellElement}} - an array of objects that have this structure
   * */
  constructor(options){
    let {source,refSource,defaultHeaderRow=-1} = options;
    let thead,refThead;
    if(source){thead=TableColumns.getHeader(source)} else {throw new TypeError('`source` table is not specified, cannot create TableColumns')}
    if(refSource){refThead=TableColumns.getHeader(refSource)}
    return TableColumns.computeColumns(thead,refThead,defaultHeaderRow);
  }

  /**
   * Gets a header
   * @param {HTMLTableElement} source - source table headers are created for
   * */
  static getHeader(source){
    if(source && source.tagName == 'TABLE'){
      let header = source.querySelector("thead");
      if(header && header.children.length>0) {
        return header;
      } else {
        throw new TypeError('`source` table has no header or rows');
      }
    } else {
      throw new TypeError('`source` is not specified or is not a table');
    }
  }

  /**
   * Calculates defaultHeaderRow for a passed `thead`
   * @param {!HTMLTableElement} thead - source table header
   * @param {!Number} defaultHeaderRowIndex - index of the row in `thead` (incremented from 0) that will be considered default to have actions executed upon.
   * @return {{index:Number, row: HTMLTableRowElement}}
   * */
  static getDefaultHeaderRow(thead,defaultHeaderRowIndex){
    // calculate default header row
    let headerRows = thead.children,
      headerRowIndex = defaultHeaderRowIndex==-1 ? headerRows.length + defaultHeaderRowIndex : defaultHeaderRowIndex;
    return {
      index:headerRowIndex,
      row:headerRows.item(headerRowIndex)
    };
  }

  /**
   * Gets an array of header cell nodes from default header row
   * @param {?HTMLTableElement} thead - source table header
   * @param {!Number} defaultHeaderRowIndex - index of the row in `thead` (incremented from 0) that will be considered default to have actions executed upon.
   * @return {?Array} Returns an array of header cell nodes or null if `thead` is not specified
   * */
  static getHeaderCells(thead,defaultHeaderRowIndex){
    if(thead){
      if(defaultHeaderRowIndex!=null){
        let defaultHeaderRow = TableColumns.getDefaultHeaderRow(thead,defaultHeaderRowIndex);
        let headerRows = thead.children;
        let rowsLength = headerRows.length;
        let abstr = {};
        for(let r=0;r<rowsLength;r++){
          let row = headerRows.item(r);
          let augmentIndex=0; // index that will account for colSpan of upper rows' cells
          [].slice.call(row.children).forEach((cell,index)=>{ //iterate through cells
            for(let rs=0; rs<=cell.rowSpan-1;rs++){ //spread cell across its rowspan
              let rowA = abstr[r+rs] = abstr[r+rs] || {}; //create row if not exists
              if(!rowA[augmentIndex]){ //insert cell into slot if not filled
                rowA[augmentIndex]=cell;
              } else { //if filled look for the next empty because rowspanned columns fill them in a linear way
                let i=0;
                while(true){
                  if(!rowA[i]){
                    rowA[i]=cell;
                    augmentIndex=i;
                    break;
                  }
                  i++;
                }
              }
            }
            augmentIndex+=cell.colSpan;
          })
        }
        return Object.keys(abstr[defaultHeaderRow.index]).map(k => abstr[defaultHeaderRow.index][k])
      } else {
        throw new TypeError('TableColumns.getHeaderCells: defaultHeaderRowIndex is not specified or is not a Number')
      }
    }
    return null
  }

  /**
   * Gets an array of columns from the table
   * @param {!HTMLTableElement} thead - source table header
   * @param {!HTMLTableElement} refThead - reference table header from floating header if any
   * @param {Number} defaultHeaderRowIndex - index of the row in `thead` (incremented from 0) that will be considered default to have actions executed upon.
   * @return {?Array} Returns an array of header cell nodes or null if `thead` is not specified
   * */
  static computeColumns(thead,refThead,defaultHeaderRowIndex){
    let theadCells = TableColumns.getHeaderCells(thead,defaultHeaderRowIndex);
    let refTheadCells = TableColumns.getHeaderCells(refThead,defaultHeaderRowIndex);
    let realColumnIndex=0;
    return theadCells.map((cell,index)=>{
      let obj = {
        index: realColumnIndex,
        title: cell.textContent,
        cell,
        colSpan:cell.colSpan
      };
      if(refTheadCells!=null){obj.refCell = refTheadCells[index]}
      // we need to increment the colspan only for columns that follow rowheader because the block is not in data.
      realColumnIndex= realColumnIndex>0?(realColumnIndex + cell.colSpan):realColumnIndex+1;
      return obj;
    });
  }
}
export default TableColumns;
