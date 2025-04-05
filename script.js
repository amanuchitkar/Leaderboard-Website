document.addEventListener('DOMContentLoaded', () => {
    // Load leaderboard data
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            populateTable(data);
            // Add event listener for real-time search
            const searchInput = document.getElementById('search-input');
            searchInput.addEventListener('input', () => searchTable());
        })
        .catch(error => console.error('Error fetching leaderboard data:', error));
    
    // Load challenges data
    loadChallenges();
});

function loadChallenges() {
    fetch('challenges.json')
        .then(response => response.json())
        .then(challenges => {
            displayChallenges(challenges);
        })
        .catch(error => {
            console.error('Error fetching challenges data:', error);
            displayFallbackChallenges(); // Display hardcoded challenges if JSON loading fails
        });
}

function displayChallenges(challenges) {
    const container = document.getElementById('challenges-container');
    if (!container) return;
    
    container.innerHTML = ''; // Clear container
    
    challenges.forEach(challenge => {
        const challengeCard = document.createElement('div');
        challengeCard.className = 'challenge-card';
        
        challengeCard.innerHTML = `
            <div class="challenge-title">
                <h3><i class="${challenge.icon}"></i> ${challenge.id}. ${challenge.name}</h3>
            </div>
            <div class="challenge-content">
                <div class="challenge-details">
                    <div class="challenge-info">
                        <p class="difficulty-level">Difficulty: <span class="level ${challenge.difficulty}">${challenge.difficultyText}</span></p>
                        <a href="${challenge.link}" target="_blank" rel="noopener" class="challenge-link">Access Challenge <i class="fas fa-external-link-alt"></i></a>
                        <div class="challenge-code">
                            <span>Code: </span>
                            <span class="code-value">${challenge.code}</span>
                            <button class="copy-code-btn" onclick="copyToClipboard('${challenge.code}')" title="Copy code to clipboard"><i class="fas fa-copy"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.appendChild(challengeCard);
    });
}

function displayFallbackChallenges() {
    // Fallback function to display hardcoded challenges if JSON loading fails
    const container = document.getElementById('challenges-container');
    if (!container) return;
    
    const fallbackChallenges = [
        {
            id: 1,
            name: "Basecamp Arcade",
            icon: "fas fa-gamepad",
            difficulty: "beginner",
            difficultyText: "Beginner",
            link: "https://www.cloudskillsboost.google/games/6059?utm_source=qwiklabs&utm_medium=lp&utm_campaign=basecamp-April-arcade25",
            code: "1q-basecamp-9932"
        },
        {
            id: 2,
            name: "Application Development",
            icon: "fas fa-code",
            difficulty: "intermediate",
            difficultyText: "Intermediate",
            link: "https://www.cloudskillsboost.google/games/6064?utm_source=qwiklabs&utm_medium=lp&utm_campaign=level1-April-arcade25",
            code: "1q-appdevscr-4912"
        },
        {
            id: 3,
            name: "API Capstone",
            icon: "fas fa-layer-group",
            difficulty: "advanced",
            difficultyText: "Advanced",
            link: "https://www.cloudskillsboost.google/games/6065?utm_source=qwiklabs&utm_medium=lp&utm_campaign=level2-April-arcade25",
            code: "1q-apicap-10000"
        },
        {
            id: 4,
            name: "Trivia Challenge",
            icon: "fas fa-question-circle",
            difficulty: "beginner",
            difficultyText: "Beginner",
            link: "https://www.cloudskillsboost.google/games/6058?utm_source=qwiklabs&utm_medium=lp&utm_campaign=arcade25-April-trivia",
            code: "1q-trivia-01202"
        }
    ];
    
    displayChallenges(fallbackChallenges);
}

// Function to populate table with leaderboard data
function populateTable(data) {
    const tableHeader = document.getElementById('table-header');
    const tableBody = document.getElementById('table-body');

    // Create tooltip container
    const tooltip = document.getElementById('tooltip');

    // Populate table headers
    const headers = Object.keys(data[0]);
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        tableHeader.appendChild(th);
    });

    // Populate table rows
    data.forEach((row, index) => {
        const tr = document.createElement('tr');

        // Add Sr. No. cell
        const srNoTd = document.createElement('td');
        srNoTd.textContent = index + 1;
        tr.appendChild(srNoTd);

        headers.forEach(header => {
            const td = document.createElement('td');
            const cellContent = row[header];

            if (isValidURL(cellContent)) {
                const link = document.createElement('a');
                link.href = cellContent;
                link.textContent = cellContent;
                link.target = '_blank'; // Open link in new tab
                td.appendChild(link);
            } else {
                td.textContent = cellContent;
            }

            // Add hover event listeners to each cell
            td.addEventListener('mouseover', (event) => {
                showTooltip(event, cellContent, tooltip);
            });
            td.addEventListener('mousemove', (event) => {
                moveTooltip(event, tooltip);
            });
            td.addEventListener('mouseout', () => {
                hideTooltip(tooltip);
            });

            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}

function isValidURL(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

function showTooltip(event, content, tooltip) {
    tooltip.textContent = content;
    tooltip.style.display = 'block';
    moveTooltip(event, tooltip);
}

function moveTooltip(event, tooltip) {
    tooltip.style.left = `${event.pageX + 10}px`;
    tooltip.style.top = `${event.pageY + 10}px`;
}

function hideTooltip(tooltip) {
    tooltip.style.display = 'none';
}

function searchTable() {
    const input = document.getElementById('search-input').value.toLowerCase().trim();
    const tableBody = document.getElementById('table-body');
    const rows = tableBody.getElementsByTagName('tr');
    let visibleCount = 0;

    for (let i = 0; i < rows.length; i++) {
        let cells = rows[i].getElementsByTagName('td');
        let rowContainsQuery = false;
        
        // Skip the Sr. No. column in search
        for (let j = 1; j < cells.length; j++) {
            const cellText = cells[j].textContent.toLowerCase();
            if (cellText.includes(input)) {
                rowContainsQuery = true;
                break;
            }
        }

        if (rowContainsQuery) {
            rows[i].style.display = '';
            visibleCount++;
        } else {
            rows[i].style.display = 'none';
        }
    }

    // Show "No results found" message if needed
    const noResultsMessage = document.getElementById('no-results-message');
    if (!noResultsMessage) {
        const message = document.createElement('div');
        message.id = 'no-results-message';
        message.className = 'no-results';
        message.textContent = 'No results found';
        tableBody.appendChild(message);
    }

    if (visibleCount === 0) {
        document.getElementById('no-results-message').style.display = '';
    } else {
        document.getElementById('no-results-message').style.display = 'none';
    }
}

// Function to copy referral code to clipboard
function copyReferralCode() {
    const referralCode = document.getElementById('referral-code-text').textContent;
    const tooltip = document.getElementById('tooltip');
    
    // Copy to clipboard
    navigator.clipboard.writeText(referralCode).then(() => {
        // Show tooltip
        tooltip.textContent = 'Copied to clipboard!';
        tooltip.classList.remove('hidden');
        tooltip.classList.add('visible');
        
        // Position tooltip near the copy button
        const copyButton = document.querySelector('.copy-button');
        const rect = copyButton.getBoundingClientRect();
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
        
        // Hide tooltip after 2 seconds
        setTimeout(() => {
            tooltip.classList.remove('visible');
            tooltip.classList.add('hidden');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

// Function to copy challenge codes to clipboard
function copyToClipboard(text) {
    const tooltip = document.getElementById('tooltip');
    
    // Copy to clipboard
    navigator.clipboard.writeText(text).then(() => {
        // Show tooltip
        tooltip.textContent = 'Copied to clipboard!';
        tooltip.classList.remove('hidden');
        tooltip.classList.add('visible');
        
        // Get position of the element that was clicked
        const activeElement = document.activeElement;
        const rect = activeElement.getBoundingClientRect();
        
        // Position tooltip near the copy button
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
        
        // Hide tooltip after 2 seconds
        setTimeout(() => {
            tooltip.classList.remove('visible');
            tooltip.classList.add('hidden');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            
            // Show tooltip
            tooltip.textContent = 'Copied to clipboard!';
            tooltip.classList.remove('hidden');
            tooltip.classList.add('visible');
            
            // Get position of the element that was clicked
            const activeElement = document.activeElement;
            const rect = activeElement.getBoundingClientRect();
            
            // Position tooltip near the copy button
            tooltip.style.left = rect.left + 'px';
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
            
            // Hide tooltip after 2 seconds
            setTimeout(() => {
                tooltip.classList.remove('visible');
                tooltip.classList.add('hidden');
            }, 2000);
        } catch (e) {
            console.error('Fallback: Could not copy text: ', e);
            alert('Copying failed. Please copy the code manually.');
        }
        
        document.body.removeChild(textArea);
    });
}
