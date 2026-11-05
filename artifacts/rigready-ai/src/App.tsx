import { useEffect, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, useTheme } from 'next-themes';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { OperatingSystemGuide } from '@/components/operating-system-guide';
import { AppChecklist } from '@/components/app-checklist';
import { AppInstallationGuide } from '@/components/app-installation-guide';
import { PcSpecsGuide } from '@/components/pc-specs-guide';
import { ShopSearch } from '@/components/shop-search';
import { SiteInformation } from '@/components/site-information';
import { OsSupportBadges, OsSupportLegend, allDesktopOs, windowsOnly, windowsAndMac, linuxOnly, type OsSupport } from '@/components/os-support';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuLabel,
  DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import NotFound from '@/pages/not-found';
import {
  AppWindow, ArrowLeft, ArrowRight, ArrowUpDown,
  ChevronDown, Cpu, ExternalLink, Globe, Info, MonitorDown, Moon, Search, Sun,
} from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();
type SoftwareCategory = 'Browsers' | 'Game libraries' | 'Communication' | 'PC utilities';
type SoftwareFilter = 'All apps' | SoftwareCategory;
type SoftwareSort = 'name-asc' | 'name-desc' | 'category';

const softwareSortOptions: { value: SoftwareSort; label: string }[] = [
  { value: 'name-asc', label: 'Name: A–Z' },
  { value: 'name-desc', label: 'Name: Z–A' },
  { value: 'category', label: 'Category' },
];

const softwareFilters: SoftwareFilter[] = [
  'All apps',
  'Browsers',
  'Game libraries',
  'Communication',
  'PC utilities',
];

