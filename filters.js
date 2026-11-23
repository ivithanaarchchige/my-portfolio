const filters = document.querySelector('.filters');

if (filters) {
  const buttons = [...filters.querySelectorAll('button[data-filter]')];
  const projects = [...document.querySelectorAll('.project-card')];
  const results = document.querySelector('#filter-results');

  function showCategory(category) {
    let visibleCount = 0;
    for (const project of projects) {
      project.hidden = category !== 'all' && project.dataset.category !== category;
      if (!project.hidden) visibleCount += 1;
    }
    for (const button of buttons) {
      button.setAttribute('aria-pressed', String(button.dataset.filter === category));
    }
    results.textContent = `${visibleCount} ${visibleCount === 1 ? 'project' : 'projects'} shown.`;
  }

  filters.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-filter]');
    if (button) showCategory(button.dataset.filter);
  });

  filters.hidden = false;
}
