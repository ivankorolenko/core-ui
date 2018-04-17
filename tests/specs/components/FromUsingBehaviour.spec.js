import core from 'coreApi';
import { initializeCore } from '../../utils/helpers';
import 'jasmine-jquery';

const template = '<div class="field-width" data-fields="text"></div>' +
    '<div class="field-width" data-fields="number"></div>' +
    '<div class="field-width" data-fields="dateTime"></div>' +
    '<div class="field-width" data-fields="duration"></div>' +
    '<div class="field-width" data-fields="dropdown"></div>' +
    '<div class="field-width" data-fields="wrongInstance"></div>';

const model = new Backbone.Model({
    text: 'Text Example',
    number: 451,
    dateTime: new Date(1984, 0, 24),
    duration: 'P14DT4H15M',
    dropdown: 'd.2'
});

describe('Components', () => {
    beforeEach(function () {
        this.rootRegion = initializeCore();
    });

    describe('FormUsingBehaviour', () => {
        it('should initialize', function () {
            const View = Marionette.ItemView.extend({
                initialize() {
                    this.model = model;
                },

                template: Handlebars.compile(template),

                behaviors: {
                    BackboneFormBehavior: {
                        behaviorClass: core.form.behaviors.BackboneFormBehavior,
                        schema() {
                            return {
                                text: {
                                    type: 'Text',
                                    title: 'Text',
                                    helpText: 'Some help information'
                                },
                                number: {
                                    type: 'Number',
                                    title: 'Number',
                                    helpText: 'Some help information'
                                },
                                dateTime: {
                                    type: 'DateTime',
                                    title: 'DateTime',
                                    helpText: 'Some help information'
                                },
                                duration: {
                                    type: 'Duration',
                                    title: 'Duration',
                                    helpText: 'Some help information'
                                },
                                dropdown: {
                                    type: 'Dropdown',
                                    title: 'Dropdown',
                                    collection: [{ id: 'd.1', text: 'Text 1' }, { id: 'd.2', text: 'Text 2' }, {
                                        id: 'd.3',
                                        text: 'Text 3'
                                    }, { id: 'd.4', text: 'Text 4' }],
                                    helpText: 'Some help information'
                                },
                                wrongInstance: {
                                    type: 'Dropdown',
                                    title: 'Dropdown',
                                    helpText: 'Some help information'
                                }
                            };
                        }
                    }
                }
            });

            this.rootRegion.show(new View());
            // assert
            expect(true).toBe(true);
        });

        it('should show all help texts ', function () {
            const view = new (Marionette.ItemView.extend({
                initialize() {
                    this.model = model;
                },

                template: Handlebars.compile(template),

                behaviors: {
                    BackboneFormBehavior: {
                        behaviorClass: core.form.behaviors.BackboneFormBehavior,
                        schema() {
                            return {
                                text: {
                                    type: 'Text',
                                    title: 'Text',
                                    helpText: 'Some help information'
                                },
                                number: {
                                    type: 'Number',
                                    title: 'Number',
                                    helpText: 'Some help information'
                                },
                                dateTime: {
                                    type: 'DateTime',
                                    title: 'DateTime',
                                    helpText: 'Some help information'
                                },
                                duration: {
                                    type: 'Duration',
                                    title: 'Duration',
                                    helpText: 'Some help information'
                                },
                                dropdown: {
                                    type: 'Dropdown',
                                    title: 'Dropdown',
                                    collection: [{ id: 'd.1', text: 'Text 1' }, { id: 'd.2', text: 'Text 2' }, {
                                        id: 'd.3',
                                        text: 'Text 3'
                                    }, { id: 'd.4', text: 'Text 4' }],
                                    helpText: 'Some help information'
                                }
                            };
                        }
                    }
                }
            }))();

            this.rootRegion.show(view);

            const helpTexts = view.$('.form-label__info-button');

            helpTexts.each((i, text) => {
                text.click();
            });

            expect(helpTexts.length).toEqual(4);
        });
    });
});
