import SortOrder from '../sort-order';
import TableColumns from '../table-columns';

const columns = [{
    index:0,
    title: "Column1",
    colSpan:1,
    cell: document.createElement('td'),
    refCell: document.createElement('td')
  },
  {
    index:1,
    title: "Column2",
    colSpan:2,
    cell: document.createElement('td'),
    refCell: document.createElement('td')
  },
  {
    index:2,
    title: "Column3",
    colSpan:1,
    cell: document.createElement('td'),
    refCell: document.createElement('td')
  }];

describe('SortOrder.getCell', () => {
  it('parameter should not be null', () => {
    expect(()=>SortOrder.getCell()).toThrow();
  });
});