const softwareApps: {
  name: string;
  category: SoftwareCategory;
  description: string;
  bestFor: string;
  osSupport: OsSupport;
  officialUrl: string;
  note?: string;
}[] = [
  {
    name: 'Firefox',
    category: 'Browsers',
    description: 'An everyday browser with a broad add-on ecosystem and privacy controls.',
    bestFor: 'A familiar general-purpose browser',
    osSupport: allDesktopOs,
    officialUrl: 'https://www.mozilla.org/firefox/new/',
  },
  {
    name: 'Brave',
    category: 'Browsers',
    description: 'A browser with built-in ad and tracker blocking for a less cluttered web.',
    bestFor: 'Built-in privacy tools',
    osSupport: allDesktopOs,
    officialUrl: 'https://brave.com/download/',
  },
  {
    name: 'Opera GX',
    category: 'Browsers',
    description: 'A gaming-focused browser with customizable controls and appearance.',
    bestFor: 'A gaming-themed browser',
    osSupport: windowsAndMac,
    officialUrl: 'https://www.opera.com/gx',
  },
  {
    name: 'Zen Browser',
    category: 'Browsers',
    description: 'A Firefox-based browser with vertical tabs, workspaces, and a customizable interface.',
    bestFor: 'Organizing tabs into workspaces',
    osSupport: allDesktopOs,
    officialUrl: 'https://zen-browser.app/',
  },
  {
    name: 'LibreWolf',
    category: 'Browsers',
    description: 'A Firefox-based browser with privacy-focused defaults and reduced telemetry.',
    bestFor: 'Privacy-focused browsing',
    osSupport: allDesktopOs,
    officialUrl: 'https://librewolf.net/',
    note: 'Stricter privacy settings may need adjusting for some websites.',
  },
  {
    name: 'Helium',
    category: 'Browsers',
    description: 'A Chromium-based browser focused on privacy and a minimal browsing experience.',
    bestFor: 'A minimal Chromium alternative',
    osSupport: allDesktopOs,
    officialUrl: 'https://helium.computer/',
  },
  {
    name: 'Vivaldi',
    category: 'Browsers',
    description: 'A customizable browser with tab stacks, workspaces, and built-in productivity tools.',
    bestFor: 'Customizing your browsing setup',
    osSupport: allDesktopOs,
    officialUrl: 'https://vivaldi.com/',
  },
  {
    name: 'Waterfox',
    category: 'Browsers',
    description: 'A Firefox-based desktop browser with customization options and support for Firefox extensions.',
    bestFor: 'Another customizable Firefox-based browser',
    osSupport: allDesktopOs,
    officialUrl: 'https://www.waterfox.net/',
  },
  {
    name: 'Floorp',
    category: 'Browsers',
    description: 'A Firefox-based browser with workspace and interface customization for organizing everyday browsing.',
    bestFor: 'Organizing browsing around your workflow',
    osSupport: allDesktopOs,
    officialUrl: 'https://floorp.app/',
  },
  {
    name: 'Steam',
    category: 'Game libraries',
    description: 'A major PC game store and library with community features for supported games.',
    bestFor: 'A first PC game library',
    osSupport: { ...allDesktopOs, linux: 'limited', note: 'Valve lists current Ubuntu or Ubuntu LTS for the standalone Linux client. Other distributions use their own packages and guidance.' },
    officialUrl: 'https://store.steampowered.com/about/',
  },
  {
    name: 'Epic Games Store',
    category: 'Game libraries',
    description: 'Another PC game store and launcher for games in your Epic account.',
    bestFor: 'Games from Epic',
    osSupport: windowsAndMac,
    officialUrl: 'https://store.epicgames.com/download',
  },
  {
    name: 'GOG GALAXY',
    category: 'Game libraries',
    description: 'A game launcher that can organize games from supported PC platforms.',
    bestFor: 'Bringing supported libraries together',
    osSupport: windowsAndMac,
    officialUrl: 'https://www.gog.com/galaxy',
    note: 'Library integrations and features can change.',
  },
  {
    name: 'Xbox app for PC',
    category: 'Game libraries',
    description: 'Browse PC games and manage your Xbox PC library from Windows.',
    bestFor: 'Xbox PC games and Game Pass',
    osSupport: windowsOnly,
    officialUrl: 'https://www.xbox.com/apps/xbox-app-on-pc',
    note: 'A Game Pass subscription is separate.',
  },
  {
    name: 'EA app',
    category: 'Game libraries',
    description: 'Download, update, and launch supported games from your EA library.',
    bestFor: 'EA games and EA Play',
    osSupport: windowsAndMac,
    officialUrl: 'https://www.ea.com/ea-app',
    note: 'Game availability varies by platform. EA Play is a separate subscription.',
  },
  {
    name: 'Ubisoft Connect',
    category: 'Game libraries',
    description: 'Manage Ubisoft PC games, updates, friends, and supported in-game rewards.',
    bestFor: 'Ubisoft PC games',
    osSupport: windowsOnly,
    officialUrl: 'https://www.ubisoft.com/ubisoft-connect',
  },
  {
    name: 'Battle.net',
    category: 'Game libraries',
    description: 'Install and launch supported Blizzard and Activision games from one desktop app.',
    bestFor: 'Blizzard and supported Activision games',
    osSupport: windowsAndMac,
    officialUrl: 'https://download.battle.net/',
    note: 'Not every game is available on macOS.',
  },
  {
    name: 'itch.io app',
    category: 'Game libraries',
    description: 'Browse, install, and update independent games from itch.io.',
    bestFor: 'Indie games and smaller creators',
    osSupport: allDesktopOs,
    officialUrl: 'https://itch.io/app',
  },
  {
    name: 'Playnite',
    category: 'Game libraries',
    description: 'An open-source library manager that organizes games from multiple launchers, with a fullscreen mode.',
    bestFor: 'One view of your PC game collection',
    osSupport: windowsOnly,
    officialUrl: 'https://playnite.link/',
    note: 'Some games still require their original launcher.',
  },
  {
    name: 'Heroic Games Launcher',
    category: 'Game libraries',
    description: 'An open-source launcher for supported Epic Games, GOG, and Amazon Games libraries.',
    bestFor: 'Managing supported stores across platforms',
    osSupport: allDesktopOs,
    officialUrl: 'https://heroicgameslauncher.com/',
    note: 'Unofficial client; game and anti-cheat compatibility varies by operating system.',
  },
  {
    name: 'Lutris',
    category: 'Game libraries',
    description: 'An open-source Linux game manager for organizing installed games, emulators, and supported store integrations.',
    bestFor: 'Managing games and runners on Linux',
    osSupport: linuxOnly,
    officialUrl: 'https://lutris.net/downloads/',
    note: 'Game and anti-cheat compatibility varies. Some games still require their original store account or launcher.',
  },
  {
    name: 'Prism Launcher',
    category: 'Game libraries',
    description: 'A community Minecraft launcher for managing separate game instances, mod loaders, and modpacks.',
    bestFor: 'Organizing Minecraft versions and modded setups',
    osSupport: allDesktopOs,
    officialUrl: 'https://prismlauncher.org/download/',
    note: 'Use an account with access to Minecraft: Java Edition.',
  },
  {
    name: 'Amazon Games',
    category: 'Game libraries',
    description: 'Install and manage supported PC games included with purchases and Prime Gaming offers.',
    bestFor: 'Games in an Amazon Games library',
    osSupport: windowsOnly,
    officialUrl: 'https://www.amazongames.com/en-us/support/prime-gaming/articles/download-and-install-the-amazon-games-app',
    note: 'Prime Gaming benefits require an eligible Amazon Prime membership. Game availability varies by region.',
  },
  {
    name: 'Bottles',
    category: 'Game libraries',
    description: 'A Linux app for organizing Windows applications and games into separate Wine environments.',
    bestFor: 'Managing Windows game environments on Linux',
    osSupport: linuxOnly,
    officialUrl: 'https://usebottles.com/download/',
    note: 'Compatibility varies by game, launcher, anti-cheat system, and graphics driver.',
  },
  {
    name: 'Discord',
    category: 'Communication',
    description: 'Voice, text, and community spaces for playing with friends.',
    bestFor: 'Voice chat and gaming groups',
    osSupport: allDesktopOs,
    officialUrl: 'https://discord.com/download',
  },
  {
    name: 'TeamSpeak',
    category: 'Communication',
    description: 'Voice chat with server-based communities and controls for gaming groups.',
    bestFor: 'Dedicated group voice chat',
    osSupport: allDesktopOs,
    officialUrl: 'https://www.teamspeak.com/',
    note: 'Check platform availability for your preferred client version.',
  },
  {
    name: 'Signal',
    category: 'Communication',
    description: 'Private messaging and calls with a desktop app linked to your mobile account.',
    bestFor: 'Private conversations with friends',
    osSupport: { ...allDesktopOs, linux: 'limited', note: 'The official Linux package targets 64-bit Debian-based distributions, such as Ubuntu and Linux Mint. Other distributions need separate packaging.' },
    officialUrl: 'https://signal.org/download/',
    note: 'Requires Signal on your phone to link the desktop app.',
  },
  {
    name: 'Mumble',
    category: 'Communication',
    description: 'Free, open-source voice chat with low latency and server-based channels for gaming groups.',
    bestFor: 'Low-latency group voice chat',
    osSupport: allDesktopOs,
    officialUrl: 'https://www.mumble.info/downloads/',
    note: 'Join an existing Mumble server or host one for your group.',
  },
  {
    name: 'Element',
    category: 'Communication',
    description: 'Messaging and calls built on Matrix, with rooms and communities across compatible servers.',
    bestFor: 'Matrix rooms and community chat',
    osSupport: allDesktopOs,
    officialUrl: 'https://element.io/download',
    note: 'Choose a Matrix homeserver when creating your account. Features and availability depend on the server.',
  },
  {
    name: 'Jami',
    category: 'Communication',
    description: 'An open-source communication app with distributed messaging, voice calls, and video calls.',
    bestFor: 'Decentralized messaging and calls',
    osSupport: allDesktopOs,
    officialUrl: 'https://jami.net/download-jami/',
  },
  {
    name: 'Slack',
    category: 'Communication',
    description: 'Workspace messaging with channels, direct messages, calls, and file sharing.',
    bestFor: 'Communities, teams, and project groups',
    osSupport: { ...allDesktopOs, linux: 'limited', note: 'Official Linux builds target supported Debian- and RPM-based distributions. Other distributions use separate packaging.' },
    officialUrl: 'https://slack.com/downloads/',
    note: 'Available features and message history depend on the workspace plan and administrator settings.',
  },
  {
    name: 'Zoom Workplace',
    category: 'Communication',
    description: 'Video meetings, screen sharing, chat, and voice calls for groups and communities.',
    bestFor: 'Video calls and screen sharing',
    osSupport: { ...allDesktopOs, linux: 'limited', note: 'Zoom lists specific supported Linux distributions and versions. Choose the matching package on its download page.' },
    officialUrl: 'https://zoom.us/download',
    note: 'Meeting duration and features depend on the host’s plan and settings.',
  },
  {
    name: 'OBS Studio',
    category: 'PC utilities',
    description: 'Free, open-source software for recording gameplay or livestreaming.',
    bestFor: 'Recording and streaming',
    osSupport: allDesktopOs,
    officialUrl: 'https://obsproject.com/download',
  },
  {
    name: 'NVIDIA App',
    category: 'PC utilities',
    description: 'Manage NVIDIA graphics drivers, game settings, and capture features.',
    bestFor: 'NVIDIA graphics cards',
    osSupport: windowsOnly,
    officialUrl: 'https://www.nvidia.com/en-us/software/nvidia-app/',
    note: 'Only needed for an NVIDIA GPU.',
  },
  {
    name: 'AMD Software: Adrenalin Edition',
    category: 'PC utilities',
    description: 'Manage AMD Radeon graphics drivers, game settings, and capture features.',
    bestFor: 'AMD Radeon graphics cards',
    osSupport: windowsOnly,
    officialUrl: 'https://www.amd.com/en/products/software/adrenalin.html',
    note: 'Only needed for an AMD Radeon GPU.',
  },
  {
    name: 'HWiNFO',
    category: 'PC utilities',
    description: 'View hardware details and sensor readings such as temperatures.',
    bestFor: 'Checking temperatures and components',
    osSupport: windowsOnly,
    officialUrl: 'https://www.hwinfo.com/download/',
    note: 'Optional monitoring tool; it does not improve performance by itself.',
  },
  {
    name: 'MSI Afterburner',
    category: 'PC utilities',
    description: 'Optional GPU monitoring and tuning controls for experienced users.',
    bestFor: 'Advanced GPU monitoring',
    osSupport: windowsOnly,
    officialUrl: 'https://www.msi.com/Landing/afterburner',
    note: 'Avoid changing clock or voltage settings unless you understand the risks. Download from MSI only.',
  },
  {
    name: 'CPU-Z',
    category: 'PC utilities',
    description: 'Check your processor, motherboard, and memory details before planning an upgrade.',
    bestFor: 'Identifying CPU and RAM specifications',
    osSupport: windowsOnly,
    officialUrl: 'https://www.cpuid.com/softwares/cpu-z.html',
  },
  {
    name: 'GPU-Z',
    category: 'PC utilities',
    description: 'View your graphics card specifications, firmware information, and sensor readings.',
    bestFor: 'Identifying and monitoring your GPU',
    osSupport: windowsOnly,
    officialUrl: 'https://www.techpowerup.com/gpuz/',
  },
  {
    name: 'CrystalDiskInfo',
    category: 'PC utilities',
    description: 'Read supported drives’ health indicators and temperatures to help spot storage issues.',
    bestFor: 'Checking SSD and hard drive health',
    osSupport: windowsOnly,
    officialUrl: 'https://crystalmark.info/en/software/crystaldiskinfo/',
    note: 'Health indicators do not replace regular backups.',
  },
  {
    name: 'WizTree',
    category: 'PC utilities',
    description: 'Visualize disk usage and find large files and folders taking up storage space.',
    bestFor: 'Finding what fills your drive',
    osSupport: windowsOnly,
    officialUrl: 'https://diskanalyzer.com/',
    note: 'Free for personal use; review files before deleting them.',
  },
  {
    name: 'Microsoft PowerToys',
    category: 'PC utilities',
    description: 'Extra Windows tools for window layouts, keyboard remapping, file search, and everyday tasks.',
    bestFor: 'Making Windows easier to use',
    osSupport: windowsOnly,
    officialUrl: 'https://learn.microsoft.com/windows/powertoys/',
  },
  {
    name: '7-Zip',
    category: 'PC utilities',
    description: 'A free, open-source tool for creating and extracting ZIP, 7z, and other archive formats.',
    bestFor: 'Opening and compressing archives',
    osSupport: allDesktopOs,
    officialUrl: 'https://www.7-zip.org/',
    note: 'The official graphical app is for Windows; Linux and macOS builds use the command line.',
  },
  {
    name: 'Fan Control',
    category: 'PC utilities',
    description: 'Build custom fan curves using supported temperature sensors and fan controllers.',
    bestFor: 'Adjusting cooling and fan noise',
    osSupport: windowsOnly,
    officialUrl: 'https://getfancontrol.com/',
    note: 'Hardware support varies. Monitor temperatures after changing fan curves.',
  },
  {
    name: 'ShareX',
    category: 'PC utilities',
    description: 'An open-source toolkit for screenshots, screen recordings, and optional sharing workflows.',
    bestFor: 'Capturing and annotating your screen',
    osSupport: windowsOnly,
    officialUrl: 'https://getsharex.com/',
    note: 'Review upload settings before capturing private content.',
  },
  {
    name: 'VLC media player',
    category: 'PC utilities',
    description: 'A free, open-source media player for many local video and audio formats.',
    bestFor: 'Playing recordings and media files',
    osSupport: allDesktopOs,
    officialUrl: 'https://www.videolan.org/vlc/',
  },
  {
    name: 'Rufus',
    category: 'PC utilities',
    description: 'A free, open-source Windows utility for creating bootable USB installation media from supported disk images.',
    bestFor: 'Preparing operating system installers on Windows',
    osSupport: windowsOnly,
    officialUrl: 'https://rufus.ie/',
    note: 'Writing installation media erases the selected USB drive. Check the target drive before starting.',
  },
  {
    name: 'balenaEtcher',
    category: 'PC utilities',
    description: 'A graphical tool for writing supported operating system images to USB drives and SD cards.',
    bestFor: 'Writing Linux installer images',
    osSupport: allDesktopOs,
    officialUrl: 'https://etcher.balena.io/',
    note: 'Flashing erases the selected drive. Use Microsoft’s recommended tools or Rufus for Windows installation media.',
  },
  {
    name: 'KeePassXC',
    category: 'PC utilities',
    description: 'An open-source password manager for keeping login details in an encrypted local database.',
    bestFor: 'Managing passwords on your own devices',
    osSupport: allDesktopOs,
    officialUrl: 'https://keepassxc.org/download/',
    note: 'Back up your database and keep its master password safe.',
  },
  {
    name: 'LocalSend',
    category: 'PC utilities',
    description: 'An open-source app for sharing files and text between nearby devices over your local network.',
    bestFor: 'Moving files between your PCs and phones',
    osSupport: allDesktopOs,
    officialUrl: 'https://localsend.org/download',
    note: 'Devices must be reachable on the local network. Firewall settings can affect discovery.',
  },
  {
    name: 'Everything',
    category: 'PC utilities',
    description: 'A fast Windows filename search tool for finding files and folders on indexed NTFS drives.',
    bestFor: 'Finding files quickly on Windows',
    osSupport: windowsOnly,
    officialUrl: 'https://www.voidtools.com/downloads/',
    note: 'Search results can expose filenames from indexed drives to anyone using your Windows account.',
  },
  {
    name: 'Ventoy',
    category: 'PC utilities',
    description: 'Prepare a USB drive that can boot supported ISO, WIM, IMG, VHD(x), and EFI files copied onto it.',
    bestFor: 'Keeping multiple installers on one USB drive',
    osSupport: { windows: 'supported', linux: 'supported', macos: 'unavailable' },
    officialUrl: 'https://www.ventoy.net/en/download.html',
    note: 'Installing Ventoy erases or repartitions the selected USB drive. Verify the target drive and back it up first.',
  },
];

