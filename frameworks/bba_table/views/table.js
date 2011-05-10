// ==========================================================================
// Project:   BBA.TableView
// Copyright: ©2011 Blueberry.cz Apps s.r.o.
// ==========================================================================
/*globals BBA */

sc_require('views/table_header');
sc_require('views/table_row');

/** @class

  A table view. Consists of header view and grid-like list inside
  a scroll view.

  @extends SC.ListView
*/
BBA.TableView = SC.ListView.extend(
  /** @scope BBA.prototype */ {

  classNames: "table-view".w(),

  /**
    Direct childs views of a TableView. A header and a scroll view
    for table's content
  */
  childViews: "headerView scrollView".w(),

  /**
    Table's header view.

    @type BBA.TableHeaderView
  */
  headerView: BBA.TableHeaderView.design({
    layout: { top: 0, right: 0, left: 0, height: 20 }
  }),

  /**
    A Scrollview that holds table's content.

    @type SC.ScrollView
  */
  scrollView: SC.ScrollView.design({
    layout: { top: 21, right: 0, bottom: 0, left: 0 },
    isVisible: YES,
    borderStyle: SC.BORDER_NONE,
    contentView: SC.View.design({}),
    _offsetDidChange: function() {
      this.get('parentView').notifyPropertyChange('clippingFrame');
    }.observes('verticalScrollOffset', 'horizontalScrollOffset')
  }),

  /**
    A container view is used as a parent for CollectionView's
    childs.
  */
  containerView: SC.outlet('scrollView.contentView'),

  /**
    The view class to use when creating new rows.

    @type SC.View
    @default BBA.TableRowView
  */
  exampleView: BBA.TableRowView,

  /**
    An uniform row height for each row.

    @type Number
    @default 24
  */
  rowHeight: 24,

  /**
    A columns attributes.

    @type Array
    @default null
  */
  columns: null,

  /**
    A key used to sort table.

    @type Array
    @default null
  */
  sortKey: null,

  /**
    If set to `YES` table can be sorted.

    @type Boolean
    @default NO
  */
  isSortable: NO,

  // ..........................................................
  // SUBCLASS METHODS
  //

  init: function() {
    this._initColumns()
    sc_super();
  },

  didCreateLayer: function() {
    this.notifyPropertyChange('columns');
  },

  createItemView: function(exampleClass, idx, attrs) {
    attrs.tableView = this;
    return exampleClass.create(attrs);
  },

  computeLayout: function() {
    var layout = sc_super(),
        containerView = this.get('containerView'),
        frame = this.get('frame');
    var minHeight = layout.minHeight;
    delete layout.minHeight;
    containerView.adjust('minHeight', minHeight);
    containerView.layoutDidChange();
    return layout;
  },

  clippingFrame: function() {
    var cv = this.get('containerView'),
        sv = this.get('scrollView'),
        f  = this.get('frame');
    if (!sv.get) return f;
    return {
      height: f.height,
      width:  f.width,
      x:      sv.get('horizontalScrollOffset'),
      y:      sv.get('verticalScrollOffset')
    };
  }.property('frame', 'content').cacheable(),

  // ..........................................................
  // METHODS
  //

  /**
    Returns left offset for cell with given index.
  */
  cellOffsetForColumnIndex: function(columnIndex) {
    var columns = this.get('columns'),
        idx, currentColumn, leftOffset = 0;
    for (idx=0; idx<columnIndex; ++idx) {
      leftOffset += columns[idx].get('width');
    }
    return leftOffset;
  },

  /**
    Returns layout object for given cell.
  */
  cellLayoutForColumn: function(column, index) {
    var cellOffset = this.cellOffsetForColumnIndex(index),
        width = column.get('width');
    if (column.get('isFlexible')) {
      width = this.get('flexibleColumnWidth');
      column.set('width', width);
    }
    return { top: 0, left: cellOffset, bottom: 0, width: width };
  },

  // ..........................................................
  // CALCULATED PROPERTIES
  //

  /** @field
    Returns all columns with flexible width.

    @type Array
  */
  flexibleColumns: function() {
    return this.get('columns').filterProperty('isFlexible', YES);
  }.property('columns').cacheable(),

  /** @field
    Returns all columns with static width.

    @type Array
  */
  staticColumns: function() {
    return this.get('columns').filterProperty('isFlexible', NO);
  }.property('columns').cacheable(),

  /** @field
    Returns a sum of static columns width.

    @type Number
  */
  staticColumnsWidth: function() {
    var widths = this.get('staticColumns').getEach('width'),
        width = 0;
    widths.forEach(function(size){
      width += size;
    });
    return width;
  }.property('columns').cacheable(),

  /** @field
    Returns a calculated width for flexible column.

    @type Number
  */
  flexibleColumnWidth: function() {
    var staticWidth     = this.get('staticColumnsWidth'),
        fullWidth       = this.get('frame').width,
        flexibleWidth   = fullWidth - staticWidth,
        flexibleColumns;
    flexibleColumns = this.get('flexibleColumns').get('length');
    return flexibleWidth / flexibleColumns;
  }.property('columns').cacheable(),

  // ..........................................................
  // PRIVATE METHODS
  //

  /** @private
    Modifies columns property. Creates `BBA.TableColumnView` objects
    using attributes in `columns` hash property.

    Note: This method is called before `sc_super()` inside `init()`
    meaning that SC KVO is not properly initialized and therefore
    no KVO get/set is used here.
  */
  _initColumns: function() {
    var columns = this.columns;
    if (columns) {
      columns = columns.map(function(column) {
        if (column.width === 0) column.isFlexible = YES;
        return BBA.TableColumnView.create(column);
      });
      this.columns = columns;
    } else {
      this.columns = [];
    }
  },

  /** @private */
  _columnsDidChange: function() {
    var columns = this.get('columns'),
        rowViews = this.getPath('containerView.childViews');
    this.headerView.updateColumnWidths();
    if (rowViews) rowViews.invoke('updateColumnWidths');
  }.observes('columns')

}) ;

