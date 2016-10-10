'use strict'

class DoubleClickTreeView
  activate: ->
    atom.packages.activatePackage('tree-view').then (treeViewPkg) =>
      @treeView = treeViewPkg.mainModule.createView()
      @treeView.originalEntryClicked = @treeView.entryClicked

      @treeView.entryClicked = (e) ->
        entry = e.currentTarget
        if entry.constructor.name == 'tree-view-directory' && e.offsetX <= 10
          isRecursive = e.altKey or false
          entry.toggleExpansion(isRecursive)
          e.stopPropagation();

      @treeView.on 'dblclick', '.entry', (e) =>
        @treeView.openSelectedEntry.call(@treeView)
        false

  deactivate: ->
    @treeView.entryClicked = @treeView.originalEntryClicked
    delete @treeView.originalEntryClicked
    @treeView.off 'dblclick', '.entry'

  entryDoubleClicked: (e) ->
    @originalEntryClicked(e)

module.exports = new DoubleClickTreeView()
