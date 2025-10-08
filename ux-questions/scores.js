//scores.js

// Function to calculate individual questionnaire score based on the equations
function calculateScore(questionnaire, responses) {
  const lowest = questionnaire.lowest_value;

  const applyScoreEquation = (equation, responses) => {
      // Step 1: Handle reversed terms like (11 - Ex3)
      const withReversals = equation.replace(/(\d+(?:\.\d+)?)\s*-\s*([A-Za-z0-9\-.]+)/g, (_, max, varName) => {
          const raw = responses[varName] ?? 0;
          const adjusted = parseFloat(raw) + lowest;
          return `(${parseFloat(max)} - ${adjusted})`;
      });

      // Step 2: Replace remaining variable names with adjusted values
      const fullyReplaced = withReversals.replace(/\b([A-Za-z0-9\-.]+)\b/g, (varName) => {
          if (!isNaN(varName)) return varName; // skip numbers
          const raw = responses[varName] ?? 0;
          return (parseFloat(raw) + lowest).toFixed(2); // ensure float with 2 decimal places
      });

      try {
          return eval(fullyReplaced);
      } catch (e) {
          console.error("Failed to evaluate:", fullyReplaced, e);
          return 0;
      }
  };

  // Calculate factor scores
  const factorScores = {};
  for (const factor in questionnaire.factors) {
      const factorData = questionnaire.factors[factor];
      factorScores[factor] = parseFloat(applyScoreEquation(factorData.score_equation, responses).toFixed(2));
  }

  // Calculate total score
  const totalScore = parseFloat(applyScoreEquation(questionnaire.total_score_equation, responses).toFixed(2));

  return {
      factorScores,
      totalScore
  };
}


function collectResponses() {
  const systemName = document.getElementById('system-name').value.trim();
  const participantId = document.getElementById('participant-id').value.trim();
  const condition = document.getElementById('condition').value.trim();

  // Validate basic fields
  if (!participantId) {
      alert("Please enter your Participant ID.");
      throw new Error("Participant ID missing");
  }
  if (!systemName) {
      alert("Please enter the System Name.");
      throw new Error("System name missing");
  }
  if (!condition) {
    alert("Please enter the condition.");
    throw new Error("Condition name missing.");
  }

  const checkboxesContainer = document.getElementById('checkboxes');
  const checkboxElements = checkboxesContainer.querySelectorAll('input[type="checkbox"]');

  const activeQuestionnaires = [];
  let foundChecked = false;

  checkboxElements.forEach((checkbox, index) => {
      if (checkbox.checked) {
          foundChecked = true;

          const questionnaire = questionnaireData[index];
          if (!questionnaire) {
              console.warn(`No questionnaire found at index ${index}`);
              return;
          }

          // Handle demographics
          if (questionnaire.title.toLowerCase() === 'demographics') {
            const questionnaireResponses = {};

            ['gender-identity', 'age', 'country', 'course-or-job'].forEach(field => {
                const textInput = document.getElementById(field);
                const optOut = document.getElementById(`${field}-opt-out`);
                
                if (optOut?.checked) {
                    questionnaireResponses[field] = 'Prefer not to answer';
                } else if (textInput?.value.trim()) {
                    questionnaireResponses[field] = textInput.value.trim();
                } else {
                    questionnaireResponses[field] = 'Not provided';
                }
            });

            activeQuestionnaires.push({
                title: questionnaire.title,
                responses: questionnaireResponses,
                factorScores: {},
                totalScore: 0
            });

            return; // Skip score calculation
        }

          // continue...
          
          const questionnaireDiv = document.getElementById(`questionnaire-${index}-content`);
          const questionnaireResponses = {};
          let allAnswered = true;

          questionnaire.statements.forEach(statement => {
              const radioName = `question-${questionnaire.title}-${statement.code}`;
              const selectedRadio = questionnaireDiv.querySelector(`input[name="${radioName}"]:checked`);
              if (selectedRadio) {
                  questionnaireResponses[statement.code] = parseInt(selectedRadio.value);
              } else {
                  allAnswered = false;
              }
          });

          if (!allAnswered) {
              alert(`Please answer all questions in the "${questionnaire.title}" questionnaire.`);
              throw new Error('Incomplete questionnaire responses');
          }

          const {
              factorScores,
              totalScore
          } = calculateScore(questionnaire, questionnaireResponses);

          activeQuestionnaires.push({
              title: questionnaire.title,
              responses: questionnaireResponses,
              factorScores,
              totalScore
          });
      }
  });

  if (!foundChecked) {
      alert("Please select at least one questionnaire to submit.");
      throw new Error("No questionnaires selected");
  }

  return {
      systemName,
      condition,
      participantId,
      activeQuestionnaires
  };
}


