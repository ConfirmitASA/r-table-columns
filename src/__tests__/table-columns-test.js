/**
 * Created by IvanP on 09.09.2016.
 */

import TableColumns from '../table-columns';

describe('TableColumns', () => {
  beforeEach(()=>{
    jasmine.getFixtures().fixturesPath = 'base/src/__tests__/fixtures';
    loadFixtures('table-nested-headers.html');
  });

  it('fixture should exist', () => {
    expect($j('#confirmit_agg_table')).toExist();
  });

  describe('TableColumns.getDefaultHeaderRow',()=>{
    it('should return an object with index (Number) and a row ( last TR element)',()=>{
      let dhr = TableColumns.getDefaultHeaderRow($j('#confirmit_agg_table thead')[0],-1);
      expect(dhr.index).toEqual(1);
      expect(dhr.row).toEqual('#confirmit_agg_table>thead>tr:last-child');
      expect(dhr.row).toEqual('#confirmit_agg_table>thead>tr:nth-child(2)');
    });
    it('should return an object with index (Number) and a row ( last TR element)',()=>{
      let dhr = TableColumns.getDefaultHeaderRow($j('#confirmit_agg_table thead')[0],0);
      expect(dhr.index).toEqual(0);
      expect(dhr.row).toEqual('#confirmit_agg_table>thead>tr:first-child');
    });
  });


  describe('TableColumns.getHeader',()=>{
    it('should return a header element', () => {
      expect(TableColumns.getHeader($j('#confirmit_agg_table')[0])).toEqual('#confirmit_agg_table thead');
    });
    it('should throw an error if a table isn\'t passed or is not a table', () => {
      expect(()=>TableColumns.getHeader()).toThrow();
      expect(()=>TableColumns.getHeader($j('<div> not a table </div>')[0])).toThrow();
    });
    it('should throw an error if header isn\'t present in the table', () => {
      expect(()=>TableColumns.getHeader($j('<table><tbody><tr><td>no header</td></tr></tbody></table>')[0])).toThrow();
    });
    it('should throw an error if header has no children', () => {
      let table = $j('<table><thead></thead><tbody><tr><td>no children in header</td></tr></tbody></table>')[0];
      expect(()=>TableColumns.getHeader(table)).toThrow();
    });
  });

  describe('TableColumns.getHeaderCells',()=>{
    it('should return null if no header is passed',()=>{
      expect(TableColumns.getHeaderCells()).toBeNull();
    });
    it('should return an array of 17 cells from last row',()=>{
      let hc = TableColumns.getHeaderCells($j('#confirmit_agg_table thead')[0],-1);
      expect(hc.length).toEqual(17);
    });
    it('should return an array of 10 cells from first row',()=>{
      let hc = TableColumns.getHeaderCells($j('#confirmit_agg_table thead')[0],0);
      expect(hc.length).toEqual(10);
    });
    it('should throw an error if defaultHeaderRowIndex is null',()=>{
      expect(()=>TableColumns.getHeaderCells($j('#confirmit_agg_table thead')[0])).toThrow();
    });
  });

  describe('TableColumns.computeColumns',()=>{
    it('should not throw',()=>{
      let thead = $j('#confirmit_agg_table thead')[0];
      let refThead = $j('#confirmit_agg_table thead')[0]; // not to create another table
      expect(()=>TableColumns.computeColumns(thead, refThead, -1)).not.toThrow();
    });
    it('should be an array and contain 17 children',()=>{
      let thead = $j('#confirmit_agg_table thead')[0];
      let refThead = $j('#confirmit_agg_table thead')[0]; // not to create another table
      let columns = TableColumns.computeColumns(thead, refThead, -1);
      expect(Array.isArray(columns)).toBe(true);
      expect(columns.length).toEqual(17);
    });
    it('array item should contain 4 properties',()=>{
      let thead = $j('#confirmit_agg_table thead')[0];
      let refThead = $j('#confirmit_agg_table thead')[0]; // not to create another table
      let column = TableColumns.computeColumns(thead, refThead, -1)[14];
      expect(column.index).toBeDefined();
      expect(typeof column.index).toEqual('number');
      expect(column.cell).toBeDefined();
      expect(column.cell.tagName).toEqual('TD');
      expect(column.colSpan).toBeDefined();
      expect(typeof column.colSpan).toEqual('number');
      expect(column.refCell).toBeDefined();
      expect(column.refCell.tagName).toEqual('TD');
    });
    it('array item should not contain refCell',()=>{
      let thead = $j('#confirmit_agg_table thead')[0];
      let column = TableColumns.computeColumns(thead, null, -1)[14];
      expect(column.refCell).not.toBeDefined();
    });
  });
  describe('TableColumns.constructor',()=>{
    it('should not trow',()=>{
      let source = $j('#confirmit_agg_table')[0];
      let refSource = $j('#confirmit_agg_table')[0]; // not to create another table
      expect(()=>new TableColumns({source, refSource, defaultHeaderRow:-1})).not.toThrow();
      expect(()=>new TableColumns({refSource, defaultHeaderRow:-1})).toThrow();
    });
    it('should be equal to computeColumns\' result',()=>{
      let thead = $j('#confirmit_agg_table thead')[0];
      let refThead = $j('#confirmit_agg_table thead')[0]; // not to create another table
      let source = $j('#confirmit_agg_table')[0];
      let refSource = $j('#confirmit_agg_table')[0]; // not to create another table
      expect(TableColumns.computeColumns(thead, refThead, -1)).toEqual(new TableColumns({source, refSource, defaultHeaderRow:-1}));
      expect(TableColumns.computeColumns(thead, null, -1)).toEqual(new TableColumns({source, defaultHeaderRow:-1}));
    });
    it('should be equal to computeColumns\' result when defaultHeaderRow is blank',()=>{
      let thead = $j('#confirmit_agg_table thead')[0];
      let refThead = $j('#confirmit_agg_table thead')[0]; // not to create another table
      let source = $j('#confirmit_agg_table')[0];
      let refSource = $j('#confirmit_agg_table')[0]; // not to create another table
      expect(TableColumns.computeColumns(thead, refThead, -1)).toEqual(new TableColumns({source, refSource}));
      expect(TableColumns.computeColumns(thead, null, -1)).not.toEqual(new TableColumns({source, defaultHeaderRow:0}));
    });
  });
});
