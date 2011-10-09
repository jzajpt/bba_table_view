// ==========================================================================
// Project:   BBA.TableCellViewMixin
// Copyright: ©2011 Blueberry.cz Apps s.r.o.
// ==========================================================================
/*globals BBA */

/** @namespace */
BBA.TableCellViewMixin = {

  classNames: "table-cell-view".w(),

  /**
    A reference to the cell's encompassing column.

    @type BBA.TableColumnView
    @default null
  */
  column: null,

  /**
    A reference to the cell's encompassing row.

    @type BBA.TableRowView
    @default null
  */
  row: null,

  /**
    A cell's value.

    @default null
  */
  value: null,

  textAlign: SC.outlet('column.align'),

  inlineEditorDidEndEditing: function(view, value) {
    sc_super();
    var row = this.get('row');
    var column = this.get('column');
    row._setValueForColumn(column, value);
  },

  // ..........................................................
  // PROPERTIES
  //

  isEditable: function() {
    var columnIsEditable = this.getPath('column.isEditable'),
        contentIsEditable = this.getPath('content.isEditable');
    console.log(columnIsEditable, contentIsEditable);
    return columnIsEditable && contentIsEditable;
  }.property('column', 'row').cacheable(),

};
