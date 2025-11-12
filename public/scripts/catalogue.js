const STATE = {
  allResources: [],
  currentFilter: 'all', // 'all' or 'room' or 'lab' or 'equipment' or 'sport_facility'
};


function normalizeType(resource) {
  const raw_type = (resource.type).toString().trim().toLowerCase();

  if (raw_type === 'room') return 'room';
  if (raw_type === 'lab') return 'lab';
  if (raw_type === 'equipment') return 'equipment';
  if (raw_type.replace(/\s+/g, '_') === 'sport_facility') return 'sport_facility';
}

function filterResources(resources, filter) {
  if (filter === 'all') return resources;
  return resources.filter((r) => normalizeType(r) === filter);
}

// 3 items per row in #resourcesTable tbody
function renderResources(resources) {
  const tbody = document.querySelector('#resourcesTable tbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (!resources || resources.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>No resources found for this filter.</td>`;
    tbody.appendChild(tr);
    return;
  }

  let tr = document.createElement('tr');

  resources.forEach((resource, index) => {
    const {
      image = '',
      name = '',
      description = '',
      location = '',
      availability = '',
      capacity = '',
      status = ''
    } = resource;

    const typeNorm = normalizeType(resource);

    const td = document.createElement('td');
    td.innerHTML = `
      <img class="resource_img" src="${image}" alt="${typeNorm || 'resource'}" style="width:100%; max-width:150px; height:auto;"><br>
      <span class="resource_name"><strong>${name}</strong></span><br>
      <span class="resource_desc">${description}</span><br>
      <span class="resource_location">${location}</span><br>
      <span class="resource_availability">${availability}</span><br>
      <span class="resource_meta">Capacity: ${capacity || '—'} | Status: ${status || '—'}</span>
    `;

    tr.appendChild(td);

    // 3 per row
    if ((index + 1) % 3 === 0) {
      tbody.appendChild(tr);
      tr = document.createElement('tr');
    }
  });

  // add the remained cells
  if (tr.children.length > 0) {
    tbody.appendChild(tr);
  }
}

function setupFilters() {
  const container = document.getElementById('resource_filters');
  if (!container) return;

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-filter]');
    if (!btn) return;

    // Update active visuals (optional)
    container.querySelectorAll('button[data-filter]').forEach(b => {
      const active = b === btn;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    STATE.currentFilter = btn.dataset.filter || 'all';
    const filtered = filterResources(STATE.allResources, STATE.currentFilter);
    renderResources(filtered);
  });

  // Mark "All" active initially
  const allBtn = container.querySelector('button[data-filter="all"]');
  if (allBtn) {
    allBtn.classList.add('active');
    allBtn.setAttribute('aria-pressed', 'true');
  }
}

async function initCatalogue() {
  try {
    const res = await fetch('../data/resources.json', { cache: 'no-store' });
    const data = await res.json();

    STATE.allResources = Array.isArray(data) ? data : [];
    setupFilters();

    // In the beginning show all
    renderResources(filterResources(STATE.allResources, STATE.currentFilter));
  } catch (err) {
    console.error('Error loading resources:', err);
    const tbody = document.querySelector('#resourcesTable tbody');
    if (tbody) {
      tbody.innerHTML = `<tr><td>Failed to load resources.</td></tr>`;
    }
  }
}

document.addEventListener('DOMContentLoaded', initCatalogue);
