/**
 * Created by IvanP on 09.09.2016.
 */

import TableColumns from '../table-columns';

describe('TableColumns.getHeader', () => {
  const query = "key1=val1&key2=val2";
  it('should return first key from query', () => {
    const val1 = ReportalBase.getQueryVariable('key1',query);
    expect(val1).toBe('val1');
  });
});