function SiteHeader({ connectionLabel = 'RigReady guide', currentPage = 'home' }: { connectionLabel?: string; currentPage?: 'home' | 'hardware' | 'software' | 'operating-systems' }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  return (
    <header className="masthead">
      <a className="brand-lockup" href={import.meta.env.BASE_URL} aria-label="RigReady home" data-testid="link-brand-home">
        <span className="brand-mark"><Cpu size={19} strokeWidth={2.1} /></span>
        <span className="brand-name">RigReady</span>
      </a>
      <div className="masthead-actions">
        <nav className="masthead-nav" aria-label="Main navigation">
          <a className="software-jump" href={`${import.meta.env.BASE_URL}hardware/`} aria-current={currentPage === 'hardware' ? 'page' : undefined}>Hardware advisor</a>
          <a className="software-jump" href={`${import.meta.env.BASE_URL}software/`} aria-current={currentPage === 'software' ? 'page' : undefined}>Software guide</a>
          <a className="software-jump" href={`${import.meta.env.BASE_URL}operating-systems/`} aria-current={currentPage === 'operating-systems' ? 'page' : undefined}>Operating systems</a>
        </nav>
        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-pressed={isDark}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
        </button>
        <div className="masthead-note" data-testid="status-api-health">
          <span className="status-dot" />
          <span>{connectionLabel}</span>
        </div>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-inner"><span>RigReady · Built around the PC you already own.</span><span>Recommendations are guidance, not a substitute for checking your exact components.</span><nav className="footer-policy-links" aria-label="Site information"><a href={`${import.meta.env.BASE_URL}privacy/`}>Privacy</a><a href={`${import.meta.env.BASE_URL}privacy/#storage`}>Cookies &amp; storage</a><a href={`${import.meta.env.BASE_URL}terms/`}>Terms</a></nav></div>
    </footer>
  );
}

