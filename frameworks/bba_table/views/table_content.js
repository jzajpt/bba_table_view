// ==========================================================================
// Project:   BBA.TableContentView
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals BBA */

/** @class

  A table row view renders a columns inside itself.

  @extends SC.View
*/
BBA.TableContentView = SC.ListView.extend(
  /** @scope BBA.prototype */ {

  classNames: "table-content-view".w(),

  tableView: SC.outlet('parentView.parentView.parentView'),

  content: SC.outlet('parentView.parentView.parentView.content'),

  columns: SC.outlet('parentView.parentView.parentView.columns'),

  /**
    The view class to use when creating new rows.
  */
  exampleView: BBA.TableRowView,


});
