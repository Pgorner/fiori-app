import Button, { $ButtonSettings } from 'sap/m/Button';
import Dialog, { $DialogSettings } from 'sap/m/Dialog';
import FormattedText, { $FormattedTextSettings } from 'sap/m/FormattedText';

export default class Ui5ControlFactory {
	public static createButton(settings: $ButtonSettings) {
		return new Button(settings);
	}

	public static createDialog(settings: $DialogSettings, id?: string) {
		return new Dialog(id, settings);
	}

	public static createFormattedText(settings: $FormattedTextSettings) {
		return new FormattedText(settings);
	}
}
