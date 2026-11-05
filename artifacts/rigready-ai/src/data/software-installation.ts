export type LinuxInstallMethod = {
  title: string;
  source: 'Developer guide' | 'Developer package' | 'Distro repository' | 'Community repository' | 'AUR community package';
  url: string;
  steps: string[];
  packageName?: string;
  command?: string;
};
export type LinuxInstallMethods = Partial<Record<'deb' | 'rpm' | 'arch', LinuxInstallMethod>>;

function guide(title: string, url: string, detail: string, source: LinuxInstallMethod['source'] = 'Developer guide'): LinuxInstallMethod {
  return { title, url, source, steps: ['Open the linked installation guide.', detail, 'Choose instructions for your distribution release and CPU architecture, then follow the guide’s installation and update steps.'] };
}
function packageDownload(format: 'deb' | 'rpm', url: string): LinuxInstallMethod {
  return {
    title: `Download a .${format} package`, source: 'Developer package', url,
    steps: [`Open the developer’s releases and choose the current .${format} asset for your CPU architecture.`, 'Download the package and open it with your distribution’s package installer.', 'Follow the developer’s dependency and update instructions; package availability can vary by release.'],
  };
}
function repo(target: 'Debian' | 'Fedora' | 'Arch', packageName: string, repository: 'main' | 'extra' | 'multilib' = 'extra'): LinuxInstallMethod {
  const url = target === 'Debian' ? `https://packages.debian.org/stable/${packageName}` : target === 'Fedora' ? `https://packages.fedoraproject.org/pkgs/${packageName}/${packageName}/` : `https://archlinux.org/packages/${repository}/x86_64/${packageName}/`;
  const command = target === 'Debian' ? `sudo apt install ${packageName}` : target === 'Fedora' ? `sudo dnf install ${packageName}` : `sudo pacman -S ${packageName}`;
  return {
    title: `${target} repository${target === 'Arch' ? ' (pacman)' : ''}`, source: 'Distro repository', url, packageName, command,
    steps: [`Check the ${target} package page for your release and architecture.`, target === 'Arch' ? `Follow Arch’s full-system update guidance first and enable the ${repository} repository if needed.` : `Update your package lists using ${target}’s instructions and make sure the required repository is enabled.`, 'Install the package with your software manager or the command below, then use your package manager for updates.'],
  };
}
function aur(packageName: string, note?: string): LinuxInstallMethod {
  return {
    title: 'Arch User Repository (AUR)', source: 'AUR community package', url: `https://aur.archlinux.org/packages/${packageName}`, packageName,
    steps: ['Open the AUR package page and check its upstream URL, version, and maintainer.', note ?? 'Review the PKGBUILD and recent comments before building; AUR recipes contain community-provided build commands.', 'Follow the Arch AUR guide to build and install the package, or use an AUR helper you already trust. AUR packages are not installed directly with pacman -S.'],
  };
}

