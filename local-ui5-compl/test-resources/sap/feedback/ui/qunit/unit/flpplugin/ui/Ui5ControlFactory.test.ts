import Ui5ControlFactory from 'sap/feedback/ui/flpplugin/ui/Ui5ControlFactory';

export default () => {
	QUnit.module('Ui5ControlFactory unit tests', {});

	QUnit.test('createButton', (assert) => {
		const createdButton = Ui5ControlFactory.createButton({ text: 'testText' });
		assert.equal(createdButton.getText(), 'testText');
	});

	QUnit.test('createDialog', (assert) => {
		const createdDialog = Ui5ControlFactory.createDialog({ title: 'testText' });
		assert.equal(createdDialog.getTitle(), 'testText');
	});

	QUnit.test('createDialog with ID', (assert) => {
		const createdDialog = Ui5ControlFactory.createDialog({ title: 'testText' }, 'testId');
		assert.equal(createdDialog.getTitle(), 'testText');
		assert.equal(createdDialog.getId(), 'testId');
	});

	QUnit.test('createFormattedText', (assert) => {
		const createdFormattedText = Ui5ControlFactory.createFormattedText({ htmlText: 'testText' });
		assert.equal(createdFormattedText.getHtmlText(), 'testText');
	});
};
