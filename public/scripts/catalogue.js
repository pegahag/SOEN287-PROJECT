function renderResources(resources) {
  const tbody = document.querySelector('#resourcesTable tbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  // see if user is logged in (sid cookie exists)
  const isLoggedIn = document.cookie.includes("sid=");

  if (!resources || resources.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>No resources found for this filter.</td>`;
    tbody.appendChild(tr);
    return;
  }

  let tr = document.createElement('tr');

  resources.forEach((resource, index) => {
    const image = resource.image || '';
    const name = resource.name || resource.title || '';
    const description = resource.description || '';
    const location =
      resource.location ||
      `${resource.street || ''} ${resource.postalCode || ''}`.trim();
    const availability =
      resource.availability ||
      `${resource.startDate || ''} ${resource.startHour || ''} - ${resource.endDate || ''} ${resource.endHour || ''}`.trim();
    const capacity = resource.capacity ?? '';
    const status = resource.status || 'open';
    const typeNorm = normalizeType(resource);
    const id = resource.id;

    // based on whther loged in or not, redirects user (where the image link should go)
    const href = isLoggedIn
      ? `event_page.html?mode=create&resource=${encodeURIComponent(id)}`
      : `login.html`;

    const td = document.createElement('td');
    td.innerHTML = `
      <a href="${href}">
        <img class="resource_img" src="${image}" alt="${typeNorm || 'resource'}"
             style="width:100%; max-width:150px; height:auto;">
      </a><br>

      <span class="resource_name"><strong>${name}</strong></span><br>
      <span class="resource_desc">${description}</span><br>
      <span class="resource_location">${location}</span><br>
      <span class="resource_availability">${availability}</span><br>
      <span class="resource_meta">Capacity: ${capacity || '—'} | Status: ${status || '—'}</span>
    `;

    tr.appendChild(td);

    if ((index + 1) % 3 === 0) {
      tbody.appendChild(tr);
      tr = document.createElement('tr');
    }
  });

  if (tr.children.length > 0) {
    tbody.appendChild(tr);
  }
}