function useInitialFragmentScroll() {
  useEffect(() => {
    // The target is rendered by React after the browser's initial anchor lookup.
    const frame = requestAnimationFrame(() => {
      const id = window.location.hash.slice(1);
      if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, []);
}

function usePageTitle(title: string) {
  useEffect(() => { document.title = title; }, [title]);
}

function Home() {
  usePageTitle('RigReady');
  useEffect(() => {
    const redirectLegacyGuide = () => {
      if (['#guides', '#software-library'].includes(window.location.hash)) {
        window.location.replace(`${import.meta.env.BASE_URL}software/${window.location.hash}`);
      }
    };
    redirectLegacyGuide();
    window.addEventListener('hashchange', redirectLegacyGuide);
    return () => window.removeEventListener('hashchange', redirectLegacyGuide);
  }, []);

  return (
    <div className="app-shell">
      <SiteHeader />
      <main className="main-wrap">
        <section className="welcome-hero" aria-labelledby="welcome-title">
          <div className="eyebrow"><span className="eyebrow-line" /> Your setup, your next step</div>
          <h1 id="welcome-title">Welcome to<br /><span>RigReady.</span></h1>
          <p>Choose where you want to start. Explore hardware upgrades, find useful apps, or pick an operating system for your PC.</p>
        </section>
        <nav className="welcome-grid" aria-label="Choose where to start">
          <a className="welcome-card" href={`${import.meta.env.BASE_URL}hardware/`} aria-labelledby="welcome-hardware-title">
            <span className="welcome-card-icon"><Cpu size={24} aria-hidden="true" /></span>
            <h2 id="welcome-hardware-title">Hardware advisor</h2>
            <p>Find your PC specs, then compare shop listings for the parts you need.</p>
            <span className="welcome-card-note">Choose your country and the part or model you want to compare.</span>
            <span className="welcome-cta">Open hardware advisor <ArrowRight size={16} aria-hidden="true" /></span>
          </a>
          <a className="welcome-card" href={`${import.meta.env.BASE_URL}software/`} aria-labelledby="welcome-software-title">
            <span className="welcome-card-icon"><AppWindow size={24} aria-hidden="true" /></span>
            <h2 id="welcome-software-title">Software guide</h2>
            <p>Discover useful apps and build a checklist of official websites to visit.</p>
            <span className="welcome-card-note">{softwareApps.length} apps with official developer links.</span>
            <span className="welcome-cta">Browse software <ArrowRight size={16} aria-hidden="true" /></span>
          </a>
          <a className="welcome-card" href={`${import.meta.env.BASE_URL}operating-systems/`} aria-labelledby="welcome-os-title">
            <span className="welcome-card-icon"><MonitorDown size={24} aria-hidden="true" /></span>
            <h2 id="welcome-os-title">Operating systems</h2>
            <p>Compare Linux distributions, check gaming compatibility, and learn how to install an operating system.</p>
            <span className="welcome-card-note">Official downloads and installation guidance.</span>
            <span className="welcome-cta">Explore operating systems <ArrowRight size={16} aria-hidden="true" /></span>
          </a>
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}

function SoftwarePage() {
  useInitialFragmentScroll();
  usePageTitle('Software guide | RigReady');
  const [softwareFilter, setSoftwareFilter] = useState<SoftwareFilter>('All apps');
  const [softwareSearch, setSoftwareSearch] = useState('');
  const [softwareSort, setSoftwareSort] = useState<SoftwareSort>('name-asc');
  const [selectedAppNames, setSelectedAppNames] = useState<Set<string>>(() => new Set());
  const selectedSortLabel = softwareSortOptions.find((option) => option.value === softwareSort)?.label;
  const visibleSoftware = softwareApps.filter((software) => {
    const matchesCategory = softwareFilter === 'All apps' || software.category === softwareFilter;
    const searchText = `${software.name} ${software.category} ${software.description} ${software.bestFor}`.toLowerCase();
    return matchesCategory && searchText.includes(softwareSearch.trim().toLowerCase());
  });
  const compareNames = (a: typeof softwareApps[number], b: typeof softwareApps[number]) =>
    a.name.localeCompare(b.name, 'en', { sensitivity: 'base', numeric: true });
  visibleSoftware.sort((a, b) => {
    if (softwareSort === 'name-desc') return compareNames(b, a);
    if (softwareSort === 'category') {
      return softwareFilters.indexOf(a.category) - softwareFilters.indexOf(b.category) || compareNames(a, b);
    }
    return compareNames(a, b);
  });

  function selectApp(name: string, selected: boolean) {
    setSelectedAppNames((previous) => {
      const next = new Set(previous);
      if (selected) next.add(name);
      else next.delete(name);
      return next;
    });
  }

  return (
    <div className="app-shell">
      <SiteHeader currentPage="software" />
      <main className="main-wrap software-page">
        <div className="guides-section" id="guides">
          <section className="software-section" id="software-library" aria-labelledby="software-title">
            <div className="software-heading">
              <div>
                <div className="eyebrow"><span className="eyebrow-line" /> Beyond the hardware</div>
                <h1 id="software-title">A few good apps to start with.</h1>
                <p>Find a browser, game library, communication app, or useful PC tool. These are optional picks, not a list of things you need to install.</p>
              </div>
              <span className="software-count" role="status" aria-live="polite" aria-atomic="true">
                Showing {visibleSoftware.length} of {softwareApps.length} apps
              </span>
            </div>

            <div className="software-toolbar">
              <div className="software-controls">
                <label className="software-search">
                  <Search size={16} aria-hidden="true" />
                  <span className="sr-only">Search software</span>
                  <input
                    type="search"
                    value={softwareSearch}
                    onChange={(event) => setSoftwareSearch(event.target.value)}
                    placeholder="Search apps, categories, or uses…"
                    aria-label="Search software"
                  />
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className="software-sort-button" aria-label={`Sort software: ${selectedSortLabel}`}>
                      <ArrowUpDown size={15} aria-hidden="true" />
                      <span>Sort: {selectedSortLabel}</span>
                      <ChevronDown size={14} aria-hidden="true" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="software-sort-menu">
                    <DropdownMenuLabel>Sort software</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={softwareSort} onValueChange={(value) => setSoftwareSort(value as SoftwareSort)} aria-label="Software sort order">
                      {softwareSortOptions.map((option) => (
                        <DropdownMenuRadioItem key={option.value} value={option.value}>
                          {option.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="software-filters" role="group" aria-label="Filter software by category">
                {softwareFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    className={`software-filter${softwareFilter === filter ? ' is-active' : ''}`}
                    aria-pressed={softwareFilter === filter}
                    onClick={() => setSoftwareFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <OsSupportLegend />
            <AppChecklist apps={softwareApps} selectedNames={selectedAppNames} onRemove={(name) => selectApp(name, false)} onClear={() => setSelectedAppNames(new Set())} />

            {visibleSoftware.length > 0 ? (
              <div className="software-grid">
                {visibleSoftware.map((software) => (
                  <article className={`software-card${selectedAppNames.has(software.name) ? ' software-card-selected' : ''}`} key={software.name}>
                    <div className="software-card-meta">
                      <span className="software-category">{software.category}</span>
                    </div>
                    <h3>{software.name}</h3>
                    <p className="software-best-for">{software.bestFor}</p>
                    <p className="software-description">{software.description}</p>
                    <OsSupportBadges support={software.osSupport} />
                    {software.note && <p className="software-note"><Info size={13} />{software.note}</p>}
                    <AppInstallationGuide name={software.name} support={software.osSupport} officialUrl={software.officialUrl} />
                    <a
                      className="software-link"
                      href={software.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Official site <ExternalLink size={14} aria-hidden="true" />
                    </a>
                    <label className="software-check">
                      <input type="checkbox" checked={selectedAppNames.has(software.name)} onChange={(event) => selectApp(software.name, event.target.checked)} aria-label={`Select ${software.name} for checklist`} />
                      <span>{selectedAppNames.has(software.name) ? 'In your checklist' : 'Add to checklist'}</span>
                    </label>
                  </article>
                ))}
              </div>
            ) : (
              <div className="software-empty" role="status">No apps match that search. Try a different name or category.</div>
            )}
            <p className="software-disclaimer">Download from the official developer sites above, and check system requirements before installing. You do not need every app here.</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function HardwarePage() {
  useInitialFragmentScroll();
  usePageTitle('Hardware advisor | RigReady');
  return (
    <div className="app-shell">
      <SiteHeader currentPage="hardware" connectionLabel="Shop search" />
      <main className="main-wrap">
        <section className="hero">
          <div className="eyebrow"><span className="eyebrow-line" /> Parts for your next upgrade</div>
          <h1>Find parts from<br /><em>popular shops.</em></h1>
          <p className="hero-copy">Choose your country and part, then open a search on Amazon and other listed shops. Check the exact model’s specifications, seller, and checkout total before buying.</p>
          <div className="hero-bottom"><span className="hero-proof"><Globe size={15} aria-hidden="true" /> Your country, your choice</span><span className="hero-proof"><Search size={14} aria-hidden="true" /> Shop listings to compare</span></div>
        </section>
        <PcSpecsGuide />
        <ShopSearch />
      </main>
      <SiteFooter />
    </div>
  );
}

function OperatingSystemsPage() {
  useInitialFragmentScroll();
  usePageTitle('Operating systems | RigReady');

  return (
    <div className="app-shell">
      <SiteHeader currentPage="operating-systems" />
      <main className="main-wrap os-page">
        <a className="os-back-link" href={import.meta.env.BASE_URL}><ArrowLeft size={15} aria-hidden="true" /> Back to home</a>
        <OperatingSystemGuide />
      </main>
      <SiteFooter />
    </div>
  );
}

function InformationPage({ kind }: { kind: 'privacy' | 'terms' }) {
  useInitialFragmentScroll();
  usePageTitle(`${kind === 'privacy' ? 'Privacy & storage' : 'Terms of use'} | RigReady`);
  return <div className="app-shell"><SiteHeader /><main className="main-wrap policy-page"><a className="os-back-link" href={import.meta.env.BASE_URL}><ArrowLeft size={14} aria-hidden="true" />Back to welcome</a><SiteInformation kind={kind} /></main><SiteFooter /></div>;
}
function PrivacyPage() { return <InformationPage kind="privacy" />; }
function TermsPage() { return <InformationPage kind="terms" />; }

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/privacy" component={PrivacyPage} /><Route path="/privacy/" component={PrivacyPage} />
        <Route path="/terms" component={TermsPage} /><Route path="/terms/" component={TermsPage} />
        <Route path="/hardware" component={HardwarePage} />
        <Route path="/hardware/" component={HardwarePage} />
        <Route path="/software" component={SoftwarePage} />
        <Route path="/software/" component={SoftwarePage} />
        <Route path="/operating-systems" component={OperatingSystemsPage} />
        <Route path="/operating-systems/" component={OperatingSystemsPage} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <ThemeProvider attribute="class" storageKey="rigready-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
