let questionnaireData = []; // To store the loaded data

// Load JSON and initialize settings + questionnaires
fetch('questionnaires.json')
  .then(response => response.json())
  .then(data => {
    questionnaireData = data;
    createSettingsInputs(); // This creates system name input and checkboxes

    // Delay the checkbox state application
    setTimeout(() => {
      // Apply state from URL if needed
      const urlParams = new URLSearchParams(window.location.search);
      const selectedIndices = urlParams.getAll('q').map(i => parseInt(i));
      const checkedStates = {};

      // Apply states from URL (if present)
      selectedIndices.forEach(index => {
        checkedStates[`questionnaire-${index}-checkbox`] = true;
      });

      // Apply checked states
      document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        if (checkedStates[checkbox.id]) {
          checkbox.checked = true; // Check based on URL params
        }
      });

      // Optionally handle the system input from URL
      const systemInput = document.getElementById('system-name');
      if (urlParams.get('system')) {
        systemInput.value = urlParams.get('system');
      }

      // Set participant ID if it's passed in the URL
      const participantInput = document.getElementById('participant-id');
      if (urlParams.get('id')) {
        participantInput.value = urlParams.get('id');
      }

      // Add event listener to update the UI when system name is modified
      systemInput.addEventListener('input', updateQuestionnaireUI);

      // Generate questionnaires (with default unchecked state)
      generateQuestionnaires(data, checkedStates);

      // Add event listeners for checkboxes to update the URL when checked
      document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
          updateURLWithSettings(); // Update URL whenever checkbox is clicked
        });
      });

    }, 0); // Wait a bit to ensure checkboxes are rendered before manipulating them
  })
  .catch(error => console.error('Error loading the JSON:', error));

// Update only checkboxes and questionnaire UI
function updateQuestionnaireUI() {
  const checkboxesContainer = document.getElementById('checkboxes');
  const questionnairesContainer = document.getElementById('questionnaires-container');

  // Save current checkbox states
  const checkedStates = {};
  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkedStates[checkbox.id] = checkbox.checked;
  });

  // Remove only checkboxes
  [...checkboxesContainer.children].forEach(child => {
    if (child.querySelector('input[type="checkbox"]')) {
      checkboxesContainer.removeChild(child);
    }
  });

  // Clear questionnaires
  questionnairesContainer.innerHTML = '';

  // Re-render
  generateQuestionnaires(questionnaireData, checkedStates);
}

// Function to update the URL based on settings and checkbox states
function updateURLWithSettings() {
  const params = new URLSearchParams();

  // Get selected checkboxes
  document.querySelectorAll('#checkboxes input[type="checkbox"]').forEach((checkbox, index) => {
    if (checkbox.checked) {
      params.append('q', index); // Append the index of selected checkbox
    }
  });

  // System name
  const systemName = document.getElementById('system-name')?.value;
  if (systemName) params.set('system', encodeURIComponent(systemName));

  // Condition
  const condition = document.getElementById('condition')?.value;
  if (condition) params.set('condition', encodeURIComponent(condition));

  // Participant ID
  const participantId = document.getElementById('participant-id')?.value;
  if (participantId) params.set('id', encodeURIComponent(participantId));

  // Update the URL without reloading the page
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, '', newUrl);
}
