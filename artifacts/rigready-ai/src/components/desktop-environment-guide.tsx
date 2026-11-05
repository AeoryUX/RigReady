import { useState } from 'react';
import { ExternalLink, Info } from 'lucide-react';
import { NameSortMenu, type NameSort } from '@/components/name-sort-menu';
import { LinuxSupportBadge, LinuxSupportLegend, linuxOnly } from '@/components/os-support';
import { desktopOptions, type DesktopKind } from '@/data/desktop-options';

const guideCopy: Record<DesktopKind, { id: string; title: string; description: string; sortLabel: string }> = {
  'Desktop environment': { id: 'desktop-environments', title: 'Desktop environments', description: 'Complete Linux desktops with an interface, settings, and everyday tools. Compare the workflow and customization each one offers.', sortLabel: 'Sort desktop environments' },
  Compositor: { id: 'window-managers', title: 'Window managers', description: 'Compare Wayland compositors, X11 window managers, and desktop-integrated components. Each card identifies its type so you can choose tools for the display session you use.', sortLabel: 'Sort window managers' },
  Shell: { id: 'desktop-shells', title: 'Shells', description: 'Graphical desktop shells provide panels, launchers, notifications, and controls. Toolkits, panels, and desktop setups are labelled separately. Check the supported distributions and compositors.', sortLabel: 'Sort shells' },
};

export function DesktopEnvironmentGuide({ kind }: { kind: DesktopKind }) {
  const copy = guideCopy[kind];
  const [sort, setSort] = useState<NameSort>('name-asc');
  const visibleOptions = desktopOptions.filter((option) => option.kind === kind)
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }) * (sort === 'name-desc' ? -1 : 1));

  return (
    <section className="desktop-guide" id={copy.id} aria-labelledby={`${copy.id}-title`}>
      <div className="os-section-heading">
        <div><h2 id={`${copy.id}-title`}>{copy.title}</h2><p>{copy.description}</p></div>
        <span className="software-count" role="status" aria-live="polite">{visibleOptions.length} {visibleOptions.length === 1 ? 'option' : 'options'}</span>
      </div>
      <div className="os-catalog-controls">
        <NameSortMenu value={sort} onChange={setSort} label={copy.sortLabel} />
      </div>
      <LinuxSupportLegend />
      <div className="os-callout"><Info size={17} aria-hidden="true" /><p>Entries link to upstream projects and their documentation; inclusion is not a security audit. For a first setup, consider your distribution’s official desktop edition. Before applying a shell or dotfiles, check supported versions and back up your existing configuration.</p></div>
      <div className="os-distro-grid desktop-options-grid">
        {visibleOptions.map((option) => (
          <article className="os-distro-card desktop-option" key={option.name}>
            <span className="software-category">{option.displayKind ?? option.kind}</span><h3>{option.name}</h3>
            <p className="software-best-for">{option.bestFor}</p>
            <p className="os-copy">{option.description}</p>
            <LinuxSupportBadge support={option.osSupport ?? linuxOnly} />
            <p className="os-note"><Info size={14} aria-hidden="true" />{option.note}</p>
            <div className="os-card-links">
              <a className="os-link" href={option.url} target="_blank" rel="noopener noreferrer">Official project <ExternalLink size={13} aria-hidden="true" /></a>
              <a className="os-link" href={option.docs} target="_blank" rel="noopener noreferrer">Documentation <ExternalLink size={13} aria-hidden="true" /></a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
