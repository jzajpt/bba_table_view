// ==========================================================================
// Project:   BBA.TableView Unit Test
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals BBA module test ok equals same stop start */

var content, columns, tableView;

module("BBA.TableView", {
  setup: function() {
    content = [
      { artist: 'Foo Fighters',
        album:  'Wasting Light',
        year:   2011 },
      { artist: 'Dredg',
        album:  'Chuckles and Mr. Squeezy',
        year:   2011 },
      { artist: 'Thrice',
        album:  'Beggars',
        year:   2009 }
    ];
    content = content.map(function(item) {
      return SC.Object.create(item);
    });

    columns = [
      { key: 'artist',
        title: 'Artist',
        width: 150 },
      { key: 'album',
        title: 'Album',
        width: 250 },
      { key: 'year',
        title: 'Year',
        width: 100 }
    ];
    tableView = BBA.TableView.create({
      isVisibleInWindow: YES, // force render
      content: content,
      columns: columns
    }).createLayer();
  }
});

test("containerView outlet", function() {
  SC.Logger.log(tableView.getPath('scrollView.contentView.content'));
  equals(tableView.get('containerView'),
         tableView.getPath('scrollView.contentView'),
         "containerView should be scrollView's content");
});

test("columns property", function() {
  tableView.get('columns').forEach(function(column) {
    ok(SC.kindOf(column, BBA.TableColumnView));
  });
});

test("exampleView", function() {
  SC.run();

  SC.Logger.log(tableView.getPath('containerView'));
  equals(tableView.getPath('containerView.childViews.length'),
         3,
         "containerView should have a child view for each content item");
  equals(tableView.getPath('containerView.childViews.firstObject.tableView'),
         tableView,
         "row view should have a reference to table view");
});

test("cellOffsetForColumnIndex() method", function() {
  // column widths: 150, 250, 100
  equals(tableView.cellOffsetForColumnIndex(0), 0);
  equals(tableView.cellOffsetForColumnIndex(1), 150);
  equals(tableView.cellOffsetForColumnIndex(2), 150 + 250);
  equals(tableView.cellOffsetForColumnIndex(3), 150 + 250 + 100);
});

test("cellLayoutForColumn() method", function() {
  var layout;

  layout = tableView.cellLayoutForColumn(tableView.columns[0], 0);
  equals(layout.left, 0, "should calculate layout (left property) for first column");
  equals(layout.width, 150, "should calculate layout (left property) for first column");

  layout = tableView.cellLayoutForColumn(tableView.columns[1], 1);
  equals(layout.left, 150, "should calculate layout (left property) for second column");
  equals(layout.width, 250, "should calculate layout (left property) for second column");

  layout = tableView.cellLayoutForColumn(tableView.columns[2], 2);
  equals(layout.left, 400, "should calculate layout (left property) for third column");
  equals(layout.width, 100, "should calculate layout (left property) for third column");
});

