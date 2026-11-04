import { linuxOnly, type OsSupport } from '@/components/os-support';

export type DesktopKind = 'Desktop environment' | 'Compositor' | 'Shell';
export type DesktopOption = {
  name: string;
  kind: DesktopKind;
  displayKind?: string;
  bestFor: string;
  description: string;
  note: string;
  url: string;
  docs: string;
  osSupport?: OsSupport;
};

// Source-review notes: DESKTOP-CATALOG-SOURCES.md. These are informational links;
// no desktop configuration or installer is fetched or executed by the site.
export const desktopOptions: DesktopOption[] = [
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
    name: 'Hyprland', kind: 'Compositor', displayKind: 'Wayland compositor', bestFor: 'A custom Wayland tiling setup',
    description: 'A Wayland compositor that manages windows, layouts, and effects. Add compatible desktop tools or a shell to build your preferred interface.',
    note: 'Expect configuration work. Check graphics support and your distribution’s installation guidance before changing sessions.',
    url: 'https://hypr.land/', docs: 'https://wiki.hypr.land/',
  },
  {
    name: 'Niri', kind: 'Compositor', displayKind: 'Wayland compositor', bestFor: 'Scrollable tiling and a column-based workflow',
    description: 'A Wayland compositor that arranges windows in columns on a scrollable workspace. Move through your windows without shrinking every window to fit the screen.',
    note: 'Follow the getting-started guide for session setup, desktop tools, and support for X11 applications.',
    url: 'https://github.com/niri-wm/niri', docs: 'https://niri-wm.github.io/niri/Getting-Started.html',
  },
  {
    name: 'Mango', kind: 'Compositor', displayKind: 'Wayland compositor', bestFor: 'A configurable, dwm-inspired Wayland desktop',
    description: 'A Wayland compositor with tiling layouts and configurable window-management controls for building a custom Linux desktop.',
    note: 'Use the project’s installation and configuration guides, and check which supporting desktop tools your setup needs.',
    url: 'https://github.com/mangowm/mango', docs: 'https://mangowm.github.io/docs/installation',
  },
  {
    name: 'Sway', kind: 'Compositor', displayKind: 'Wayland compositor', bestFor: 'An i3-style tiling workflow on Wayland',
    description: 'A keyboard-driven tiling compositor with an i3-compatible configuration style, workspaces, and multi-monitor layouts.',
    note: 'Use the Sway documentation for input, outputs, screen sharing, and supporting desktop tools. An i3 configuration may still need adjustments.',
    url: 'https://github.com/swaywm/sway', docs: 'https://github.com/swaywm/sway/wiki',
  },
  {
    name: 'SwayFX', kind: 'Compositor', displayKind: 'Wayland compositor', bestFor: 'Sway-style tiling with additional visual effects',
    description: 'A fork of Sway that adds effects such as blur, shadows, and rounded corners to its tiling workflow.',
    note: 'Follow SwayFX’s own release and configuration instructions. Its rendering dependencies and settings can differ from upstream Sway.',
    url: 'https://github.com/wlrfx/swayfx', docs: 'https://github.com/wlrfx/swayfx#readme',
  },
  {
    name: 'Wayfire', kind: 'Compositor', displayKind: 'Wayland compositor', bestFor: 'A floating desktop with configurable effects',
    description: 'A plugin-based Wayland compositor inspired by Compiz, with window effects and configurable desktop behavior.',
    note: 'Check the matching versions of Wayfire and its plugins. Add the panel, launcher, and other desktop tools you need.',
    url: 'https://github.com/WayfireWM/wayfire', docs: 'https://github.com/WayfireWM/wayfire/wiki/Tutorial',
  },
  {
    name: 'labwc', kind: 'Compositor', displayKind: 'Wayland compositor', bestFor: 'An Openbox-style floating desktop on Wayland',
    description: 'A lightweight, stacking Wayland compositor inspired by Openbox, designed to work with independent desktop tools.',
    note: 'It provides window management rather than a complete desktop. Follow its configuration guide for menus, keybindings, and companion tools.',
    url: 'https://github.com/labwc/labwc', docs: 'https://labwc.github.io/',
  },
  {
    name: 'river', kind: 'Compositor', displayKind: 'Wayland compositor', bestFor: 'Choosing a separate window-management workflow',
    description: 'A Wayland compositor that delegates window-management policy to a separate, compatible window-manager process.',
    note: 'Current river needs a compatible window manager. Older dynamic-tiling guides may refer to river-classic; check which version your distribution supplies.',
    url: 'https://codeberg.org/river/river', docs: 'https://codeberg.org/river/wiki',
  },
  {
    name: 'dwl', kind: 'Compositor', displayKind: 'Wayland compositor', bestFor: 'A small, source-configured tiling setup',
    description: 'A compact Wayland compositor inspired by dwm, with a configuration workflow aimed at users comfortable building software.',
    note: 'Development moved from the archived GitHub repository to Codeberg. Read the current build, configuration, and Xwayland instructions there.',
    url: 'https://codeberg.org/dwl/dwl', docs: 'https://codeberg.org/dwl/dwl/wiki',
  },
  {
    name: 'Scroll', kind: 'Compositor', displayKind: 'Wayland compositor', bestFor: 'A scrolling layout with a Sway-style configuration',
    description: 'A Sway-derived Wayland compositor with a scrolling layout inspired by PaperWM and Niri.',
    note: 'Use Scroll’s own tutorial and example configuration. Its layout behavior and dependencies differ from standard Sway.',
    url: 'https://github.com/dawsers/scroll', docs: 'https://github.com/dawsers/scroll/blob/master/TUTORIAL.md',
  },
  {
    name: 'Qtile', kind: 'Compositor', displayKind: 'X11 / Wayland window manager', bestFor: 'A desktop configured in Python',
    description: 'A programmable tiling window manager that can run as an X11 window manager or a Wayland compositor, with configurable layouts and widgets.',
    note: 'Check backend-specific dependencies and feature support. An X11 configuration or widget may need changes on Wayland.',
    url: 'https://github.com/qtile/qtile', docs: 'https://docs.qtile.org/en/latest/',
  },
  {
    name: 'i3', kind: 'Compositor', displayKind: 'X11 window manager', bestFor: 'A keyboard-driven X11 tiling desktop',
    description: 'A tiling window manager with workspaces, a plain-text configuration, and predictable keyboard-driven window placement.',
    note: 'Requires an X11 session. For a similar workflow on Wayland, compare Sway and check its migration guidance.',
    url: 'https://github.com/i3/i3', docs: 'https://i3wm.org/docs/',
  },
  {
    name: 'awesome', kind: 'Compositor', displayKind: 'X11 window manager', bestFor: 'A highly programmable Lua desktop',
    description: 'A configurable X11 window manager with tiling and floating layouts, Lua scripting, and widgets for building a custom interface.',
    note: 'Use documentation matching your installed release. Development-version configuration examples may need a newer awesome build.',
    url: 'https://github.com/awesomeWM/awesome', docs: 'https://awesomewm.org/apidoc/',
  },
  {
    name: 'bspwm', kind: 'Compositor', displayKind: 'X11 window manager', bestFor: 'Scriptable binary-space tiling',
    description: 'A tiling X11 window manager controlled through the bspc command, with keyboard shortcuts commonly handled by sxhkd.',
    note: 'Set up its configuration and a keybinding daemon before starting a session. It does not provide a complete desktop or compositor.',
    url: 'https://github.com/baskerville/bspwm', docs: 'https://github.com/baskerville/bspwm#readme',
  },
  {
    name: 'dwm', kind: 'Compositor', displayKind: 'X11 window manager', bestFor: 'A minimal desktop configured in C',
    description: 'Suckless’s small dynamic window manager for X11, with tiling, monocle, and floating layouts.',
    note: 'Customization commonly involves editing its configuration and rebuilding. Review patches and maintain your configuration across updates.',
    url: 'https://dwm.suckless.org/', docs: 'https://dwm.suckless.org/tutorial/',
  },
  {
    name: 'XMonad', kind: 'Compositor', displayKind: 'X11 window manager', bestFor: 'A tiling desktop configured in Haskell',
    description: 'A programmable tiling X11 window manager with extensible layouts and a configuration written in Haskell.',
    note: 'Follow the installation guide for XMonad, its Haskell dependencies, and any matching xmonad-contrib modules.',
    url: 'https://github.com/xmonad/xmonad', docs: 'https://xmonad.org/documentation.html',
  },
  {
    name: 'herbstluftwm', kind: 'Compositor', displayKind: 'X11 window manager', bestFor: 'Manual tiling controlled with scripts',
    description: 'A manual tiling X11 window manager with split frames, tags, and a command interface for configuring your workflow.',
    note: 'Read the autostart and herbstclient documentation. You will need separate tools for panels, notifications, and other desktop functions.',
    url: 'https://github.com/herbstluftwm/herbstluftwm', docs: 'https://herbstluftwm.org/',
  },
  {
    name: 'Openbox', kind: 'Compositor', displayKind: 'X11 window manager', bestFor: 'A traditional floating X11 desktop',
    description: 'A configurable stacking window manager with menus, keyboard shortcuts, and a small desktop footprint.',
    note: 'Use your distribution’s maintained packages and documentation. It needs X11; it is not a native Wayland compositor.',
    url: 'https://github.com/danakj/openbox', docs: 'https://github.com/danakj/openbox#readme',
  },
  {
    name: 'Picom', kind: 'Compositor', displayKind: 'X11 compositor', bestFor: 'Effects alongside an X11 window manager',
    description: 'A standalone X11 compositor that adds effects such as transparency and shadows to a compatible window-manager setup.',
    note: 'Picom does not manage windows or run a Wayland session. Avoid running it alongside another active X11 compositor.',
    url: 'https://github.com/yshui/picom', docs: 'https://github.com/yshui/picom#readme',
  },
  {
    name: 'Compiz', kind: 'Compositor', displayKind: 'X11 compositing window manager', bestFor: 'Classic plugin-based desktop effects',
    description: 'The Compiz Reloaded project continues the Compiz 0.8 series of OpenGL compositing window management for X11.',
    note: 'This is an established X11 project. Check your distribution’s maintained packages and matching plugins; it does not replace a Wayland compositor.',
    url: 'https://gitlab.com/compiz/compiz-core', docs: 'https://github.com/compiz-reloaded/compiz#readme',
  },
  {
    name: 'KWin', kind: 'Compositor', displayKind: 'Desktop compositor · Plasma', bestFor: 'Window management inside KDE Plasma',
    description: 'KDE’s window manager and Wayland compositor, providing window rules, workspaces, effects, and desktop integration for Plasma.',
    note: 'Install and update it with your distribution’s supported Plasma session. It is not a drop-in replacement for GNOME’s compositor.',
    url: 'https://github.com/KDE/kwin', docs: 'https://userbase.kde.org/KWin',
    osSupport: { ...linuxOnly, linux: 'limited', note: 'Integrated with KDE Plasma. Session availability and supported features depend on your distribution’s Plasma release.' },
  },
  {
    name: 'Mutter', kind: 'Compositor', displayKind: 'Desktop compositor · GNOME', bestFor: 'Window management inside GNOME',
    description: 'GNOME’s compositor and Wayland display server, used by GNOME Shell for window management and rendering.',
    note: 'Use the version supplied with your GNOME session. Replacing its compositor independently can break desktop integration.',
    url: 'https://github.com/GNOME/mutter', docs: 'https://mutter.gnome.org/',
    osSupport: { ...linuxOnly, linux: 'limited', note: 'Designed for GNOME Shell and other clients using Mutter’s APIs. Use matching desktop packages.' },
  },
  {
    name: 'COSMIC Compositor', kind: 'Compositor', displayKind: 'Desktop compositor · COSMIC', bestFor: 'Window management inside COSMIC',
    description: 'System76’s cosmic-comp provides the Wayland compositor for COSMIC’s tiling and floating desktop workflows.',
    note: 'Start with the distribution’s COSMIC session rather than assembling mismatched desktop components.',
    url: 'https://github.com/pop-os/cosmic-comp', docs: 'https://github.com/pop-os/cosmic-comp#readme',
    osSupport: { ...linuxOnly, linux: 'limited', note: 'Part of the COSMIC desktop. Availability depends on your distribution’s supported COSMIC packages.' },
  },
  {
    name: 'Weston', kind: 'Compositor', displayKind: 'Wayland compositor', bestFor: 'Wayland development, testing, and kiosk setups',
    description: 'A Wayland compositor with libweston and desktop or kiosk shells, used for testing, development, and tailored display systems.',
    note: 'Check its documented backends and shells. It is not a complete everyday desktop with the applications and settings of GNOME or Plasma.',
    url: 'https://gitlab.freedesktop.org/wayland/weston', docs: 'https://wayland.pages.freedesktop.org/weston/',
  },
  {
    name: 'Miracle-WM', kind: 'Compositor', displayKind: 'Wayland compositor', bestFor: 'A Mir-based tiling desktop',
    description: 'A Wayland compositor built on Mir, with a keyboard-driven tiling workflow and configurable desktop behavior.',
    note: 'Follow the current user wiki for supported installation routes, hardware requirements, and configuration.',
    url: 'https://github.com/miracle-wm-org/miracle-wm', docs: 'https://wiki.miracle-wm.org/',
  },
  {
    name: 'Caelestia', kind: 'Shell', displayKind: 'Desktop shell', bestFor: 'A fluid, customizable desktop interface',
    description: 'A Linux desktop shell from the Caelestia project, providing the interface around a compositor-driven desktop setup.',
    note: 'Read its supported setup and configuration requirements before applying its shell or related dotfiles.',
    url: 'https://github.com/caelestia-dots/shell', docs: 'https://caelestiashell.com/',
    osSupport: { ...linuxOnly, linux: 'limited', note: 'Requires Hyprland and the shell’s dependencies. Official install options include Arch Linux and Nix; other distributions use the manual guide.' },
  },
  {
    name: 'Ryoku', kind: 'Shell', displayKind: 'Hyprland desktop setup', bestFor: 'A Hyprland desktop setup with project tooling',
    description: 'A desktop setup from the Ryoku project, with a shell experience and related tools for its supported Linux configurations.',
    note: 'Ryoku includes a broader desktop setup and project tools. Follow the official guide for your distribution and compositor; installation paths differ between supported setups.',
    url: 'https://ryoku.dev/', docs: 'https://docs.ryoku.dev/',
    osSupport: { ...linuxOnly, linux: 'limited', note: 'Targets specific Linux editions, including Arch and CachyOS, with additional distro editions and a separate NixOS port. Support varies by edition and compositor.' },
  },
  {
    name: 'Noctalia', kind: 'Shell', displayKind: 'Desktop shell', bestFor: 'An integrated interface for a Wayland compositor',
    description: 'A customizable desktop shell with panels, launcher, notifications, and controls for supported Wayland compositor workflows.',
    note: 'Check the project’s current compositor integrations; available features can differ between setups.',
    url: 'https://github.com/noctalia-dev/noctalia', docs: 'https://docs.noctalia.dev/noctalia/getting-started/installation/',
    osSupport: { ...linuxOnly, linux: 'limited', note: 'Requires a compatible Wayland compositor with layer-shell support. Integrations include Hyprland, Niri, and Mango; available features differ by compositor.' },
  },
  {
    name: 'Dux Modular Shell', kind: 'Shell', displayKind: 'Desktop shell', bestFor: 'An integrated interface across supported Wayland desktops',
    description: 'Previously DankMaterialShell (DMS), this Quickshell-based desktop shell combines panels, a launcher, notifications, settings, and session controls.',
    note: 'Use the current upstream installation and compositor guides. Features and workspace integrations vary across supported compositors.',
    url: 'https://github.com/duxlabs-dev/dux-shell', docs: 'https://duxlabs.dev/docs/dms/installation',
    osSupport: { ...linuxOnly, linux: 'limited', note: 'Supports specific Wayland setups, including Niri, Hyprland, Sway, Mango, labwc, Scroll, and Miracle-WM. Check the current distro and compositor requirements.' },
  },
  {
    name: 'illogical-impulse', kind: 'Shell', displayKind: 'Desktop shell · Hyprland setup', bestFor: 'A Quickshell interface for Hyprland',
    description: 'end-4’s graphical shell and Hyprland dotfiles, with a desktop overview, launcher, widgets, and wallpaper-based theming.',
    note: 'Use the supported Quickshell edition and match its required Hyprland version. Older AGS editions are listed as unsupported by the project.',
    url: 'https://github.com/end-4/dots-hyprland', docs: 'https://ii.clsty.link/en/ii-qs/01setup/',
    osSupport: { ...linuxOnly, linux: 'limited', note: 'Requires the documented Hyprland, Quickshell, and distribution dependencies. Applying dotfiles changes desktop configuration.' },
  },
  {
    name: 'nwg-shell', kind: 'Shell', displayKind: 'Desktop shell', bestFor: 'GTK-based tools for a Sway or Hyprland desktop',
    description: 'A collection of panels, launchers, settings, and companion tools with graphical configuration for supported Wayland sessions.',
    note: 'The shell brings together several components. Follow its wiki for the complete dependency list and session setup.',
    url: 'https://github.com/nwg-piotr/nwg-shell', docs: 'https://github.com/nwg-piotr/nwg-shell/wiki',
    osSupport: { ...linuxOnly, linux: 'limited', note: 'Designed for Sway and Hyprland. Package availability and integration differ between distributions.' },
  },
  {
    name: 'GNOME Shell', kind: 'Shell', displayKind: 'Integrated desktop shell', bestFor: 'GNOME’s overview, app launcher, and desktop controls',
    description: 'The core graphical interface of GNOME, providing the Activities overview, application launching, notifications, and desktop controls.',
    note: 'Use it as part of a supported GNOME session. It is not an interchangeable shell for Hyprland or Niri; extensions must match its release.',
    url: 'https://github.com/GNOME/gnome-shell', docs: 'https://help.gnome.org/',
    osSupport: { ...linuxOnly, linux: 'limited', note: 'Requires the matching GNOME and Mutter desktop components from your distribution.' },
  },
  {
    name: 'Plasma Shell', kind: 'Shell', displayKind: 'Integrated desktop shell', bestFor: 'KDE Plasma’s panels, widgets, and desktop',
    description: 'The plasmashell component supplies KDE Plasma’s desktop surface, panels, application launchers, and widgets.',
    note: 'Install the supported Plasma desktop session for an integrated setup. Desktop widgets and extensions need compatible Plasma versions.',
    url: 'https://github.com/KDE/plasma-workspace', docs: 'https://userbase.kde.org/Plasma',
    osSupport: { ...linuxOnly, linux: 'limited', note: 'Part of KDE Plasma, with dependencies on its matching workspace and desktop packages.' },
  },
  {
    name: 'Quickshell', kind: 'Shell', displayKind: 'Shell toolkit', bestFor: 'Building a desktop interface in QML',
    description: 'A Qt Quick toolkit for creating panels, overlays, launchers, and desktop shells on supported Wayland and X11 sessions.',
    note: 'Quickshell is a toolkit rather than a ready-made shell. Choose a compatible shell built with it or write your own configuration.',
    url: 'https://github.com/quickshell-mirror/quickshell', docs: 'https://quickshell.org/',
    osSupport: { ...linuxOnly, linux: 'limited', note: 'Supports Linux X11 and compatible Wayland setups. Individual shells and features can require a particular compositor.' },
  },
  {
    name: 'AGS', kind: 'Shell', displayKind: 'Shell development tool', bestFor: 'Creating an Astal-based graphical shell',
    description: 'Aylur’s command-line scaffolding tool for building desktop interfaces with Astal and Gnim.',
    note: 'This is a development tool rather than a complete desktop shell. Follow the current documentation; older AGS configurations target different APIs.',
    url: 'https://github.com/Aylur/ags', docs: 'https://aylur.github.io/ags/',
    osSupport: { ...linuxOnly, linux: 'limited', note: 'Requires the documented Astal, GJS, and graphics-stack dependencies. Shell compatibility depends on the configuration you use.' },
  },
  {
    name: 'Eww', kind: 'Shell', displayKind: 'Widget toolkit', bestFor: 'Building custom desktop bars and widgets',
    description: 'ElKowar’s Wacky Widgets is a configurable widget system used to build custom panels, dashboards, and desktop controls.',
    note: 'Eww does not provide a complete desktop shell by itself. Follow the backend-specific setup and review any third-party widget configuration.',
    url: 'https://github.com/elkowar/eww', docs: 'https://elkowar.github.io/eww/',
    osSupport: { ...linuxOnly, linux: 'limited', note: 'Uses X11 or a compatible Wayland backend. Widget behavior and compositor integration depend on your configuration.' },
  },
  {
    name: 'Fabric', kind: 'Shell', displayKind: 'Widget toolkit', bestFor: 'Building desktop widgets in Python',
    description: 'A Python framework for creating bars, widgets, and graphical desktop interfaces with GTK-based components.',
    note: 'A toolkit for developers and configuration authors. It does not install a ready-made shell unless you choose a separate Fabric-based project.',
    url: 'https://github.com/Fabric-Development/fabric', docs: 'https://wiki.ffpy.org/',
    osSupport: { ...linuxOnly, linux: 'limited', note: 'Supports X11 and Wayland setups with the required dependencies. Widgets can depend on compositor-specific integrations.' },
  },
  {
    name: 'Ignis', kind: 'Shell', displayKind: 'Widget toolkit', bestFor: 'Creating a Wayland interface in Python',
    description: 'A widget framework for building configurable graphical desktop shells and controls with Python.',
    note: 'Check the current stable documentation and breaking-change notes before choosing a configuration or development branch.',
    url: 'https://github.com/ignis-sh/ignis', docs: 'https://ignis-sh.github.io/ignis/',
    osSupport: { ...linuxOnly, linux: 'limited', note: 'Requires a Wayland compositor implementing layer-shell, such as Sway or KDE Plasma. GNOME Wayland and X11 are not supported by the documented Python edition.' },
  },
  {
    name: 'Waybar', kind: 'Shell', displayKind: 'Wayland panel', bestFor: 'A configurable status bar for a Wayland desktop',
    description: 'A modular panel with workspaces, system indicators, media controls, and styling for supported Wayland compositor setups.',
    note: 'Waybar is a panel, not a complete shell. Workspace modules and other integrations differ by compositor and version.',
    url: 'https://github.com/Alexays/Waybar', docs: 'https://github.com/Alexays/Waybar/wiki',
    osSupport: { ...linuxOnly, linux: 'limited', note: 'Requires a compatible Wayland session. Check the module support table for your compositor; it is not an X11 panel.' },
  },
  {
    name: 'Polybar', kind: 'Shell', displayKind: 'X11 panel', bestFor: 'A status bar for an X11 window manager',
    description: 'A configurable desktop bar with system modules, custom scripts, and workspace integrations for window managers such as i3 and bspwm.',
    note: 'Polybar is a panel rather than a complete shell. Its native target is X11; choose a Wayland-compatible panel for a Wayland session.',
    url: 'https://github.com/polybar/polybar', docs: 'https://polybar.readthedocs.io/',
    osSupport: { ...linuxOnly, linux: 'limited', note: 'Requires X11. Window-manager modules and hardware integrations need the appropriate runtime dependencies.' },
  },
  {
    name: 'HyDE', kind: 'Shell', displayKind: 'Hyprland desktop setup', bestFor: 'A themed Hyprland configuration for Arch',
    description: 'A coordinated collection of Hyprland dotfiles, desktop tools, themes, and configuration for an integrated custom desktop.',
    note: 'This is a broader desktop setup. Its installer can change themes, login-manager and boot settings; review the installation guide and preserve your existing setup.',
    url: 'https://github.com/HyDE-Project/HyDE', docs: 'https://hydeproject.pages.dev/en/getting-started/installation',
    osSupport: { ...linuxOnly, linux: 'limited', note: 'The main installer targets a minimal Arch Linux setup. Some Arch derivatives may work; NixOS uses the separate Hydenix project.' },
  },
  {
    name: 'ML4W OS Dotfiles', kind: 'Shell', displayKind: 'Hyprland desktop setup', bestFor: 'A configurable Hyprland desktop with project tools',
    description: 'ML4W’s Hyprland dotfiles and desktop tools, with adaptive themes and configuration options for a coordinated desktop interface.',
    note: 'The project also offers an OS image. The dotfiles are a broader desktop setup, so follow the installation route for your existing distribution.',
    url: 'https://github.com/mylinuxforwork/dotfiles', docs: 'https://ml4w.com/os/',
    osSupport: { ...linuxOnly, linux: 'limited', note: 'The current guide lists Arch-based distributions, Fedora, Ubuntu, and openSUSE Tumbleweed. Other distributions need separate verification.' },
  },
];
