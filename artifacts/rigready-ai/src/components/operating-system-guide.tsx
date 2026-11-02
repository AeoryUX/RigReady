import { useState, type ReactNode } from 'react';
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

export function OperatingSystemGuide() {
  const [filter, setFilter] = useState<LinuxFilter>('All Linux picks');
  const [sort, setSort] = useState<NameSort>('name-asc');
  const visiblePicks = linuxPicks.filter((pick) => filter === 'All Linux picks' || pick.uses.includes(filter))
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }) * (sort === 'name-desc' ? -1 : 1));

  return (
    <section className="os-guide" id="operating-systems" aria-labelledby="os-title">
      <div className="software-heading">
        <div>
          <div className="eyebrow"><span className="eyebrow-line" /> A fresh start for your PC</div>
          <h1 id="os-title">Start with the right operating system.</h1>
          <p>Find official downloads, compare Linux distributions, and explore desktop environments and shells. Choose a setup that fits your hardware, workflow, and the games you actually play.</p>
        </div>
      </div>

      <Tabs defaultValue="systems">
        <TabsList className="os-guide-tabs" aria-label="Operating system guides">
          <TabsTrigger value="systems">Operating systems</TabsTrigger>
          <TabsTrigger value="desktop">Desktop environments</TabsTrigger>
        </TabsList>
        <TabsContent value="systems">
          <div className="os-guide-actions">
            <ProtonDbButton />
            <a className="os-link" href="#linux-gaming">Read the Linux gaming guide</a>
          </div>

          <div className="os-download-grid" aria-label="Operating system downloads">
            <article className="os-download-card">
              <span className="software-category">Microsoft</span>
              <h2>Windows 11</h2>
              <p>Get Microsoft’s installation media or disk image. Check its hardware requirements and whether you need an activation license.</p>
              <OfficialLink href="https://www.microsoft.com/software-download/windows11">Download Windows 11</OfficialLink>
            </article>
            <article className="os-download-card">
              <span className="software-category">Choose a distribution</span>
              <h2>Linux</h2>
              <p>Start with one of the picks below. The distribution’s official site supplies its ISO image, requirements, and installation instructions.</p>
              <a className="os-link" href="#linux-picks">Compare Linux picks <Download size={13} aria-hidden="true" /></a>
            </article>
            <article className="os-download-card">
              <span className="software-category">Apple hardware</span>
              <h2>macOS</h2>
              <p>Use Apple’s download and update instructions on a compatible Mac. Available releases depend on the Mac model.</p>
              <OfficialLink href="https://support.apple.com/102662">Apple installation guide</OfficialLink>
            </article>
          </div>

          <section className="os-section" id="linux-picks" aria-labelledby="linux-title">
            <div className="os-section-heading">
              <div>
                <h2 id="linux-title">Linux picks, matched to your PC.</h2>
                <p>New to Linux? Start by comparing Mint, Ubuntu LTS, and Zorin OS. Use the filters to explore gaming-focused setups and more hands-on options. There is no single best distribution for everyone.</p>
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
            <div className="os-distro-grid">
              {visiblePicks.map((pick) => (
                <article className="os-distro-card" key={pick.name}>
                  <span className="software-category">{pick.uses.join(' · ')}</span>
                  <h3>{pick.name}</h3>
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
            <div className="os-callout"><Info size={17} aria-hidden="true" /><p><strong>Check your game library first.</strong> Some Windows games and multiplayer anti-cheat systems do not work on Linux. Check the publisher’s support information for the titles you play; Proton does not guarantee compatibility.</p></div>
          </section>

          <LinuxGamingGuide />

          <section className="os-section" aria-labelledby="linux-install-title">
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
              <p>Need a USB-writing tool? For supported Linux images, follow the distro’s recommendation or use <OfficialLink href="https://etcher.balena.io/">balenaEtcher</OfficialLink>. For Windows media, use Microsoft’s instructions above or <OfficialLink href="https://rufus.ie/">Rufus on Windows</OfficialLink>.</p>
            </div>
          </section>
        </TabsContent>
        <TabsContent value="desktop">
          <DesktopEnvironmentGuide />
        </TabsContent>
      </Tabs>
    </section>
  );
}
