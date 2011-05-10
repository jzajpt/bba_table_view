// ==========================================================================
// Project:   BBA.TableHeaderView Unit Test
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals BBA module test ok equals same stop start */

var content, columns, tableView, headerView;

module("BBA.TableHeaderView", {
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

    headerView = tableView.get('headerView');
  }
});

test("tableView outlet", function() {
  SC.run();
  equals(headerView.get('tableView'),
         tableView,
         "header view should have a reference to table view");
});

test("headerView child views", function() {
  SC.run();
  equals(headerView.getPath('childViews.length'),
         3,
         "header view should have cells depending on columns count");
  headerView.get('childViews').forEach(function(childView) {
    ok(SC.kindOf(childView, BBA.TableHeaderCellView));
  });
});

test("updateColumnWidths() method", function() {
  SC.run();

  var columns = tableView.get('columns'),
      layout;

  columns[0].set('width', 200);
  headerView.updateColumnWidths();

  layout = headerView.get('childViews')[0].get('layout');
  equals(layout.left, 0);
  equals(layout.width, 200);

  layout = headerView.get('childViews')[1].get('layout');
  equals(layout.left, 200);
  equals(layout.width, 250);

  layout = headerView.get('childViews')[2].get('layout');
  equals(layout.left, 450);
  equals(layout.width, 100);
});