document.getElementById('submit-button').addEventListener('click', function() {
  try {
      const {
          systemName,
          condition,
          participantId,
          activeQuestionnaires
      } = collectResponses();

      
      // Compose the scores content
const date = new Date().toLocaleDateString();
const body = activeQuestionnaires.map(q => {
    // Special case for demographics
    if (q.title.toLowerCase() === 'demographics') {
        const demographicsText = Object.entries(q.responses).map(
            ([key, value]) => `  - ${key.replace(/-/g, ' ')}: ${value}`
        ).join('\n');

        return `
Questionnaire: ${q.title}
Responses:
${demographicsText}`.trim();
    }

    // Default for standard questionnaires
    const factorScoresText = Object.entries(q.factorScores).map(
        ([factor, score]) => `  - ${factor}: ${score.toFixed(2)}`
    ).join('\n');

    return `
Questionnaire: ${q.title}
Total Score: ${q.totalScore.toFixed(2)}
Factor Scores:
${factorScoresText}`.trim();
}).join('\n\n');

const scoreText = `
Questionnaire Results: ${date}
==================================

Here are your questionnaire results for ${participantId}.

System: ${systemName}
Condition: ${condition}

${body}`.trim();

// Display the result in the textarea
document.getElementById('score-preview').value = scoreText;
  } catch (error) {
      console.warn("Submission blocked:", error.message);
  }
});

// to excel
document.addEventListener("DOMContentLoaded", () => {
  const downloadXlsxBtn = document.getElementById("download-xlsx");

  if (downloadXlsxBtn) {
    downloadXlsxBtn.addEventListener("click", async function () {
      try {
        const { condition, participantId, activeQuestionnaires } = collectResponses();

        const wb = XLSX.utils.book_new();

        // --- HEADER ROW ---
        const header = ["Participant ID"];

        // Demographics columns first
        const demographicsFields = ["Gender Identity", "Age", "Country", "Course or Job"];
        header.push(...demographicsFields);

        // Build questionnaire + factor columns in order
        activeQuestionnaires
          .filter(q => q.title.toLowerCase() !== "demographics")
          .forEach(q => {
            // Questionnaire total score column
            header.push(`${condition}_${q.title}`);
            // Its factors
            Object.keys(q.factorScores || {}).forEach(factor => {
              header.push(`${condition}_${factor}`);
            });
          });

        const rows = [header];

        // --- DATA ROW ---
        const row = [participantId];

        // Add demographics first
        const demographicsQ = activeQuestionnaires.find(q => q.title.toLowerCase() === "demographics");
        if (demographicsQ) {
          row.push(demographicsQ.responses["gender-identity"] || "");
          row.push(demographicsQ.responses["age"] || "");
          row.push(demographicsQ.responses["country"] || "");
          row.push(demographicsQ.responses["course-or-job"] || "");
        } else {
          row.push("", "", "", "");
        }

        // Add questionnaire scores + factors in order
        activeQuestionnaires
          .filter(q => q.title.toLowerCase() !== "demographics")
          .forEach(q => {
            row.push(q.totalScore.toFixed(2)); // total score
            Object.keys(q.factorScores || {}).forEach(factor => {
              row.push(q.factorScores[factor].toFixed(2));
            });
          });

        rows.push(row);

        // --- CREATE WORKSHEET ---
        const ws = XLSX.utils.aoa_to_sheet(rows);
        XLSX.utils.book_append_sheet(wb, ws, "Scores");

        // --- SAVE FILE ---
        const date = new Date().toISOString().split("T")[0];
        const filename = `Scores_${participantId}_${date}.xlsx`;

        XLSX.writeFile(wb, filename);
      } catch (error) {
        console.error("Error generating XLSX:", error);
        alert("Failed to generate XLSX file. Please check console for details.");
      }
    });
  }
});
