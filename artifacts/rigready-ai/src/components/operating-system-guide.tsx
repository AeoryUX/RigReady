import { useEffect, useState, type ReactNode } from 'react';
import { Download, ExternalLink, Info, ShieldCheck } from 'lucide-react';
import { LinuxGamingGuide, ProtonDbButton } from '@/components/linux-gaming-guide';
import { DesktopEnvironmentGuide } from '@/components/desktop-environment-guide';
import { NameSortMenu, type NameSort } from '@/components/name-sort-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type LinuxUse = 'New to Linux' | 'Gaming' | 'Older PCs' | 'Advanced';
type LinuxFilter = 'All Linux picks' | LinuxUse;

const linuxFilters: LinuxFilter[] = ['All Linux picks', 'New to Linux', 'Gaming', 'Older PCs', 'Advanced'];

const linuxPicks: {
  name: string;
  bestFor: string;
  description: string;
  note: string;
  uses: LinuxUse[];
  download: string;
  docs: string;
}[] = [
  {
    name: 'Linux Mint',
    bestFor: 'A comfortable first Linux desktop',
    description: 'A familiar desktop layout with graphical update and software tools. Cinnamon is the main edition; Xfce is worth considering for a less demanding desktop.',
    note: 'For an older PC, check the current requirements and try the Xfce live image before installing.',
    uses: ['New to Linux', 'Older PCs'],
    download: 'https://linuxmint.com/download.php',
    docs: 'https://linuxmint-installation-guide.readthedocs.io/en/latest/',
  },
  {
    name: 'Ubuntu LTS',
    bestFor: 'Broad documentation and long-term support',
    description: 'A well-documented starting point for everyday use, development, and gaming. Choose an LTS release if you prefer a longer support window.',
    note: 'Check your GPU driver and game requirements; Linux support varies by game.',
    uses: ['New to Linux'],
    download: 'https://ubuntu.com/download/desktop',
    docs: 'https://ubuntu.com/tutorials/install-ubuntu-desktop',
  },
  {
    name: 'Bazzite',
    bestFor: 'A gaming-focused PC or supported handheld',
    description: 'A Fedora-based, image-based system with gaming tools and options for a console-like Steam experience on supported hardware.',
    note: 'Use its image picker to match your device and GPU. Its software and update workflow differs from a traditional Linux desktop.',
    uses: ['Gaming'],
    download: 'https://bazzite.gg/',
    docs: 'https://docs.bazzite.gg/',
  },
  {
    name: 'Fedora',
    bestFor: 'A current desktop for gaming and everyday work',
    description: 'A regularly updated Linux system with a choice of desktops, including Workstation with GNOME and KDE Plasma Desktop. Flexible for a PC used for both work and play.',
    note: 'Expect regular release upgrades. Proprietary drivers and some media codecs may need additional setup.',
    uses: ['New to Linux'],
    download: 'https://fedoraproject.org/',
    docs: 'https://docs.fedoraproject.org/en-US/quick-docs/creating-and-using-a-live-installation-image/',
  },
  {
    name: 'Zorin OS',
    bestFor: 'An approachable switch from Windows',
    description: 'An Ubuntu-based desktop with familiar layouts and a guided desktop experience for people moving to Linux.',
    note: 'The Core edition is free. The optional paid Pro edition is not required to get started or install games.',
    uses: ['New to Linux'],
    download: 'https://zorin.com/os/download/',
    docs: 'https://help.zorin.com/docs/getting-started/install-zorin-os/',
  },
  {
    name: 'EndeavourOS',
    bestFor: 'Experienced users who want an Arch-based setup',
    description: 'A rolling-release Linux distribution for people who enjoy configuring their system and working with the terminal.',
    note: 'Plan for ongoing maintenance, frequent updates, and occasional manual intervention. Start with a simpler option if you are new to Linux.',
    uses: ['Advanced'],
    download: 'https://endeavouros.com/',
    docs: 'https://discovery.endeavouros.com/',
  },
  {
    name: 'CachyOS',
    bestFor: 'Experienced users who want a performance-focused gaming setup',
    description: 'An Arch-based rolling-release distribution with performance-oriented packages, kernel options, and a choice of desktops.',
    note: 'Check the supported CPU requirements and plan for regular updates and hands-on maintenance. Performance gains depend on your hardware and workload.',
    uses: ['Gaming', 'Advanced'],
    download: 'https://cachyos.org/download/',
    docs: 'https://wiki.cachyos.org/',
  },
  {
    name: 'Nobara Linux',
    bestFor: 'Gaming, streaming, and content creation',
    description: 'An independent Fedora-based distribution that brings together gaming tools, drivers, and media support for a desktop used for play and creative work.',
    note: 'Choose an image that matches your graphics hardware and follow Nobara’s own installation, driver, and update instructions.',
    uses: ['Gaming'],
    download: 'https://nobaraproject.org/download-nobara/',
    docs: 'https://wiki.nobaraproject.org/',
  },
  {
    name: 'Pop!_OS',
    bestFor: 'A desktop for gaming and everyday productivity',
    description: 'An Ubuntu-based distribution from System76 with a productivity-focused desktop and download options for different graphics hardware.',
    note: 'Follow System76’s current hardware, graphics, and Secure Boot guidance when choosing and installing an image.',
    uses: ['Gaming'],
    download: 'https://system76.com/pop/',
    docs: 'https://support.system76.com/articles/install-pop/',
  },
];

