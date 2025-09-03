function generateQuestionnaires(data, checkedStates = {}) {
    const checkboxesContainer = document.getElementById('checkboxes');
    const questionnairesContainer = document.getElementById('questionnaires-container');
    const systemName = document.getElementById('system-name').value;

    data.forEach((questionnaire, index) => {
        // Create checkbox wrapper
        const checkboxWrapper = document.createElement('div');

        // Create checkbox input
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `questionnaire-${index}-checkbox`;

        // Create label with hyperlink
        const label = document.createElement('label');
        label.setAttribute('for', checkbox.id);
        const anchor = document.createElement('a');
        anchor.href = questionnaire.url;
        anchor.target = '_blank';
        anchor.textContent = questionnaire.title;
        label.appendChild(anchor);

        // Append checkbox and label to wrapper
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

        // Special case for demographics
        if (questionnaire.title.toLowerCase() === 'demographics') {
            const questions = [
                { label: "How do you currently describe your gender identity?", inputId: "gender-identity" },
                { label: "What is your age in years?", inputId: "age" },
                { label: "In what country did you spend your formative years?", inputId: "country" },
                { label: "What is your course of study or job title?", inputId: "course-or-job" }
            ];

            questions.forEach(q => {
                const questionBlock = document.createElement('div');
                questionBlock.classList.add('demographic-question');

                const label = document.createElement('p');
                label.textContent = q.label;
                questionBlock.appendChild(label);

                // Text input
                const textInputWrapper = document.createElement('label');
                const textInput = document.createElement('input');
                textInput.type = 'text';
                textInput.id = q.inputId;
                textInput.name = q.inputId;
                textInput.placeholder = 'Please specify...';
                textInputWrapper.appendChild(textInput);
                questionBlock.appendChild(textInputWrapper);
                questionBlock.appendChild(document.createElement('br'));

                // Opt-out checkbox
                const optOutWrapper = document.createElement('label');
                const optOutCheckbox = document.createElement('input');
                optOutCheckbox.type = 'checkbox';
                optOutCheckbox.id = `${q.inputId}-opt-out`;
                optOutCheckbox.name = `${q.inputId}-opt-out`;
                optOutWrapper.appendChild(optOutCheckbox);
                optOutWrapper.append(" I prefer not to answer.");
                questionBlock.appendChild(optOutWrapper);

                // Disable input if opt-out checked
                optOutCheckbox.addEventListener('change', () => {
                    textInput.disabled = optOutCheckbox.checked;
                });

                questionnaireDiv.appendChild(questionBlock);
                questionnaireDiv.appendChild(document.createElement('br'));
            });

        } else {
            // Regular Likert-style logic
            const specialText = "When doing this task, it's most important that I'm able to...";
            const regularStatements = questionnaire.statements.filter(s => s.text !== specialText && s.text !== "Which contributed more to workload?");
            const specialStatements = questionnaire.statements.filter(s => s.text === specialText).sort(() => Math.random() - 0.5);

            // Shuffle regular statements
            let shuffledStatements = [...regularStatements].sort(() => Math.random() - 0.5).concat(specialStatements);

            // Extract COMPS statements to always appear at the end
            const compsStatements = questionnaire.statements.filter(s => s.text === "Which contributed more to workload?");
            shuffledStatements = shuffledStatements.concat(compsStatements);

            // Render all statements
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

                const labelsGrid = Array(statement.likert_scale_points).fill(null);
                statement.scale_labels.forEach(label => {
                    labelsGrid[label.index] = label.label;
                });

                labelsGrid.forEach(label => {
                    const labelCell = document.createElement('td');
                    labelCell.textContent = label || '';
                    labelCell.classList.add('scale-label');
                    labelsRow.appendChild(labelCell);
                });

                for (let i = 0; i < statement.likert_scale_points; i++) {
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
        }

        // Append questionnaire section
        questionnairesContainer.appendChild(questionnaireDiv);

        // Restore checkbox state
        if (checkedStates[checkbox.id]) {
            checkbox.checked = true;
            questionnaireDiv.style.display = 'block';
            questionnaireDiv.classList.add('active');
        }

        // Toggle logic
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
