// ==========================================================================
// Project:   BBA.TableColumnView
// Copyright: ©2011 Blueberry.cz Apps s.r.o.
// ==========================================================================
/*globals BBA */

BBA.SORT_ASCENDING  = 'ASC';
BBA.SORT_DESCENDING = 'DESC';

/** @class

  A table header view. Renders a column headers and handles column selection.

  @extends SC.View
*/
BBA.TableColumnView = SC.View.extend(
  /** @scope BBA.prototype */ {

  /**
    A header cell title.

    @type String
    @default null
  */
  title: null,

  /**
    A key used for displaying value inside column's cell.

    @type String
    @default null
  */
  key: null,

  /**
    A key used when sorting column. If `null` a `key`
    property is used.

    @type String
    @default null
  */
  sortKey: null,

  /**
    The sort direction of this column. Can be one of
    SC.SORT_ASCENDING, SC.SORT_DESCENDING.

    @type String
    @default BBA.SORT_ASCENDING
  */
  sortDirection: BBA.SORT_ASCENDING,

  /**
    Text align property. Makes sense mostly for `SC.LabelView` columns.

    @type String
    @default SC.ALIGN_LEFT
  */
  align: SC.ALIGN_LEFT,

  isEditable: NO,

  /**
    Preferred width for column.

    @type Number
    @default 0
  */
  width: 0,

  /**
    Specified whether column has auto-calculated width (is flexible).

    @type Boolean
    @default 0
  */
  isFlexible: NO,

  /**
    The view class to use when creating table content cell content.

    @type SC.View
    @default SC.LabelView
  */
  exampleView: SC.LabelView

})
