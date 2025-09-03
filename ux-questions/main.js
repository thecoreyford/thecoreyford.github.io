let questionnaireData = []; // To store all loaded questionnaires

fetch('questionnaires_split/manifest.json')
  .then(response => response.json())
  .then(async manifest => {
      // Use manifest.files array
      const files = manifest.files;
      if (!files || !files.length) {
          throw new Error("No questionnaire files listed in manifest.");
      }

      // Fetch all questionnaire JSON files
      const fetchPromises = files.map(filename => 
          fetch(`questionnaires_split/${filename}`).then(res => res.json())
      );

      questionnaireData = await Promise.all(fetchPromises);

      // Now continue with the existing initialization
      createSettingsInputs();

      setTimeout(() => {
          const urlParams = new URLSearchParams(window.location.search);
          const selectedIndices = urlParams.getAll('q').map(i => parseInt(i));
          const checkedStates = {};

          selectedIndices.forEach(index => {
              checkedStates[`questionnaire-${index}-checkbox`] = true;
          });

          document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
              if (checkedStates[checkbox.id]) checkbox.checked = true;
          });

          const systemInput = document.getElementById('system-name');
          if (urlParams.get('system')) systemInput.value = urlParams.get('system');

          const participantInput = document.getElementById('participant-id');
          if (urlParams.get('id')) participantInput.value = urlParams.get('id');

          systemInput.addEventListener('input', updateQuestionnaireUI);

          generateQuestionnaires(questionnaireData, checkedStates);

          document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
              checkbox.addEventListener('change', updateURLWithSettings);
          });

      }, 0);

  })
  .catch(error => console.error('Error loading questionnaires:', error));



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
