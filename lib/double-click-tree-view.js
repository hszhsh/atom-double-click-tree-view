'use babel';

import { CompositeDisposable } from 'atom';

export default {
    activate(state) {
        this.disposables = new CompositeDisposable();
        if (atom.project.getPaths().length === 0) {
            this.disposables.add(atom.project.onDidChangePaths(() => {
                if (this.treeView) {
                    const pane = atom.workspace.paneForItem(this.treeView);
                    if (pane) {
                        pane.removeItem(this.treeView)
                    }
                }
                this.disposables.dispose();
                this.disposables = null;
            }));
        }
        return atom.packages.activatePackage('tree-view').then((treeViewPkg) => {
            if (treeViewPkg.mainModule.createView) {
                this.treeView = treeViewPkg.mainModule.createView();
            } else {
                this.treeView = treeViewPkg.mainModule.getTreeViewInstance();
            }
            this.treeView.originalEntryClicked = this.treeView.entryClicked;
            // console.log(this.treeView.originalEntryClicked.toString());
            this.treeView.entryClicked = function(e) {
                let entry = e.target.closest('.entry');
                if (!entry) {
                    return;
                }

                let isRecursive = e.altKey || false;
                if (e.detail == 1) {
                    this.selectEntry(entry);
                    if (entry.classList.contains('directory') && e.offsetX <= 10) {
                        entry.toggleExpansion(isRecursive);
                    }
                } else if (e.detail == 2) {
                    if (entry.classList.contains('directory')) {
                        entry.toggleExpansion(isRecursive);
                    } else if (entry.classList.contains('file')) {
                        this.fileViewEntryClicked(e);
                    }
                }
            }
        });
    },

    deactivate() {
        if (this.disposables) {
            this.disposables.dispose();
        }
        this.treeView.entryClicked = this.treeView.originalEntryClicked;
        delete this.treeView.originalEntryClicked;
    },

    entryDoubleClicked(e) {
        return this.originalEntryClicked(e);
    }
};
