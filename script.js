document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            populateTable(data);
        })
        .catch(error => console.error('Error fetching data:', error));
});

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
    const input = document.getElementById('search-input').value.toLowerCase();
    const tableBody = document.getElementById('table-body');
    const rows = tableBody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        let cells = rows[i].getElementsByTagName('td');
        let rowContainsQuery = false;
        for (let j = 0; j < cells.length; j++) {
            if (cells[j].textContent.toLowerCase().includes(input)) {
                rowContainsQuery = true;
                break;
            }
        }
        if (rowContainsQuery) {
            rows[i].style.display = '';
        } else {
            rows[i].style.display = 'none';
        }
    }
}
