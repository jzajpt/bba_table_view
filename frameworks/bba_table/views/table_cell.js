// ==========================================================================
// Project:   BBA.TableCellView
// Copyright: ©2011 Blueberry.cz Apps s.r.o.
// ==========================================================================
/*globals BBA */

/** @class

  @extends SC.View
*/
BBA.TableCellView = SC.View.extend(
  /** @scope BBA.prototype */ {

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

  // ..........................................................
  // SUBCLASS METHODS
  //

  /**
    Setups cell content.
  */
  createChildViews: function() {
    this.set('childViews', [this._createCellContentView()]);
    return this;
  },

  // ..........................................................
  // PRIVATE METHODS
  //

  /**
    Creates a cell content view (a class from column's exampleView).

    @returns {SC.View}
  */
  _createCellContentView: function() {
    var column = this.get('column'),
        row = this.get('row'),
        exampleView = column.get('exampleView');
    return this.createChildView(exampleView, {
      textAlign: column.get('align'),
      isEditable: column.get('isEditable'),
      value: this.get('value'),
      inlineEditorDidEndEditing: function(view, value) {
        sc_super();
        row._setValueForColumn(column, value);
      }
    });
  }

});
