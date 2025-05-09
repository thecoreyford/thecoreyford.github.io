function generateQuestionnaires(data, checkedStates = {}) {
    const checkboxesContainer = document.getElementById('checkboxes');
    const questionnairesContainer = document.getElementById('questionnaires-container');
    const systemName = document.getElementById('system-name').value;


    data.forEach((questionnaire, index) => {
        // Create checkbox wrapper
        const checkboxWrapper = document.createElement('div');

        // Create checkbox input
        const checkbox = document.createElement('input');

        // Create label
        const label = document.createElement('label');

        // Create anchor tag for hyperlink
        const anchor = document.createElement('a');

        // Set checkbox type and ID
        checkbox.type = 'checkbox';
        checkbox.id = `questionnaire-${index}-checkbox`;
        label.setAttribute('for', checkbox.id);

        // Set the anchor tag properties
        anchor.href = questionnaire.url; // Use the URL from the JSON
        anchor.target = '_blank'; // Open the link in a new tab
        anchor.textContent = questionnaire.title; // Set the text of the link to the questionnaire title

        // Append anchor to label
        label.appendChild(anchor);

        // Append checkbox and label to checkbox wrapper
        checkboxWrapper.appendChild(checkbox);
        checkboxWrapper.appendChild(label);
        checkboxesContainer.appendChild(checkboxWrapper);

        // Create questionnaire section
        const questionnaireDiv = document.createElement('div');
        questionnaireDiv.classList.add('questionnaire');
        questionnaireDiv.id = `questionnaire-${index}-content`;
        questionnaireDiv.style.display = 'none';

        const instructions = document.createElement('p');
        instructions.classList.add('instructions');
        instructions.textContent = questionnaire.instructions.replace(/\[SYSTEM\]/g, systemName);
        questionnaireDiv.appendChild(instructions);
        questionnaireDiv.appendChild(document.createElement('br'));

        const shuffledStatements = [...questionnaire.statements].sort(() => Math.random() - 0.5);
        shuffledStatements.forEach(statement => {
            const statementDiv = document.createElement('div');
            statementDiv.classList.add('statement');

            const statementText = document.createElement('p');
            statementText.textContent = statement.text.replace(/\[SYSTEM\]/g, systemName);
            statementDiv.appendChild(statementText);

            const table = document.createElement('table');
            table.classList.add('likert-scale-table');

            const labelsRow = document.createElement('tr');
            const pointsRow = document.createElement('tr');

            // Generate scale labels dynamically for each statement
            const labelsGrid = Array(questionnaire.likert_scale_points).fill(null);
            statement.scale_labels.forEach(label => {
                labelsGrid[label.index] = label.label;
            });

            // Add labels to the labelsRow
            labelsGrid.forEach(label => {
                const labelCell = document.createElement('td');
                labelCell.textContent = label || '';
                labelCell.classList.add('scale-label');
                labelsRow.appendChild(labelCell);
            });

            // Add radio buttons to the pointsRow
            for (let i = 0; i < questionnaire.likert_scale_points; i++) {
                const pointCell = document.createElement('td');
                const radioButton = document.createElement('input');
                radioButton.type = 'radio';
                radioButton.name = `question-${questionnaire.title}-${statement.code}`;
                radioButton.value = i;
                pointCell.appendChild(radioButton);
                pointsRow.appendChild(pointCell);
            }

            table.appendChild(labelsRow);
            table.appendChild(pointsRow);
            statementDiv.appendChild(table);
            questionnaireDiv.appendChild(document.createElement('br'));
            questionnaireDiv.appendChild(statementDiv);
        });

        questionnairesContainer.appendChild(questionnaireDiv);

        // Restore checked state if available
        if (checkedStates[checkbox.id]) {
            checkbox.checked = true;
            questionnaireDiv.style.display = 'block';
            questionnaireDiv.classList.add('active');
        }

        // Toggle display
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                questionnaireDiv.style.display = 'block';
                questionnaireDiv.classList.add('active');
            } else {
                questionnaireDiv.style.display = 'none';
                questionnaireDiv.classList.remove('active');
            }
        });
    });
}