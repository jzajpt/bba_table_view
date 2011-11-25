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

  /**
    A reference to the table view's columns.

    @type Array
  */
  columns: null,

  // ..........................................................
  // SUBCLASS METHODS
  //

  /**
    Setup header cells from table view's columns.
  */
  createChildViews: function() {
    var childViews = this.get('childViews'),
        columns    = this.get('columns'),
        len        = columns.get('length'),
        idx;
    this.beginPropertyChanges();
    for (idx=0; idx<len; ++idx) {
      childViews[idx] = this._createCellForColumn(columns[idx], idx);
    }
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
        columns    = this.get('columns'),
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
    var exampleView = column.get('exampleView')
    return this.createChildView(exampleView, attributes);
  },

  /** @private */
  _cellAttributesForColumn: function(column, index) {
    var layout = this.get('tableView').cellLayoutForColumn(column, index);
    var columnIsEditable = column.get('isEditable');
    var contentIsEditable = this.getPath('content.isEditable');
    var isEditable = columnIsEditable && contentIsEditable;
    var content = this.get('content'),
        key     = column.get('key');
    return {
      layout: layout,
      column: column,
      content: this.get('content'),
      row: this,
      valueBinding: SC.Binding.from(key, content),
      classNames: "table-cell-view".w(),
      textAlign: SC.outlet('column.align'),
      isEditable: isEditable,
      inlineEditorDidEndEditing: function(view, value) {
        sc_super();
        var row = this.get('row');
        var column = this.get('column');
        row._setValueForColumn(column, value);
      }
    };
  },

  /** @private */
  _setValueForColumn: function(column, value) {
    var content = this.get('content'),
        key     = column.get('key');
    content.set(key, value);
  }

}) ;


