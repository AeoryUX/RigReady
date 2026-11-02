import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, useTheme } from 'next-themes';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { OperatingSystemGuide } from '@/components/operating-system-guide';
import { AppChecklist } from '@/components/app-checklist';
import { PcSpecsGuide } from '@/components/pc-specs-guide';
import { OsSupportBadges, OsSupportLegend, allDesktopOs, windowsOnly, windowsAndMac, linuxOnly, type OsSupport } from '@/components/os-support';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuLabel,
  DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import NotFound from '@/pages/not-found';
import {
  Activity, AlertCircle, AlertTriangle, AppWindow, ArrowLeft, ArrowRight, ArrowUpDown, BadgeCheck, Check, CheckCircle2,
  ChevronDown, ChevronRight, Cpu, ExternalLink, Info, LockKeyhole, MonitorDown, Moon, Plus, RotateCcw, Search, ShieldCheck, Sun, Zap,
} from 'lucide-react';
import { useCreatePcUpgradePlan, useHealthCheck } from '@workspace/api-client-react';
import type {
  PcBuildInput, PcUpgradePlan, PcBuildInputCurrency, PcBuildInputResolution,
  PcBuildInputPriority,
} from '@workspace/api-client-react';
import {
  PcBuildInputCurrency as CurrencyValues,
  PcBuildInputResolution as ResolutionValues,
  PcBuildInputPriority as PriorityValues,
} from '@workspace/api-client-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();
const staticPreview = import.meta.env.VITE_STATIC_PREVIEW === 'true';

type FormValues = {
  processor: string;
  graphicsCard: string;
  memoryGb: string;
  memoryType: string;
  storage: string;
  motherboard: string;
  powerSupply: string;
  caseModel: string;
  budget: string;
  currency: PcBuildInputCurrency;
  resolution: PcBuildInputResolution;
  priority: PcBuildInputPriority;
};

const initialValues: FormValues = {
  processor: '', graphicsCard: '', memoryGb: '', memoryType: '', storage: '',
  motherboard: '', powerSupply: '', caseModel: '', budget: '500',
  currency: CurrencyValues.USD, resolution: ResolutionValues['1080p'], priority: PriorityValues.balanced,
};

const currencies: { value: PcBuildInputCurrency; label: string; symbol: string }[] = [
  { value: CurrencyValues.USD, label: 'USD', symbol: '$' },
  { value: CurrencyValues.SAR, label: 'SAR', symbol: '﷼' },
  { value: CurrencyValues.EUR, label: 'EUR', symbol: '€' },
  { value: CurrencyValues.GBP, label: 'GBP', symbol: '£' },
  { value: CurrencyValues.CAD, label: 'CAD', symbol: 'CA$' },
  { value: CurrencyValues.AUD, label: 'AUD', symbol: 'A$' },
];

const priorityOptions: { value: PcBuildInputPriority; label: string }[] = [
  { value: PriorityValues.balanced, label: 'Balanced' },
  { value: PriorityValues.fps, label: 'More FPS' },
  { value: PriorityValues.visuals, label: 'Visuals' },
  { value: PriorityValues.streaming, label: 'Streaming' },
];

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
];

function currencySymbol(value: PcBuildInputCurrency) {
  return currencies.find((currency) => currency.value === value)?.symbol ?? '$';
}

function moneyRange(low: number | null, high: number | null, currency: PcBuildInputCurrency) {
  const symbol = currencySymbol(currency);
  const format = (value: number) => {
    try {
      return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value);
    } catch {
      return String(value);
    }
  };
  if (low !== null && high !== null) return `${symbol}${format(low)}–${symbol}${format(high)}`;
  if (low !== null) return `From ${symbol}${format(low)}`;
  if (high !== null) return `Up to ${symbol}${format(high)}`;
  return 'Price not estimated';
}

function Field({ label, hint, children, testId }: { label: string; hint?: string; children: ReactNode; testId?: string }) {
  return (
    <div className="field" data-testid={testId}>
      <label>{label}{hint && <span className="field-hint">{hint}</span>}</label>
      {children}
    </div>
  );
}

