var ThxLinkerButton = MediumEditor.extensions.button.extend({

    name: 'thxlinker',
    tagNames: ['a'], // nodeName which indicates the button should be 'active' when isAlreadyApplied() is called
    contentDefault: '<b>#</b>', // default innerHTML of the button
    contentFA: '<i class="fa fa-paint-brush"></i>', // innerHTML of button when 'fontawesome' is being used
    aria: 'Thx-link', // used as both aria-label and title attributes
    action: 'createLink', // used as the data-action attribute of the button

    init: function () {
        MediumEditor.extensions.button.prototype.init.call(this);
    },

    handleClick: function (event) {
        event.preventDefault();
        event.stopPropagation();

        var range = MediumEditor.selection.getSelectionRange(this.document);

        if (range.startContainer.nodeName.toLowerCase() === 'a' ||
            range.endContainer.nodeName.toLowerCase() === 'a' ||
            MediumEditor.util.getClosestTag(MediumEditor.selection.getSelectedParentElement(range), 'a')) {
            return this.execAction('unlink');
        }
        if (!this.isDisplayed()) {
            this.callEditorApi();
        }
        return false;
    },

    callEditorApi: function () {
        this.base.saveSelection();
        window.top.Editor.api.requestLinkLibrary(this, 'handleEditorResponse');
    },

    // called externaly from patched editor - anchorPreview extension
    showForm: function (data) {
        console.log("show form");
        console.log(data);
        this.base.saveSelection();
        window.top.Editor.api.requestLinkLibrary(this, 'handleEditorResponse', data);
    },

    handleEditorResponse: function (response) {
        this.base.restoreSelection();
        this.execAction(this.action, response);
        this.base.checkSelection();
    },

    isDisplayed: function () {
        return MediumEditor.extensions.form.prototype.isDisplayed.apply(this);
    }

});