const installationSteps = [
  {
    title: 'Choose and download your image',
    detail: 'Open the distribution’s official download page or one of its listed mirrors. Most Intel/AMD PCs use x86_64, also called amd64. ARM devices need an explicitly supported ARM image. Check memory, storage, and GPU requirements before downloading the ISO.',
  },
  {
    title: 'Verify the download',
    detail: 'Compare the ISO’s SHA-256 checksum with the value published by the project. If the project provides signed checksum files, follow its signature-verification instructions too. Redownload a file whose checksum does not match.',
  },
  {
    title: 'Create a bootable USB',
    detail: 'Use the distribution’s recommended writing tool or balenaEtcher for a supported Linux ISO. A 16 GB USB drive is a practical starting point; check that the image fits. Writing the image erases the selected USB, so double-check the drive you choose.',
  },
  {
    title: 'Boot and try the live session',
    detail: 'Restart and open your device’s boot menu using the manufacturer’s instructions. Select the USB in UEFI mode. If a live session is available, test Wi-Fi, audio, display, and sleep before installing. Follow the distribution’s Secure Boot guidance for your hardware.',
  },
  {
    title: 'Install onto the intended drive',
    detail: 'Follow the official installer guide. “Erase disk” deletes data on the selected drive. To keep another OS, use the distribution’s dual-boot instructions or install to a separate drive; do not guess at partition changes.',
  },
  {
    title: 'Update, then set up your games',
    detail: 'Remove the installer USB when prompted, boot into your new system, and apply system updates. Install drivers and software through trusted distribution or vendor sources. Set up Steam and Proton where supported, then test your own games.',
  },
];

function OfficialLink({ href, children }: { href: string; children: ReactNode }) {
  return <a className="os-link" href={href} target="_blank" rel="noopener noreferrer">{children}<ExternalLink size={13} aria-hidden="true" /></a>;
}

function guideLocationForFragment() {
  // Render the target panel before the page's initial fragment-scroll effect.
  const fragment = window.location.hash.slice(1);
  if (fragment.startsWith('desktop-environments')) return { system: 'linux', section: 'desktop' };
  if (fragment.startsWith('window-managers')) return { system: 'linux', section: 'window-managers' };
  if (fragment.startsWith('desktop-shells')) return { system: 'linux', section: 'shells' };
  return { system: fragment.startsWith('linux-') ? 'linux' : 'windows', section: 'distributions' };
}

function clearGuideFragment() {
  // A manual tab change should not leave a link to a now-hidden Linux section.
  if (guideLocationForFragment().system === 'linux') {
    window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
  }
}