function SiteHeader({ connectionLabel = staticPreview ? 'Website preview' : 'Setup guide', currentPage = 'home' }: { connectionLabel?: string; currentPage?: 'home' | 'hardware' | 'software' | 'operating-systems' }) {
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
      <div className="footer-inner"><span>RigReady · Built around the PC you already own.</span><span>Recommendations are guidance, not a substitute for checking your exact components.</span></div>
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
            <p>Find your PC specs, then review your components, budget, and gaming goals in one place.</p>
            <span className="welcome-card-note">{staticPreview ? 'Find your PC specs and review your upgrade goals.' : 'Get a prioritized upgrade plan for your setup.'}</span>
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
  const selectedApps = softwareApps.filter((app) => selectedAppNames.has(app.name)).sort(compareNames);

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
            <AppChecklist apps={selectedApps} onRemove={(name) => selectApp(name, false)} onClear={() => setSelectedAppNames(new Set())} />

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
  const [values, setValues] = useState<FormValues>(initialValues);
  const [games, setGames] = useState<string[]>([]);
  const [gameDraft, setGameDraft] = useState('');
  const [formError, setFormError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [plan, setPlan] = useState<PcUpgradePlan | null>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const gameInputRef = useRef<HTMLInputElement>(null);
  const health = useHealthCheck({ query: { staleTime: 60_000, retry: false, enabled: !staticPreview } });
  const createPlan = useCreatePcUpgradePlan();
  const selectedCurrency = currencies.find((currency) => currency.value === values.currency);

  useEffect(() => {
    if (plan && !createPlan.isPending) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [plan, createPlan.isPending]);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setValidationError('');
  }

  function addGame() {
    const game = gameDraft.trim();
    if (!game) {
      gameInputRef.current?.focus();
      return;
    }
    if (games.length >= 6) {
      setValidationError('Add up to 6 games so the plan can stay focused.');
      return;
    }
    if (game.length > 100) {
      setValidationError('Game names must be 100 characters or fewer.');
      return;
    }
    if (games.some((existing) => existing.toLowerCase() === game.toLowerCase())) {
      setGameDraft('');
      return;
    }
    setGames((current) => [...current, game]);
    setGameDraft('');
    setValidationError('');
    gameInputRef.current?.focus();
  }

  function removeGame(game: string) {
    setGames((current) => current.filter((item) => item !== game));
    setValidationError('');
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (staticPreview) return;
    setFormError('');
    setValidationError('');
    const budget = Number(values.budget);
    if (!Number.isFinite(budget) || budget < 0 || budget > 50_000) {
      setValidationError('Enter a budget between 0 and 50,000.');
      return;
    }
    if (values.memoryGb && (!Number.isFinite(Number(values.memoryGb)) || Number(values.memoryGb) < 1 || Number(values.memoryGb) > 512)) {
      setValidationError('Memory must be between 1 and 512 GB, or leave it blank.');
      return;
    }
    if (games.length === 0) {
      setValidationError('Add at least one game you want to play.');
      gameInputRef.current?.focus();
      return;
    }

    const optionalText = (value: string) => value.trim() || null;
    const payload: PcBuildInput = {
      processor: optionalText(values.processor),
      graphicsCard: optionalText(values.graphicsCard),
      memoryGb: values.memoryGb ? Number(values.memoryGb) : null,
      memoryType: optionalText(values.memoryType),
      storage: optionalText(values.storage),
      motherboard: optionalText(values.motherboard),
      powerSupply: optionalText(values.powerSupply),
      caseModel: optionalText(values.caseModel),
      budget,
      currency: values.currency,
      games,
      resolution: values.resolution,
      priority: values.priority,
    };
    setPlan(null);
    createPlan.mutate({ data: payload }, {
      onSuccess: (result) => setPlan(result),
      onError: (error) => {
        const message = error instanceof Error ? error.message : 'Something went wrong while building your plan.';
        setFormError(message || 'We couldn’t complete your plan. Check your connection and try again.');
      },
    });
  }

  function startOver() {
    setPlan(null);
    setFormError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const hasConnection =
    health.isSuccess &&
    health.data?.status === 'ok' &&
    health.data.aiConfigured;
  const connectionLabel = staticPreview
    ? 'Website preview'
    : health.isLoading
    ? 'Connecting to advisor'
    : hasConnection
      ? 'Advisor ready'
      : health.isSuccess
        ? 'AI setup needed'
        : 'Advisor offline';

  return (
    <div className="app-shell">
      <SiteHeader connectionLabel={connectionLabel} currentPage="hardware" />

      <main>
        <div className="main-wrap">
          <section className="hero">
            <div className="eyebrow"><span className="eyebrow-line" /> A smarter way to upgrade</div>
            <h1>Your PC has more<br /><em>game in it.</em></h1>
            <p className="hero-copy">
              Tell us what you’re working with and what you want to play. Get a clear upgrade path that respects your budget and checks the details that matter.
            </p>
            <div className="hero-bottom">
              <span className="hero-proof"><ShieldCheck size={15} /> Compatibility-minded advice</span>
              <span className="hero-proof"><Zap size={14} /> Prioritized for your goals</span>
            </div>
          </section>

          <PcSpecsGuide />

          <div className="workspace">
            <section className="form-panel" aria-labelledby="form-title">
              <div className="form-head">
                <div>
                  <h2 id="form-title">Let’s get to know your PC</h2>
                  <p>A little detail goes a long way. Leave anything unknown blank.</p>
                </div>
                <span className="step-badge">ONE QUICK CHECK-IN</span>
              </div>
              <form className="form-content" onSubmit={handleSubmit} noValidate>
                <div className="part-section">
                  <h3 className="section-label"><span className="section-index">01</span> What’s inside your PC?</h3>
                  <p className="optional-intro">The more you know, the more precise the compatibility checks. Every component here is optional.</p>
                  <div className="parts-grid">
                    <Field label="Processor" testId="field-processor">
                      <input id="processor" className="control" value={values.processor} onChange={(event) => update('processor', event.target.value)} placeholder="e.g. Ryzen 5 5600X" maxLength={160} data-testid="input-processor" />
                    </Field>
                    <Field label="Graphics card" testId="field-graphics-card">
                      <input id="graphics-card" className="control" value={values.graphicsCard} onChange={(event) => update('graphicsCard', event.target.value)} placeholder="e.g. GeForce RTX 3060" maxLength={160} data-testid="input-graphics-card" />
                    </Field>
                    <Field label="Memory" hint="(RAM)" testId="field-memory">
                      <input id="memory" className="control" type="number" min="1" max="512" value={values.memoryGb} onChange={(event) => update('memoryGb', event.target.value)} placeholder="e.g. 16 GB" data-testid="input-memory-gb" />
                    </Field>
                    <Field label="Memory type" testId="field-memory-type">
                      <select id="memory-type" className="control" value={values.memoryType} onChange={(event) => update('memoryType', event.target.value)} data-testid="select-memory-type">
                        <option value="">Not sure</option><option value="DDR3">DDR3</option><option value="DDR4">DDR4</option><option value="DDR5">DDR5</option>
                      </select>
                    </Field>
                    <Field label="Storage" testId="field-storage">
                      <input id="storage" className="control" value={values.storage} onChange={(event) => update('storage', event.target.value)} placeholder="e.g. 1 TB NVMe SSD" maxLength={160} data-testid="input-storage" />
                    </Field>
                    <Field label="Motherboard" testId="field-motherboard">
                      <input id="motherboard" className="control" value={values.motherboard} onChange={(event) => update('motherboard', event.target.value)} placeholder="Model, if you know it" maxLength={160} data-testid="input-motherboard" />
                    </Field>
                    <Field label="Power supply" testId="field-power-supply">
                      <input id="power-supply" className="control" value={values.powerSupply} onChange={(event) => update('powerSupply', event.target.value)} placeholder="e.g. 650W Corsair RM650" maxLength={160} data-testid="input-power-supply" />
                    </Field>
                    <Field label="PC case" testId="field-case">
                      <input id="case-model" className="control" value={values.caseModel} onChange={(event) => update('caseModel', event.target.value)} placeholder="Model or size, if known" maxLength={160} data-testid="input-case-model" />
                    </Field>
                  </div>
                </div>

                <div className="form-divider" />

                <div className="goals-section">
                  <div className="goal-block">
                    <h3 className="section-label"><span className="section-index">02</span> What can you spend?</h3>
                    <div className="budget-row">
                      <select aria-label="Currency" className="control currency-select" value={values.currency} onChange={(event) => update('currency', event.target.value as PcBuildInputCurrency)} data-testid="select-currency">
                        {currencies.map((currency) => <option key={currency.value} value={currency.value}>{currency.label}</option>)}
                      </select>
                      <div className="budget-input-wrap">
                        <span className="budget-prefix">{selectedCurrency?.symbol}</span>
                        <input aria-label="Upgrade budget" className="control budget-control" type="number" min="0" max="50000" step="1" value={values.budget} onChange={(event) => update('budget', event.target.value)} data-testid="input-budget" />
                      </div>
                    </div>
                  </div>

                  <div className="goal-block">
                    <h3 className="section-label"><span className="section-index">03</span> What do you play?</h3>
                    <div className="game-entry">
                      <input ref={gameInputRef} className="control" value={gameDraft} onChange={(event) => setGameDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addGame(); } }} placeholder="e.g. Baldur’s Gate 3" maxLength={100} aria-label="Game title" data-testid="input-game" />
                      <button type="button" className="add-game" onClick={addGame} aria-label="Add game" data-testid="button-add-game"><Plus size={17} /></button>
                    </div>
                    {games.length > 0 && (
                      <div className="game-chips" aria-label="Games added" data-testid="list-games">
                        {games.map((game, index) => (
                          <span className="game-chip" key={game} data-testid={`chip-game-${index}`}>
                            {game}
                            <button type="button" onClick={() => removeGame(game)} aria-label={`Remove ${game}`} data-testid={`button-remove-game-${index}`}><span aria-hidden="true">×</span></button>
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="game-helper">{games.length}/6 games · Add at least one</p>
                  </div>

                  <div className="goal-block">
                    <h3 className="section-label"><span className="section-index">04</span> Your screen target</h3>
                    <div className="segmented" role="group" aria-label="Desired resolution" data-testid="group-resolution">
                      {Object.values(ResolutionValues).map((resolution) => (
                        <button type="button" key={resolution} className="segment" aria-pressed={values.resolution === resolution} onClick={() => update('resolution', resolution)} data-testid={`button-resolution-${resolution}`}>{resolution}</button>
                      ))}
                    </div>
                  </div>

                  <div className="goal-block">
                    <h3 className="section-label"><span className="section-index">05</span> What matters most?</h3>
                    <div className="segmented" role="group" aria-label="Upgrade priority" data-testid="group-priority">
                      {priorityOptions.map((option) => (
                        <button type="button" key={option.value} className="segment" aria-pressed={values.priority === option.value} onClick={() => update('priority', option.value)} data-testid={`button-priority-${option.value}`}>{option.label}</button>
                      ))}
                    </div>
                  </div>
                </div>

                {validationError && <div className="form-alert" role="alert" data-testid="status-validation-error">{validationError}</div>}
                {formError && <div className="error-box" role="alert" data-testid="status-plan-error"><strong>Your plan didn’t come through.</strong> {formError}</div>}
                <div className="submit-row">
                  <div className="privacy-note"><LockKeyhole size={14} /><span>{staticPreview ? 'Your entries stay on this page. Upgrade recommendations are not connected yet.' : 'Your PC details are sent to OpenAI for analysis. Don’t include anything private.'}</span></div>
                  <button type="submit" className="submit-button" disabled={staticPreview || createPlan.isPending} data-testid="button-generate-plan">
                    {staticPreview ? 'Upgrade plans unavailable in preview' : createPlan.isPending ? <><Activity size={15} className="spin-icon" /> Reading your build…</> : <>Build my upgrade plan <ArrowRight size={16} /></>}
                  </button>
                </div>
              </form>
            </section>

            <aside className="side-panel" aria-label="How the advisor works">
              <div className="side-top">
                <div className="side-overline">Good upgrades, no guesswork</div>
                <h3>Make your next part the right part.</h3>
                <p>A useful plan starts with what you already own—not a shopping list.</p>
              </div>
              <div className="side-content">
                <h4>Here’s what you’ll get</h4>
                <ol className="side-list">
                  <li><span className="side-number">01</span><div><strong>A sensible order</strong><span>Put the biggest gaming gains first.</span></div></li>
                  <li><span className="side-number">02</span><div><strong>Compatibility flags</strong><span>Know what needs a closer look before buying.</span></div></li>
                  <li><span className="side-number">03</span><div><strong>Budget-aware picks</strong><span>See estimated ranges, not surprise totals.</span></div></li>
                </ol>
                <div className="side-divider" />
                <div className="estimate-note"><Info size={14} /><span>Part prices are estimates. Always verify exact fit and compatibility before purchase.</span></div>
              </div>
            </aside>
          </div>

          {createPlan.isPending && (
            <section className="loading-shell fade-up" aria-live="polite" aria-label="Analyzing your PC" data-testid="status-plan-loading">
              <div className="eyebrow"><span className="eyebrow-line" /> Checking your upgrade path</div>
              <h2 style={{ fontFamily: 'var(--app-font-serif)', letterSpacing: '-.04em', margin: '11px 0 17px', fontSize: 22 }}>Matching your parts to your games…</h2>
              <p style={{ margin: '0 0 21px', color: 'hsl(var(--muted-foreground))', fontSize: 12 }}>We’re weighing your budget, target resolution, and the details you shared. This can take a moment.</p>
              <div className="skeleton skeleton-title" /><div className="skeleton skeleton-line" /><div className="skeleton skeleton-line skeleton-short" />
              <div className="skeleton skeleton-card" /><div className="skeleton skeleton-card" />
            </section>
          )}

          {plan && (
            <section ref={resultsRef} className="results-wrap fade-up" aria-labelledby="results-title" data-testid="section-upgrade-results">
              <div className="results-head">
                <div>
                  <div className="eyebrow"><span className="eyebrow-line" /> Your personalized upgrade path</div>
                  <h2 id="results-title">A clearer way forward.</h2>
                  <p data-testid="text-plan-summary">Based on your current parts, budget, games, and {values.resolution} target.</p>
                </div>
                <div className="result-mark"><BadgeCheck size={23} /></div>
              </div>
              <div className="plan-intro" data-testid="card-plan-overview">
                <h3>{plan.headline}</h3>
                <p>{plan.summary}</p>
                {plan.budgetNote && <div className="budget-callout"><Info size={15} /><span>{plan.budgetNote}</span></div>}
              </div>

              <div className="results-grid">
                <section className="results-panel" aria-labelledby="upgrades-heading">
                  <div className="panel-heading"><h3 id="upgrades-heading">Recommended upgrades</h3><span className="count-pill">{plan.upgrades.length} {plan.upgrades.length === 1 ? 'step' : 'steps'}</span></div>
                  {plan.upgrades.length > 0 ? (
                    <div className="upgrade-list">
                      {plan.upgrades.map((upgrade, index) => (
                        <article className="upgrade-item" key={`${upgrade.priority}-${upgrade.category}`} data-testid={`card-upgrade-${index}`}>
                          <div className="upgrade-top">
                            <span className="priority-num">{String(upgrade.priority).padStart(2, '0')}</span>
                            <div className="upgrade-main"><span className="category-text">{upgrade.category}</span><h4>{upgrade.recommendedPart}</h4></div>
                            <span className="upgrade-price">{moneyRange(upgrade.estimatedPriceLow, upgrade.estimatedPriceHigh, values.currency)}</span>
                          </div>
                          <p className="upgrade-reason">{upgrade.reason}</p>
                          <div className="compatibility-note"><CheckCircle2 size={13} /><span>{upgrade.compatibilityNote}</span></div>
                          <span className={`impact impact-${upgrade.impact}`}>{upgrade.impact} impact</span>
                        </article>
                      ))}
                    </div>
                  ) : <p className="optional-intro" style={{ padding: '18px 19px' }}>No individual upgrades were recommended for this plan.</p>}
                </section>

                <div style={{ display: 'grid', gap: 16, alignContent: 'start' }}>
                  <section className="results-panel" aria-labelledby="checks-heading">
                    <div className="panel-heading"><h3 id="checks-heading">Compatibility checks</h3><span className="count-pill">{plan.checks.length} checks</span></div>
                    {plan.checks.length > 0 ? (
                      <div className="checks-list">
                        {plan.checks.map((check, index) => {
                          const Icon = check.severity === 'critical' ? AlertCircle : check.severity === 'caution' ? AlertTriangle : Check;
                          return <div className="check-item" key={`${check.item}-${index}`} data-testid={`item-compatibility-${index}`}>
                            <span className={`check-icon check-${check.severity}`}><Icon size={13} /></span>
                            <div><strong>{check.item}</strong><p>{check.detail}</p></div>
                          </div>;
                        })}
                      </div>
                    ) : <p className="optional-intro" style={{ padding: '16px 18px' }}>No specific compatibility checks were returned. Confirm every part manually before buying.</p>}
                  </section>
                  <section className="results-panel" aria-labelledby="order-heading">
                    <div className="panel-heading"><h3 id="order-heading">Build order</h3><ChevronRight size={15} color="hsl(var(--muted-foreground))" /></div>
                    {plan.buildOrder.length > 0 ? (
                      <div className="build-order">
                        {plan.buildOrder.map((step, index) => <div className="order-row" key={`${index}-${step}`} data-testid={`item-build-order-${index}`}><span className="order-index">{String(index + 1).padStart(2, '0')}</span><span>{step}</span></div>)}
                      </div>
                    ) : <p className="optional-intro" style={{ padding: '16px 18px' }}>No build sequence was returned.</p>}
                  </section>
                </div>
              </div>
              <div className="safety-banner" data-testid="text-purchase-safety"><AlertTriangle size={15} /><span>Prices are estimates, not live quotes. Part names and compatibility guidance are informational: verify socket, dimensions, power requirements, firmware, and exact model fit with the manufacturer before purchasing.</span></div>
              <button className="submit-button" type="button" onClick={startOver} style={{ marginTop: 17 }} data-testid="button-start-over"><RotateCcw size={14} /> Adjust my details</button>
            </section>
          )}

        </div>
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

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
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