// Missing methods are explicitly shown as "Not listed" in the guide. They are
// not evidence that no third-party package exists. No installer is run here.
export const linuxInstallations: Record<string, LinuxInstallMethods> = {
  Firefox: {
    deb: guide('Mozilla’s Debian / Ubuntu guide', 'https://support.mozilla.org/en-US/kb/install-firefox-linux', 'Follow Mozilla’s DEB section, including its signing key and APT repository setup. The distro’s Firefox package may use a different release channel or packaging format.'),
    rpm: repo('Fedora', 'firefox'), arch: repo('Arch', 'firefox'),
  },
  Brave: {
    deb: guide('Brave’s APT repository', 'https://brave.com/linux/', 'Use the Debian / Ubuntu section and add the signing key and repository exactly as documented.'),
    rpm: guide('Brave’s RPM repository', 'https://brave.com/linux/', 'Choose the Fedora / RHEL or openSUSE section matching your distribution; their repository steps differ.'),
    arch: aur('brave-bin'),
  },
  'Zen Browser': { arch: aur('zen-browser-bin') },
  LibreWolf: {
    deb: guide('LibreWolf’s Debian-family instructions', 'https://librewolf.net/installation/debian/', 'Use the instructions for your Debian-family release and follow the documented repository and signing-key steps.'),
    rpm: guide('LibreWolf’s Fedora instructions', 'https://librewolf.net/installation/fedora/', 'Follow the Fedora instructions and review the repository maintainer before enabling it.'),
    arch: aur('librewolf-bin'),
  },
  Helium: {
    deb: guide('Helium’s APT repository', 'https://github.com/imputnet/helium-linux#debianubuntu', 'Use the Debian / Ubuntu section to add Helium’s signing key and APT repository.'),
    rpm: guide('Helium’s Fedora COPR instructions', 'https://github.com/imputnet/helium-linux#fedora', 'Use the Fedora section for the project’s documented COPR repository.'),
    arch: aur('helium-browser-bin'),
  },
  Vivaldi: { deb: packageDownload('deb', 'https://vivaldi.com/download/'), rpm: packageDownload('rpm', 'https://vivaldi.com/download/'), arch: repo('Arch', 'vivaldi') },
  Waterfox: { arch: aur('waterfox-bin') },
  Floorp: { deb: guide('Floorp’s Ubuntu / Mint repository', 'https://ppa.floorp.app/', 'Follow Floorp’s PPA repository instructions for supported Debian-family distributions.'), arch: aur('floorp-bin') },
  Steam: {
    deb: guide('Valve’s Linux client instructions', 'https://github.com/ValveSoftware/steam-for-linux#readme', 'Use Valve’s current Ubuntu / Ubuntu LTS requirements and DEB installation instructions.'),
    rpm: guide('Steam on Fedora through RPM Fusion', 'https://rpmfusion.org/Howto/Steam', 'Follow the RPM Fusion instructions for your Fedora release, including any required repository setup.', 'Community repository'),
    arch: repo('Arch', 'steam', 'multilib'),
  },
  'itch.io app': { arch: aur('itch') },
  'Heroic Games Launcher': {
    deb: packageDownload('deb', 'https://github.com/Heroic-Games-Launcher/HeroicGamesLauncher/releases/latest'),
    rpm: packageDownload('rpm', 'https://github.com/Heroic-Games-Launcher/HeroicGamesLauncher/releases/latest'),
    arch: aur('heroic-games-launcher-bin'),
  },
  Lutris: { deb: guide('Lutris’s Debian / Ubuntu instructions', 'https://lutris.net/downloads/', 'Select your distribution and follow its current package or repository instructions.'), rpm: repo('Fedora', 'lutris'), arch: repo('Arch', 'lutris') },
  'Prism Launcher': {
    deb: guide('Prism Launcher’s Debian / Ubuntu guide', 'https://prismlauncher.org/download/linux/', 'Use the project-linked Prism Launcher for Debian repository and review its maintainer and supported releases.', 'Community repository'),
    rpm: guide('Prism Launcher’s Fedora guide', 'https://prismlauncher.org/download/linux/', 'Use the Fedora section and review the documented COPR repository before enabling it.', 'Community repository'),
    arch: repo('Arch', 'prismlauncher'),
  },
  Bottles: { arch: aur('bottles') },
  Discord: {
    deb: packageDownload('deb', 'https://discord.com/download'),
    rpm: guide('Discord through RPM Fusion', 'https://rpmfusion.org/Configuration', 'Enable the appropriate RPM Fusion nonfree repository for your Fedora release, then follow its Discord package instructions.', 'Community repository'),
    arch: repo('Arch', 'discord'),
  },
  TeamSpeak: { arch: aur('teamspeak', 'Check the client version and channel carefully: this community package can track a TeamSpeak beta. Review its PKGBUILD before building.') },
  Signal: { deb: guide('Signal’s official Linux instructions', 'https://signal.org/download/linux/', 'Follow the signing-key and APT-repository instructions for supported 64-bit Debian-based distributions.'), arch: repo('Arch', 'signal-desktop') },
  Mumble: { deb: repo('Debian', 'mumble'), rpm: repo('Fedora', 'mumble'), arch: repo('Arch', 'mumble') },
  Element: { deb: guide('Element’s Linux desktop download', 'https://element.io/download', 'Choose the Debian / Ubuntu desktop instructions and follow the signing-key and repository setup shown there.'), arch: repo('Arch', 'element-desktop') },
  Jami: { deb: guide('Jami’s Debian-family packages', 'https://jami.net/download-jami/', 'Choose Linux, your Debian-family distribution, release, and architecture.'), rpm: guide('Jami’s RPM-family packages', 'https://jami.net/download-jami/', 'Choose Linux and the RPM distribution and release you use; follow its specific repository instructions.') },
  Slack: { deb: packageDownload('deb', 'https://slack.com/downloads/linux'), rpm: packageDownload('rpm', 'https://slack.com/downloads/linux'), arch: aur('slack-desktop') },
  'OBS Studio': { deb: guide('OBS Studio’s Ubuntu installation guide', 'https://obsproject.com/kb/linux-installation', 'Follow the supported Ubuntu section, including the PPA setup and current system requirements.'), rpm: repo('Fedora', 'obs-studio'), arch: repo('Arch', 'obs-studio') },
  '7-Zip': { deb: repo('Debian', '7zip'), rpm: repo('Fedora', '7zip'), arch: repo('Arch', '7zip') },
  'VLC media player': { deb: guide('VideoLAN’s Debian instructions', 'https://www.videolan.org/vlc/download-debian.html', 'Use the instructions for your supported Debian release.'), rpm: guide('VideoLAN’s Fedora instructions', 'https://www.videolan.org/vlc/download-fedora.html', 'Follow VideoLAN’s Fedora guide for the current repository and codec requirements.'), arch: repo('Arch', 'vlc') },
  balenaEtcher: { deb: packageDownload('deb', 'https://github.com/balena-io/etcher/releases/latest'), rpm: packageDownload('rpm', 'https://github.com/balena-io/etcher/releases/latest'), arch: aur('balena-etcher') },
  KeePassXC: { deb: repo('Debian', 'keepassxc'), rpm: repo('Fedora', 'keepassxc'), arch: repo('Arch', 'keepassxc') },
  LocalSend: { deb: packageDownload('deb', 'https://github.com/localsend/localsend/releases/latest'), arch: aur('localsend-bin') },
  Ventoy: { arch: aur('ventoy-bin') },
};
