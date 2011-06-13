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

  init: function() {
    sc_super();
    this._setupValueObserver();
  },

  destroy: function() {
    this._removeValueObserver();
    sc_super();
  },

  /**
    Setups cell content.
  */
  createChildViews: function() {
    this.set('childViews', [this._createCellContentView()]);
    return this;
  },

  // ..........................................................
  // PROPERTIES
  //

  isEditable: function() {
    var columnIsEditable = this.getPath('column.isEditable'),
        contentIsEditable = this.getPath('row.content.isEditable');
    return columnIsEditable && contentIsEditable;
  }.property('column', 'row').cacheable(),

  // ..........................................................
  // PRIVATE METHODS
  //

  /** @private */
  _setupValueObserver: function() {
    var content = this.getPath('row.content'),
        key = this.getPath('column.key');
    if (content && key) {
      content.addObserver(key, this, '_valueDidChange');
      this._observedContent = content;
      this._observedKey = key;
    }
  },

  /** @private */
  _removeValueObserver: function() {
    if (this._observedContent && this._observedKey) {
      this._observedContent.removeObserver(this._observedKey, this, '_valueDidChange');
    }
  },

  /** @private
    Creates a cell content view (a class from column's exampleView).

    @returns {SC.View}
  */
  _createCellContentView: function() {
    var column = this.get('column'),
        row = this.get('row'),
        exampleView = column.get('exampleView');
    return this.createChildView(exampleView, {
      textAlign: column.get('align'),
      isEditableBinding: '.parentView.isEditable',
      valueBinding: SC.Binding.from('value', this),
      inlineEditorDidEndEditing: function(view, value) {
        sc_super();
        row._setValueForColumn(column, value);
      }
    });
  },

  /** @private
    Observer handler that gets called when value of this cell
    changes.
  */
  _valueDidChange: function(object, key) {
    var childViews = this.get('childViews');
    if (childViews && childViews[0]) {
      this.set('value', object.get(key));
    }
  }

});
