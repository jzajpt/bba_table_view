// ==========================================================================
// Project:   BBA.TableHeaderView
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals BBA */

/** @class

  A table header view. Renders a column headers and handles column selection.

  @extends SC.View
*/
BBA.TableHeaderView = SC.View.extend(
  /** @scope BBA.prototype */ {

  classNames: "table-header-view".w(),

  /**
    A reference to the header encompassing TableView.

    @type BBA.TableView
  */
  tableView: SC.outlet('parentView'),

  // ..........................................................
  // SUBCLASS METHODS
  //

  /**
    Setup header cells from table view's columns.
  */
  createChildViews: function() {
    var childViews = [],
        columns    = this.getPath('tableView.columns'),
        len        = columns.get('length'),
        idx, column;
    this.beginPropertyChanges();
    for (idx=0; idx<len; ++idx) {
      childViews.push(this._createHeaderCellForColumn(columns[idx], idx));
    }
    this.set('childViews', childViews);
    this.endPropertyChanges();
    return this;
  },

  // ..........................................................
  // METHODS
  //

  /**
    Update of row cell widths. Called by parent TableView
    whenever any of column width changes.
  */
  updateColumnWidths: function() {
    var childViews = this.get('childViews'),
        columns    = this.getPath('tableView.columns'),
        idx, view;
    for (idx=0; idx<childViews.get('length'); ++idx) {
      view = childViews[idx];
      view.adjust(this.get('tableView').cellLayoutForColumn(columns[idx], idx));
    }
  },

  // ..........................................................
  // PRIVATE METHODS
  //

  /** @private */
  _createHeaderCellForColumn: function(column, index) {
    var attributes = this._headerCellAttributesForColumn(column, index);
    return this.createChildView(BBA.TableHeaderCellView, attributes);
  },

  /** @private */
  _headerCellAttributesForColumn: function(column, index) {
    var layout = this.get('tableView').cellLayoutForColumn(column, index);
    return {
      layout: layout,
      title: column.get('title'),
      column: column
    };
  }

}) ;

