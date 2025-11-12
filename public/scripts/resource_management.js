// Load and render the table
async function fetchResources() {
  try {
    const response = await fetch('../data/resources.json'); // adjust path if needed
    if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
    const data = await response.json();
    renderResources(data);
  } catch (error) {
    console.error('Failed to load resources:', error);
  }
}

function renderResources(data) {
  const tbody = document.querySelector('#resourcesTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  data.forEach(item => {
    const tr = document.createElement('tr');
    tr.setAttribute('data-id', item.id);

    // Image cell
    const imgTd = document.createElement('td');
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = `${item.name} image`;
    img.width = 120;
    imgTd.appendChild(img);
    tr.appendChild(imgTd);

    // Content cell
    const contentTd = document.createElement('td');

    const title = document.createElement('h3');
    title.textContent = item.name;
    contentTd.appendChild(title);

    const meta = document.createElement('div');
    meta.textContent = `${item.type} • Capacity: ${item.capacity}`;
    contentTd.appendChild(meta);

    // Status
    const status = document.createElement('div');
    status.className = 'status';
    status.dataset.status = item.status; // "open" | "blocked"
    status.textContent = item.status === 'open' ? 'Open' : 'Blocked';
    contentTd.appendChild(status);

    const avail = document.createElement('div');
    avail.textContent = `Availability: ${item.availability}`;
    contentTd.appendChild(avail);

    const loc = document.createElement('div');
    loc.textContent = `Location: ${item.location}`;
    contentTd.appendChild(loc);

    const desc = document.createElement('p');
    desc.textContent = item.description;
    contentTd.appendChild(desc);

    //Static stats section (same for all resources)
    const statsRow = document.createElement('div');
    statsRow.className = 'stats';
    statsRow.innerHTML = `
      <div class="stat">
        <span class="label">Peak time:</span>
        <span class="value">12 PM</span>
      </div>
      <div class="stat">
        <span class="label">Resource availability:</span>
        <span class="value">25%</span>
      </div>
    `;
    contentTd.appendChild(statsRow);

    // Actions
    const actions = document.createElement('div');

    // pass item via query string
    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => {
      const query = new URLSearchParams(item).toString(); // to properly serialize the data to be passed
      window.location.href = `edit_resource.html?${query}`;
    });
    actions.appendChild(editBtn);

    // Block / Unblock toggler that stays dark when blocked
    const blockBtn = document.createElement('button');
    blockBtn.type = 'button';
    blockBtn.textContent = item.status === 'open' ? 'Block' : 'Unblock';
    if (item.status === 'blocked') blockBtn.classList.add('blocked');

    blockBtn.addEventListener('click', () => {
      // update status in data
      item.status = item.status === 'open' ? 'blocked' : 'open';
      // Re-render so status color and button style/text update consistently
      renderResources(data);
    });
    actions.appendChild(blockBtn);

    contentTd.appendChild(actions);
    tr.appendChild(contentTd);

    tbody.appendChild(tr);
  });
}

fetchResources();
