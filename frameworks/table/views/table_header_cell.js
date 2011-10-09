// ==========================================================================
// Project:   BBA.TableHeaderCellView
// Copyright: ©2011 Blueberry.cz Apps s.r.o.
// ==========================================================================
/*globals BBA */

sc_require('views/table_column');

/** @class


  @extends SC.View
*/
BBA.TableHeaderCellView = SC.View.extend(
  /** @scope BBA.TableHeaderCellView.prototype */ {

  classNames: "table-header-cell-view".w(),

  childViews: "titleView sortDirectionView handleView".w(),

  displayProperties: "isSelected".w(),

  isSelected: NO,

  /**
    A reference to the header encompassing TableView.

    @type BBA.TableView
  */
  tableView: SC.outlet('parentView.tableView'),

  /**
    Displays column header title.
  */
  titleView: SC.LabelView.design({
    layout: { top: 0, left: 3, bottom: 0, right: 14 },
    value: SC.outlet('parentView.title')
  }),

  /**
    Displays current sort order.
  */
  sortDirectionView: SC.View.design({
    classNames: "table-header-sort-view".w(),
    layout: { centerY: 0, right: 5, width: 7, height: 9 }
  }),

  /**
    A handle for resizing column.
  */
  handleView: SC.View.design({
    classNames: "table-header-handle-view".w(),
    layout: { top: 0, right: 0, bottom: 0, width: 3 },
    mouseDown: function(evt) {
      this._parentView = this.get('parentView');
      this._column = this._parentView.get('column');
      this._column.set('isFlexible', NO);
      this._lastPageX = evt.pageX;
      return YES; // We want receive drag
    },
    mouseDragged: function(evt) {
      var offset = evt.pageX - this._lastPageX ;
      this._column.incrementProperty('width', offset);
      this._lastPageX = evt.pageX;
      this._parentView.get('tableView').notifyPropertyChange('columns');
    },
    mouseUp: function() {
      this._parentView = null;
      this._column = null;
      this._lastPageX = null;
    }
  }),

  /**
    A reference to the header encompassing TableView.

    @type BBA.TableView
  */
  tableView: SC.outlet('parentView.tableView'),

  /**
    A reference to the TableColumn.

    @type BBA.TableColumnView
  */
  column: null,

  // ..........................................................
  // SUBCLASS METHODS
  //

  render: function(context) {
    var sortKey = this.getPath('column.sortKey') || this.getPath('column.key'),
        currentSortKey = this.getPath('tableView.sortKey');
    if (currentSortKey && currentSortKey[0] === sortKey) this.set('isSelected', YES);
    context.setClass('selected', this.get('isSelected'))
           .addClass(this.getPath('column.sortDirection'));
    sc_super();
  },

  // ..........................................................
  // EVENT HANDLER METHODS
  //

  mouseDown: function() {
    var tableView = this.get('tableView');
    if (tableView.get('isSortable')) {
      this._sortTable();
    }
  },

  // ..........................................................
  // PRIVATE METHODS
  //

  _sortTable: function() {
    var tableView = this.get('tableView'),
        sortKey = this.getPath('column.sortKey') || this.getPath('column.key'),
        sortDirection = this.getPath('column.sortDirection');
    if (this.get('isSelected')) {
      sortDirection = sortDirection === BBA.SORT_ASCENDING ? BBA.SORT_DESCENDING : BBA.SORT_ASCENDING;
      this.setPath('column.sortDirection', sortDirection);
    }
    this.get('parentView').get('childViews').setEach('isSelected', NO);
    this.set('isSelected', YES);
    tableView.set('sortKey', [sortKey, sortDirection]);
  }

});
