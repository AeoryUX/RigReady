import { useState } from 'react';
import { ExternalLink, Info } from 'lucide-react';
import { NameSortMenu, type NameSort } from '@/components/name-sort-menu';

type DesktopKind = 'Desktop environment' | 'Compositor' | 'Shell';
type DesktopFilter = 'All options' | DesktopKind;
const desktopFilters: { value: DesktopFilter; label: string }[] = [
  { value: 'All options', label: 'All options' },
  { value: 'Desktop environment', label: 'Desktop environments' },
  { value: 'Compositor', label: 'Compositors' },
  { value: 'Shell', label: 'Shells' },
];

const desktopOptions: {
  name: string;
  kind: DesktopKind;
  bestFor: string;
  description: string;
  note: string;
  url: string;
  docs: string;
}[] = [
  {
    name: 'KDE Plasma', kind: 'Desktop environment', bestFor: 'A complete desktop with extensive customization',
    description: 'A full Linux desktop with panels, widgets, settings, and a flexible window-management workflow.',
    note: 'A distribution’s official Plasma edition is a straightforward starting point. Follow its supported packages and drivers.',
    url: 'https://kde.org/plasma-desktop/', docs: 'https://userbase.kde.org/Plasma',
  },
  {
    name: 'GNOME', kind: 'Desktop environment', bestFor: 'A focused workspace and application workflow',
    description: 'A complete desktop centered on the Activities overview, workspaces, and a consistent set of desktop applications.',
    note: 'Extensions can change the experience; check their compatibility when upgrading GNOME.',
    url: 'https://www.gnome.org/', docs: 'https://help.gnome.org/',
  },
  {
    name: 'Xfce', kind: 'Desktop environment', bestFor: 'A traditional desktop with modest resource needs',
    description: 'A configurable desktop with a familiar panel, application menu, file manager, and settings tools.',
    note: 'Compare your distribution’s current requirements and test a live session on older hardware.',
    url: 'https://www.xfce.org/', docs: 'https://docs.xfce.org/',
  },
  {
    name: 'Cinnamon', kind: 'Desktop environment', bestFor: 'A familiar panel-and-menu desktop',
    description: 'The desktop developed by Linux Mint, with a traditional layout, applets, themes, and graphical settings.',
    note: 'Linux Mint’s Cinnamon edition provides an integrated starting point; availability on other distributions varies.',
    url: 'https://projects.linuxmint.com/cinnamon/', docs: 'https://github.com/linuxmint/cinnamon',
  },
  {
    name: 'MATE', kind: 'Desktop environment', bestFor: 'A classic desktop workflow',
    description: 'A desktop with traditional menus, panels, and applications for users who prefer a familiar interface.',
    note: 'Check whether your distribution provides a maintained MATE edition or supported desktop package group.',
    url: 'https://mate-desktop.org/', docs: 'https://wiki.mate-desktop.org/',
  },
  {
    name: 'COSMIC', kind: 'Desktop environment', bestFor: 'Workspaces and a tiling-capable desktop',
    description: 'System76’s desktop environment, with workspace and window-management features for customizable workflows.',
    note: 'Follow the current System76 or distribution instructions for hardware support and available packages.',
    url: 'https://system76.com/cosmic/', docs: 'https://github.com/pop-os/cosmic-epoch',
  },
  {
    name: 'Hyprland', kind: 'Compositor', bestFor: 'A custom Wayland tiling setup',
    description: 'A Wayland compositor that manages windows, layouts, and effects. Add compatible desktop tools or a shell to build your preferred interface.',
    note: 'Expect configuration work. Check graphics support and your distribution’s installation guidance before changing sessions.',
    url: 'https://hypr.land/', docs: 'https://wiki.hypr.land/',
  },
  {
    name: 'Caelestia', kind: 'Shell', bestFor: 'A fluid, customizable desktop interface',
    description: 'A Linux desktop shell from the Caelestia project, providing the interface around a compositor-driven desktop setup.',
    note: 'Read its supported setup and configuration requirements before applying its shell or related dotfiles.',
    url: 'https://github.com/caelestia-dots/shell', docs: 'https://caelestiashell.com/',
  },
  {
    name: 'Ryoku', kind: 'Shell', bestFor: 'A Hyprland desktop setup with project tooling',
    description: 'A desktop setup from the Ryoku project, with a shell experience and related tools for its supported Linux configurations.',
    note: 'Ryoku includes a broader desktop setup and project tools. Follow the official guide for your distribution and compositor; installation paths differ between supported setups.',
    url: 'https://ryoku.dev/', docs: 'https://docs.ryoku.dev/',
  },
  {
    name: 'Noctalia', kind: 'Shell', bestFor: 'An integrated interface for a Wayland compositor',
    description: 'A customizable desktop shell with panels, launcher, notifications, and controls for supported Wayland compositor workflows.',
    note: 'Check the project’s current compositor integrations; available features can differ between setups.',
    url: 'https://github.com/noctalia-dev/noctalia', docs: 'https://docs.noctalia.dev/noctalia/getting-started/installation/',
  },
];

export function DesktopEnvironmentGuide() {
  const [filter, setFilter] = useState<DesktopFilter>('All options');
  const [sort, setSort] = useState<NameSort>('name-asc');
  const visibleOptions = desktopOptions.filter((option) => filter === 'All options' || option.kind === filter)
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }) * (sort === 'name-desc' ? -1 : 1));

  return (
    <section className="desktop-guide" id="desktop-environments" aria-labelledby="desktop-title">
      <div className="os-section-heading">
        <div><h2 id="desktop-title">Choose your Linux desktop.</h2><p>Desktop environments bundle a desktop’s interface and tools. A compositor such as Hyprland manages windows; shells add panels, launchers, and controls around supported compositor setups.</p></div>
        <span className="software-count" role="status" aria-live="polite">{visibleOptions.length} {visibleOptions.length === 1 ? 'option' : 'options'}</span>
      </div>
      <div className="os-catalog-controls">
        <div className="software-filters" role="group" aria-label="Filter desktop options">
          {desktopFilters.map((option) => <button className={`software-filter${filter === option.value ? ' is-active' : ''}`} type="button" key={option.value} aria-pressed={filter === option.value} onClick={() => setFilter(option.value)}>{option.label}</button>)}
        </div>
        <NameSortMenu value={sort} onChange={setSort} label="Sort desktop options" />
      </div>
      <div className="os-callout"><Info size={17} aria-hidden="true" /><p>For a first setup, consider your distribution’s official desktop edition. Before applying a shell or dotfiles, check supported versions and back up your existing configuration. A shell project may replace panels, shortcuts, and other settings.</p></div>
      <div className="os-distro-grid desktop-options-grid">
        {visibleOptions.map((option) => (
          <article className="os-distro-card desktop-option" key={option.name}>
            <span className="software-category">{option.kind}</span><h3>{option.name}</h3>
            <p className="software-best-for">{option.bestFor}</p>
            <p className="os-copy">{option.description}</p>
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
