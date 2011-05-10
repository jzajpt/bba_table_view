// ==========================================================================
// Project:   BBA.TableRowView
// Copyright: ©2011 Blueberry.cz Apps s.r.o.
// ==========================================================================
/*globals BBA */

/** @class

  A table row view renders a columns inside itself.

  @extends SC.View
*/
BBA.TableRowView = SC.View.extend(
  /** @scope BBA.prototype */ {

  classNames: "table-row-view".w(),

  displayProperties: 'isSelected'.w(),

  /**
    The content object the row will display.

    @type SC.Object
  */
  content: null,

  /**
    A reference to the row's encompassing TableView.

    SC.View -> SC.ContainerView -> SC.ScrollView -> BBA.TableView

    @type BBA.TableView
  */
  tableView: null,

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
      childViews.push(this._createCellForColumn(columns[idx], idx));
    }
    this.set('childViews', childViews);
    this.endPropertyChanges();
    return this;
  },

  /**
    Just adds even or odd class to context.
  */
  render: function(context, firstTime) {
    var classNames = this.get('rowClassNames');
    context.addClass(classNames);
    sc_super();
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
  // PROPERTIES
  //

  /** @field
    Return `YES` when `contentIndex` property is even.

    @type Boolean
  */
  isContentIndexEven: function() {
    return ((this.get('contentIndex') % 2) === 0);
  }.property('contentIndex').cacheable(),

  /** @field
    Returns class names for row.

    @type Array
  */
  rowClassNames: function() {
    var classNames = [];
    classNames.pushObject(this.get('isContentIndexEven') ? 'even' : 'odd');
    if (this.get('isSelected')) classNames.pushObject('selected');
    return classNames;
  }.property('isContentIndexEven', 'isSelected').cacheable(),

  // ..........................................................
  // PRIVATE METHODS
  //

  /** @private */
  _createCellForColumn: function(column, index) {
    var attributes = this._cellAttributesForColumn(column, index);
    return this.createChildView(BBA.TableCellView, attributes);
  },

  /** @private */
  _cellAttributesForColumn: function(column, index) {
    var layout = this.get('tableView').cellLayoutForColumn(column, index);
    return {
      layout: layout,
      column: column,
      row: this,
      value: this._cellValueForColumn(column)
    };
  },

  /** @private */
  _cellValueForColumn: function(column) {
    var content = this.get('content'),
        key     = column.get('key'),
        value;
    if (content) {
      value = content.get(key);
      return value && value.toString();
    }
  },

  /** @private */
  _setValueForColumn: function(column, value) {
    var content = this.get('content'),
        key     = column.get('key');
    content.set(key, value);
  }

}) ;


