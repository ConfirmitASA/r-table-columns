/**
 * Created by IvanP on 07.09.2016.
 */
import TableColumns from "./table-columns";
import ReportalBase from "r-reportal-base";

window.Reportal = window.Reportal || {};
ReportalBase.mixin(window.Reportal,{
  TableColumns,
});

export default TableColumns;