export function OperatingSystemGuide() {
  const [systemTab, setSystemTab] = useState(() => guideLocationForFragment().system);
  const [guideTab, setGuideTab] = useState(() => guideLocationForFragment().section);
  const [filter, setFilter] = useState<LinuxFilter>('All Linux picks');
  const [sort, setSort] = useState<NameSort>('name-asc');
  useEffect(() => {
    let frame = 0;
    function revealLinkedSection() {
      cancelAnimationFrame(frame);
      const location = guideLocationForFragment();
      if (location.system !== 'linux') return;
      setSystemTab(location.system);
      setGuideTab(location.section);
      frame = requestAnimationFrame(() => document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: 'instant', block: 'start' }));
    }
    window.addEventListener('hashchange', revealLinkedSection);
    return () => { window.removeEventListener('hashchange', revealLinkedSection); cancelAnimationFrame(frame); };
  }, []);
  const visiblePicks = linuxPicks.filter((pick) => filter === 'All Linux picks' || pick.uses.includes(filter))
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }) * (sort === 'name-desc' ? -1 : 1));
  const visibleGroups = linuxFilters.filter((group): group is LinuxUse => group !== 'All Linux picks' && (filter === 'All Linux picks' || filter === group))
    .map((group) => ({ name: group, id: `linux-group-${group.toLowerCase().replace(/\W+/g, '-')}`, picks: visiblePicks.filter((pick) => pick.uses.includes(group)) }));

  return (
    <section className="os-guide" id="operating-systems" aria-labelledby="os-title">
      <div className="software-heading">
        <div>
          <div className="eyebrow"><span className="eyebrow-line" /> A fresh start for your PC</div>
          <h1 id="os-title">Start with the right operating system.</h1>
          <p>Choose Windows 11, Linux, or macOS for official download guidance. Inside Linux, compare distributions, desktop environments, window managers, and shells.</p>
        </div>
      </div>

      <Tabs value={systemTab} onValueChange={(value) => { clearGuideFragment(); setSystemTab(value); }}>
        <TabsList className="os-system-tabs" aria-label="Operating system guides">
          <TabsTrigger value="windows">Windows 11</TabsTrigger>
          <TabsTrigger value="linux">Linux</TabsTrigger>
          <TabsTrigger value="macos">macOS</TabsTrigger>
        </TabsList>
        <TabsContent value="windows">
          <article className="os-download-card os-platform-card">
            <span className="software-category">Microsoft</span>
            <h2>Windows 11</h2>
            <p>Get Microsoft’s installation media or disk image. Check its hardware requirements and whether you need an activation license.</p>
            <OfficialLink href="https://www.microsoft.com/software-download/windows11">Download Windows 11</OfficialLink>
          </article>
        </TabsContent>
        <TabsContent value="linux">
          <article className="os-download-card os-platform-card">
            <span className="software-category">Choose a distribution</span>
            <h2>Linux</h2>
            <p>Start with one of the picks below. The distribution’s official site supplies its ISO image, requirements, and installation instructions.</p>
            <a className="os-link" href="#linux-picks" onClick={() => { setGuideTab('distributions'); requestAnimationFrame(() => document.getElementById('linux-picks')?.scrollIntoView()); }}>Compare Linux picks <Download size={13} aria-hidden="true" /></a>
          </article>

          <Tabs value={guideTab} onValueChange={(value) => { clearGuideFragment(); setGuideTab(value); }}>
            <TabsList className="os-guide-tabs" aria-label="Linux guides">
              <TabsTrigger value="distributions">Distributions</TabsTrigger>
              <TabsTrigger value="desktop">Desktop environments</TabsTrigger>
              <TabsTrigger value="window-managers">Window managers</TabsTrigger>
              <TabsTrigger value="shells">Shells</TabsTrigger>
            </TabsList>
            <TabsContent value="distributions">
              <div className="os-guide-actions">
                <ProtonDbButton />
                <a className="os-link" href="#linux-gaming">Read the Linux gaming guide</a>
              </div>

              <section className="os-section" id="linux-picks" aria-labelledby="linux-title">
                <div className="os-section-heading">
                  <div>
                    <h2 id="linux-title">Linux distributions by use case.</h2>
                    <p>New to Linux? Start by comparing Mint, Ubuntu LTS, and Zorin OS. Browse the groups below for gaming-focused setups, older PCs, and more hands-on options. There is no single best distribution for everyone.</p>
                  </div>
                  <span className="software-count" role="status" aria-live="polite" aria-atomic="true">{visiblePicks.length} {visiblePicks.length === 1 ? 'distribution' : 'distributions'}</span>
                </div>
                <div className="os-catalog-controls">
                  <div className="software-filters os-filters" role="group" aria-label="Filter Linux recommendations">
                    {linuxFilters.map((option) => (
                      <button className={`software-filter${filter === option ? ' is-active' : ''}`} type="button" key={option} aria-pressed={filter === option} onClick={() => setFilter(option)}>{option}</button>
                    ))}
                  </div>
                  <NameSortMenu value={sort} onChange={setSort} label="Sort Linux distributions" />
                </div>
                {filter === 'All Linux picks' && <p className="linux-groups-note">Each group is sorted by name. A distribution can appear in more than one group when it suits both uses.</p>}
                <div className="linux-groups">
                  {visibleGroups.map((group) => (
                    <section className="linux-use-group" key={group.name} aria-labelledby={group.id}>
                      <div className="linux-group-heading"><h3 id={group.id}>{group.name}</h3><span>{group.picks.length} {group.picks.length === 1 ? 'distribution' : 'distributions'}</span></div>
                      <div className="os-distro-grid">
                        {group.picks.map((pick) => (
                          <article className="os-distro-card" data-distro={pick.name} key={pick.name}>
                            <span className="software-category">{pick.uses.join(' · ')}</span>
                            <h4>{pick.name}</h4>
                            <p className="software-best-for">{pick.bestFor}</p>
                            <p className="os-copy">{pick.description}</p>
                            <p className="os-note"><Info size={14} aria-hidden="true" />{pick.note}</p>
                            <div className="os-card-links">
                              <OfficialLink href={pick.download}>Official download</OfficialLink>
                              <OfficialLink href={pick.docs}>Installation docs</OfficialLink>
                            </div>
                          </article>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
                <div className="os-callout"><Info size={17} aria-hidden="true" /><p><strong>Check your game library first.</strong> Some Windows games and multiplayer anti-cheat systems do not work on Linux. Check the publisher’s support information for the titles you play; Proton does not guarantee compatibility.</p></div>
              </section>

              <LinuxGamingGuide />

              <section className="os-section" id="linux-install" aria-labelledby="linux-install-title">
                <div className="os-section-heading">
                  <div>
                    <h2 id="linux-install-title">Install Linux, step by step.</h2>
                    <p>A starting checklist for a PC installation. Use your chosen distribution’s instructions for its exact procedure.</p>
                  </div>
                </div>
                <div className="os-callout"><ShieldCheck size={18} aria-hidden="true" /><p><strong>Before changing your system:</strong> back up important files and save any device-encryption recovery keys somewhere you can access from another device. A backup should live outside the drive you plan to change.</p></div>
                <ol className="os-steps">
                  {installationSteps.map((step, index) => (
                    <li className="os-step" key={step.title}>
                      <span className="side-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                      <div><h3>{step.title}</h3><p>{step.detail}</p></div>
                    </li>
                  ))}
                </ol>
                <details className="os-checksums">
                  <summary>How to check an ISO’s SHA-256 checksum</summary>
                  <p>Replace <code>your-download.iso</code> with your downloaded file’s name and run the command from its folder. Compare the entire result with the value on the project’s official site.</p>
                  <div className="os-command"><strong>Windows (PowerShell)</strong><pre><code>{'Get-FileHash -Algorithm SHA256 .\\your-download.iso'}</code></pre></div>
                  <div className="os-command"><strong>Linux</strong><pre><code>sha256sum your-download.iso</code></pre></div>
                  <div className="os-command"><strong>macOS</strong><pre><code>shasum -a 256 your-download.iso</code></pre></div>
                </details>
                <div className="os-tools">
                  <p>Need a USB-writing tool? For supported Linux images, follow the distro’s recommendation or use <OfficialLink href="https://etcher.balena.io/">balenaEtcher</OfficialLink>. For Windows media, use <OfficialLink href="https://www.microsoft.com/software-download/windows11">Microsoft’s download instructions</OfficialLink> or <OfficialLink href="https://rufus.ie/">Rufus on Windows</OfficialLink>.</p>
                </div>
              </section>
            </TabsContent>
            <TabsContent value="desktop">
              <DesktopEnvironmentGuide kind="Desktop environment" />
            </TabsContent>
            <TabsContent value="window-managers"><DesktopEnvironmentGuide kind="Compositor" /></TabsContent>
            <TabsContent value="shells"><DesktopEnvironmentGuide kind="Shell" /></TabsContent>
          </Tabs>
        </TabsContent>
        <TabsContent value="macos">
          <article className="os-download-card os-platform-card">
            <span className="software-category">Apple hardware</span>
            <h2>macOS</h2>
            <p>Use Apple’s download and update instructions on a compatible Mac. Available releases depend on the Mac model.</p>
            <OfficialLink href="https://support.apple.com/102662">Apple installation guide</OfficialLink>
          </article>
        </TabsContent>
      </Tabs>
    </section>
  );
}
