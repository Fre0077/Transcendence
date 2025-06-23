export function createInputElement(
	id: string,
	type: string,
	placeholder: string,
	autocomplete?: AutoFill
): HTMLInputElement {
	let input = document.createElement("input");
	input.id = id;
	input.type = type;
	input.placeholder = placeholder;
	if (autocomplete) {
		input.autocomplete = autocomplete;
	}
	return input;
}

export function createButtonElement(
	id: string,
	text: string,
	onClick: (event?: Event) => void // Updated to accept Event parameter
): HTMLButtonElement {
	let button = document.createElement("button");
	button.id = id;
	button.type = "button"; // Prevent form submission
	button.innerText = text;
	button.addEventListener("click", (event) => {
		event.preventDefault(); // Prevent default behavior
		onClick(event); // Pass event to the callback
	});
	return button;
}

export function createSeparator(height: string, color: string): HTMLHRElement {
	let separator = document.createElement("hr");
	separator.style.width = "100%";
	separator.style.height = height;
	separator.style.border = "none";
	separator.style.backgroundColor = color;
	return separator;
}

export function createFormElement(id: string, title: string): HTMLFormElement {
	let form = document.createElement("form");
	form.id = id;
	form.addEventListener("submit", (e) => {
		e.preventDefault(); // Prevent form submission
	});
	let titleElement = document.createElement("h2");
	titleElement.innerText = title;
	form.appendChild(titleElement);
	return form;
}

export function createSelectElement(
	id: string,
	options: string[]
): HTMLSelectElement {
	let select = document.createElement("select");
	select.id = id;
	
	options.forEach(optionData => {
		let option = document.createElement("option");
		
		// Check if option contains value|label format
		if (optionData.includes('|')) {
			const [value, label] = optionData.split('|');
			option.value = value;
			option.textContent = label;
		} else {
			option.value = optionData;
			option.textContent = optionData;
		}
		
		select.appendChild(option);
	});
	
	return select;
}
