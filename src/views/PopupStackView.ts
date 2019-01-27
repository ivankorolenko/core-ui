import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

const classes = {
    POPUP_REGION: 'js-popup-region-',
    POPUP_FADE: 'popup-fade'
};

const POPUP_ID_PREFIX = 'popup-region-';

export default Marionette.View.extend({
    initialize() {
        this.__stack = [];
        this.__forceFadeBackground = false;
    },

    className: 'fadingPanel js-fading-panel',

    template: false,

    showPopup(view, options) {
        const { fadeBackground, transient, hostEl } = options;

        if (!transient) {
            this.__removeTransientPopups();
        }

        const popupId = _.uniqueId(POPUP_ID_PREFIX);
        const regionEl = document.createElement('div');
        regionEl.setAttribute('data-popup-id', popupId);
        regionEl.classList.add('js-core-ui__global-popup-region');

        let parentPopup;
        let parentPopupId = null;

        if (hostEl) {
            parentPopup = hostEl.closest && hostEl.closest('.js-core-ui__global-popup-region');
            parentPopupId = parentPopup ? parentPopup.getAttribute('popup-id') : null;
        }
        const config = {
            view,
            options,
            regionEl,
            popupId,
            parentPopupId
        };

        if (parentPopupId) {
            // If there is a child popup, it must be closed:
            // 1. There might be nested dropdowns
            // 2. There can't be dropdowns opened on the same level
            const childPopupDef = this.__stack.find(x => x.parentPopupId === parentPopupId);
            if (childPopupDef) {
                this.closePopup(childPopupDef.popupId);
            }
        }

        Backbone.$(document.body).append(regionEl);
        this.addRegion(popupId, {
            el: regionEl
        });

        this.getRegion(popupId).show(view);
        if (fadeBackground) {
            const lastIndex = this.__stack.lastIndexOf(x => x.options.fadeBackground);

            if (lastIndex !== -1) {
                this.__stack[lastIndex].regionEl.classList.remove(classes.POPUP_FADE);
            } else {
                this.__toggleFadedBackground(true);
            }
            regionEl.classList.add(classes.POPUP_FADE);
        }

        this.__stack.push(config);
        return popupId;
    },

    closePopup(popupId = null) {
        if (this.__stack.length === 0) {
            return;
        }

        let targets = [];
        const popupDef = this.__stack.find(x => x.popupId === popupId);
        if (popupDef) {
            if (!popupDef.options.transient) {
                this.__removeTransientPopups();
            }
            // All the children of the popup will also be closed
            // Important: we collect only logical children because another popup might have been opened at the same level already.
            // e.g.: focus-blur events (usually focus comes first) - one popup is opened on focus and the previous one is closed on blur.
            if (this.__stack.includes(popupDef)) {
                targets = [popupDef];
                const handleChildren = pId => {
                    const children = this.__stack.filter(x => x.parentPopupId === pId);
                    targets.push(...children);
                    children.forEach(c => handleChildren(c.popupId));
                };
                handleChildren(popupId);
            } else {
                targets = [];
            }
        } else if (popupId) {
            // If we don't find the popup, it must have been closed so the job is done
            targets = [];
        } else {
            // Close all transient popups and the top-most non-transient
            this.__removeTransientPopups();
            const topMostNonTransient = this.__stack[this.__stack.length - 1];
            if (topMostNonTransient) {
                targets = [topMostNonTransient];
            }
        }
        targets.reverse().forEach(pd => {
            this.__removePopup(pd);
        });

        const filteredStackList = this.__stack.filter(x => x.options.fadeBackground);
        const lastElement = filteredStackList && filteredStackList[filteredStackList.length - 1];

        if (lastElement) {
            lastElement.regionEl.classList.add(classes.POPUP_FADE);
        } else {
            this.__toggleFadedBackground(this.__forceFadeBackground);
        }
    },

    get(popupId) {
        const index = this.__stack.findIndex(x => x.popupId === popupId);
        if (index === -1) {
            return [];
        }
        return this.__stack.slice(index).map(x => x.view);
    },

    getStack() {
        return this.__stack;
    },

    fadeBackground(fade) {
        this.__forceFadeBackground = fade;
        this.__toggleFadedBackground(this.__forceFadeBackground || this.__stack.find(x => x.options.fadeBackground));
    },

    __removeTransientPopups() {
        this.__stack
            .filter(x => x.options.transient)
            .reverse()
            .forEach(popupDef => {
                this.__removePopup(popupDef);
            });
    },

    __removePopup(popupDef) {
        this.removeRegion(popupDef.popupId);
        document.body.removeChild(popupDef.regionEl);
        this.__stack.splice(this.__stack.indexOf(popupDef), 1);
        this.trigger('popup:close', popupDef.popupId);
    },

    __toggleFadedBackground(fade: boolean) {
        this.$el.toggleClass('fadingPanel_open', fade);
    }
});