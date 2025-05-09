// settings.js

function createSettingsInputs() {
  const checkboxesContainer = document.getElementById('checkboxes');
  const inputWrapper = document.createElement('div');

  // System name input
  const systemNameInput = document.createElement('input');
  systemNameInput.type = 'text';
  systemNameInput.placeholder = 'System Name';
  systemNameInput.id = 'system-name';
  inputWrapper.appendChild(systemNameInput);
  inputWrapper.appendChild(document.createElement('br'));

  // Condition input
  const conditionInput = document.createElement('input');
  conditionInput.type = 'text';
  conditionInput.placeholder = 'Condition';
  conditionInput.id = 'condition';
  inputWrapper.appendChild(conditionInput);
  inputWrapper.appendChild(document.createElement('br'));

  checkboxesContainer.appendChild(inputWrapper);

  // Apply settings from URL once DOM is ready
  applySettingsFromURL();

  // Add event listeners to update the URL when inputs change
  systemNameInput.addEventListener('input', updateURLWithSettings);
  conditionInput.addEventListener('input', updateURLWithSettings);
}

// Apply settings (system name, condition, checkbox state) from URL
function applySettingsFromURL() {
  const params = new URLSearchParams(window.location.search);

  // System name
  const systemName = params.get('system');
  if (systemName) {
    const input = document.getElementById('system-name');
    if (input) input.value = decodeURIComponent(systemName);
  }

  // Condition
  const condition = params.get('condition');
  if (condition) {
    const input = document.getElementById('condition');
    if (input) input.value = decodeURIComponent(condition);
  }

  // Check selected questionnaires
  const selectedIndices = params.getAll('q').map(i => parseInt(i));
  document.querySelectorAll('#checkboxes input[type="checkbox"]').forEach((checkbox, index) => {
    if (selectedIndices.includes(index)) {
      checkbox.checked = true;
    }
  });
}
