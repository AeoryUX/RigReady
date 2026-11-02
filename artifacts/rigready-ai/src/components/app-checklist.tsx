import { useState } from 'react';
import { ExternalLink, X } from 'lucide-react';

type AppSite = { name: string; officialUrl: string };

export function AppChecklist({ apps, onRemove, onClear }: {
  apps: AppSite[];
  onRemove: (name: string) => void;
  onClear: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  function openSelectedSites() {
    setExpanded(true);
    // Keep these calls synchronous with the click for browser popup permissions.
    for (const app of apps) {
      try {
        window.open(app.officialUrl, '_blank', 'noopener,noreferrer');
      } catch {
        // Individual links below remain available when the browser refuses tabs.
      }
    }
  }

  return (
    <section className="app-checklist" aria-labelledby="checklist-title">
      <div className="checklist-heading">
        <div>
          <h2 id="checklist-title">Your app checklist</h2>
          <p>Select apps below, then visit their official websites.</p>
        </div>
        <span className="checklist-count" role="status" aria-live="polite">{apps.length} selected</span>
      </div>
      <div className="checklist-actions">
        <button className="guide-primary-button" type="button" disabled={apps.length === 0} onClick={openSelectedSites}>
          Open selected websites ({apps.length}) <ExternalLink size={14} aria-hidden="true" />
        </button>
        <button className="checklist-clear" type="button" disabled={apps.length === 0} onClick={onClear}>Clear selection</button>
      </div>
      {apps.length > 0 && (
        <details className="checklist-details" open={expanded} onToggle={(event) => setExpanded(event.currentTarget.open)}>
          <summary>View selected app websites</summary>
          <p>Your browser may block multiple tabs. Allow pop-ups for RigReady, or open each site using its link below.</p>
          <ul className="checklist-links">
            {apps.map((app) => (
              <li key={app.name}>
                <a href={app.officialUrl} target="_blank" rel="noopener noreferrer">{app.name}<ExternalLink size={12} aria-hidden="true" /></a>
                <button type="button" onClick={() => onRemove(app.name)} aria-label={`Remove ${app.name} from checklist`}><X size={14} aria-hidden="true" /></button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
