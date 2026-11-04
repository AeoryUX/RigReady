import { useEffect, useState } from 'react';
import { ExternalLink, X } from 'lucide-react';

type AppSite = { name: string; officialUrl: string };

export function AppChecklist({ apps, selectedNames, onRemove, onClear }: {
  apps: AppSite[];
  selectedNames: ReadonlySet<string>;
  onRemove: (name: string) => void;
  onClear: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [requestedNames, setRequestedNames] = useState<Set<string>>(() => new Set());
  const [bulkAttempted, setBulkAttempted] = useState(false);
  const catalog = new Map(apps.map((app) => [app.name, app]));
  // Set iteration preserves the order in which the visitor checked the apps.
  const selectedApps = [...selectedNames].map((name) => catalog.get(name)).filter((app): app is AppSite => Boolean(app));
  const selectedUrls = [...new Set(selectedApps.map((app) => app.officialUrl))];
  const nextApp = selectedApps.find((app) => !requestedNames.has(app.name));

  useEffect(() => {
    setRequestedNames((previous) => {
      const next = new Set([...previous].filter((name) => selectedNames.has(name)));
      return next.size === previous.size ? previous : next;
    });
  }, [selectedNames]);

  function markRequested(name: string) {
    // Let native link activation capture this href before advancing the queue.
    // Updating during the click can replace it with the next app's URL.
    window.setTimeout(() => {
      setRequestedNames((previous) => new Set(previous).add(name));
      setExpanded(true);
    }, 0);
  }

  function openAllSelected() {
    setExpanded(true);
    setBulkAttempted(true);
    // A browser may block later calls. A null return also occurs with noopener,
    // so it cannot reliably tell us which tabs opened. Keep the direct links.
    for (const url of selectedUrls) {
      try { window.open(url, '_blank', 'noopener,noreferrer'); } catch { /* Use the direct links below. */ }
    }
  }

  return (
    <section className="app-checklist" aria-labelledby="checklist-title">
      <div className="checklist-heading">
        <div><h2 id="checklist-title">Your app checklist</h2><p>Open checked apps in the order you selected them. Selections stay checked across searches and categories.</p></div>
        <span className="checklist-count" role="status" aria-live="polite">{selectedApps.length} selected</span>
      </div>
      <div className="checklist-actions">
        {nextApp ? <a className="guide-primary-link checklist-next" href={nextApp.officialUrl} target="_blank" rel="noopener noreferrer" onClick={() => markRequested(nextApp.name)} onAuxClick={(event) => { if (event.button === 1) markRequested(nextApp.name); }}><span>Open next: {nextApp.name}</span><ExternalLink size={14} aria-hidden="true" /></a>
          : selectedApps.length > 0 ? <button className="guide-primary-button" type="button" onClick={() => setRequestedNames(new Set())}>Start opening the list again</button>
          : <button className="guide-primary-button" type="button" disabled>Open next selected website</button>}
        {selectedApps.length > 1 && <button className="checklist-clear" type="button" onClick={openAllSelected}>Open all selected websites ({selectedUrls.length})</button>}
        <button className="checklist-clear" type="button" disabled={selectedApps.length === 0} onClick={() => { setRequestedNames(new Set()); setBulkAttempted(false); onClear(); }}>Clear selection</button>
      </div>
      {selectedApps.length > 0 && <p className="checklist-opening-help">{nextApp ? 'Open next uses one direct link per click. Your browser may block extra tabs when opening all at once.' : 'You reached the end of your checklist. The individual links remain available below.'}</p>}
      {bulkAttempted && selectedApps.length > 0 && <p className="checklist-opening-help" role="status">If only one tab opened, use Open next or the individual links below. Bulk opening depends on your browser’s popup settings.</p>}
      {selectedApps.length > 0 && (
        <details className="checklist-details" open={expanded} onToggle={(event) => setExpanded(event.currentTarget.open)}>
          <summary>View selected app websites</summary>
          <ul className="checklist-links">
            {selectedApps.map((app) => <li key={app.name}>
              <a href={app.officialUrl} target="_blank" rel="noopener noreferrer" onClick={() => markRequested(app.name)} onAuxClick={(event) => { if (event.button === 1) markRequested(app.name); }}>{app.name}<ExternalLink size={12} aria-hidden="true" /></a>
              <button type="button" onClick={() => onRemove(app.name)} aria-label={`Remove ${app.name} from checklist`}><X size={14} aria-hidden="true" /></button>
            </li>)}
          </ul>
        </details>
      )}
    </section>
  );
}
