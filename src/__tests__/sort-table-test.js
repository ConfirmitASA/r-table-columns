/**
 * Created by IvanP on 15.09.2016.
 */
import SortOrder from '../sort-order';
import SortTable from '../sort-table';
import TableColumns from '../table-columns';
import ReportalBase from "r-reporal-base/src/reportal-base";


describe('SortTable', () => {
  var columns, spy, so = {column:1, direction: 'asc'};
  beforeEach(()=>{
    jasmine.getFixtures().fixturesPath = 'base/src/__tests__/fixtures';
    loadFixtures('table-nested-headers.html');
    columns = new TableColumns({source:$j('#confirmit_agg_table')[0],refSource:$j('#confirmit_agg_table')[0]});
    spy={
      callback:function(){}
    };
    spyOn(spy,'callback');

  });

  describe('SortTable.defineSortableColumns',()=>{
    var sortableColumns, included, excluded;
    it('should return an array with all columns being sortable',()=>{
      sortableColumns = SortTable.defineSortableColumns(columns, included, excluded);
      expect(sortableColumns.length).toEqual(columns.length);
      expect(sortableColumns.filter(cell=>cell.sortable==true).length).toEqual(columns.length);
      sortableColumns.forEach(column=>{
        expect($j(column.cell)).toBeMatchedBy('.sortable');
        if(column.refCell)expect($j(column.refCell)).toBeMatchedBy('.sortable');
      });
    });
    it('should accept included array and make sortable only those',()=>{
      included = [0,1];
      sortableColumns = SortTable.defineSortableColumns(columns, included, excluded);
      let sortable = sortableColumns.filter(cell=>cell.sortable==true);
      expect(sortable.length).toEqual(2);
      sortable.forEach((column,index)=>{
        expect($j(column.cell)).toBeMatchedBy('.sortable');
        expect(column.index).toEqual(index);
        if(column.refCell){expect($j(column.refCell)).toBeMatchedBy('.sortable');}
      });

      let not_sortable = sortableColumns.filter(cell=>!cell.sortable);
      expect(not_sortable.length).toEqual(columns.length-sortable.length);
      not_sortable.forEach((column,index)=>{
        expect($j(column.cell)).not.toBeMatchedBy('.sortable');
        if(column.refCell){expect($j(column.refCell)).not.toBeMatchedBy('.sortable');}
      });
    });
    it('should accept excluded array and not to make sortable only those',()=>{
      excluded = [0,1];
      sortableColumns = SortTable.defineSortableColumns(columns, included, excluded);
      let sortable = sortableColumns.filter(cell=>cell.sortable==true);
      let not_sortable = sortableColumns.filter(cell=>!cell.sortable);
      expect(not_sortable.length).toEqual(2);
      expect(sortable.length).toEqual(columns.length-not_sortable.length);
      sortable.forEach((column,index)=>{
        expect($j(column.cell)).toBeMatchedBy('.sortable');
        expect(column.index).toEqual(index);
        if(column.refCell){expect($j(column.refCell)).toBeMatchedBy('.sortable');}
      });

      not_sortable.forEach((column,index)=>{
        expect($j(column.cell)).not.toBeMatchedBy('.sortable');
        if(column.refCell){expect($j(column.refCell)).not.toBeMatchedBy('.sortable');}
      });
    });
  });

  xdescribe('SortTable.sortDimension',()=> {


  });

  });
