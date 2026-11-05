# Desktop catalog source review

Reviewed on 4 November 2026. The catalog is in
`artifacts/rigready-ai/src/data/desktop-options.ts`.

This expansion uses established projects with identifiable upstream source and
documentation. It includes both Wayland compositors and X11 window managers;
cards explicitly distinguish those from X11 compositors, integrated desktop
components, panels, toolkits, and complete desktop setups. Popularity alone is
not evidence of security. No security audit, installer execution, or testing of
these desktop environments on visitor hardware was performed.

Project identity and scope were checked using the upstream READMEs/source listed
below, GitHub canonical redirects and archived flags where relevant, and Debian
metadata for dwm. Network policy does not allow all project documentation hosts;
documentation links are taken from upstream references, not presented as having
all been HTTP-tested. The previously listed desktop environments and Ryoku entry
remain in the catalog.

## Desktop environment addition

Budgie was added and reviewed on 5 November 2026 using the
[official upstream README](https://github.com/BuddiesOfBudgie/budgie-desktop/blob/main/README.md).
It confirms the project website, Budgie Menu, and Raven features. The card links
the official website and README, with a note to use distribution-supported
packages and check version-specific session and applet compatibility.

The 5 November 2026 catalog expansion also adds Deepin Desktop Environment,
Enlightenment, LXQt, and Pantheon. Their cards link to each project’s official
site and upstream documentation, distinguish an integrated distribution
experience from packages supplied elsewhere, and avoid making performance or
hardware-compatibility guarantees.

## Compositors and window managers

| Entry | Source checked | Scope or important distinction |
| --- | --- | --- |
| Hyprland | Existing official project and wiki links retained | Standalone Wayland compositor. |
| Niri | [Upstream README](https://github.com/niri-wm/niri/blob/main/README.md) | Scrollable tiling; current project owner and documentation confirmed. |
| Mango | [Upstream README](https://github.com/mangowm/mango/blob/main/README.md) | Wayland compositor; README supplies the installation-docs URL. |
| Sway | [Upstream README](https://github.com/swaywm/sway/blob/master/README.md) | i3-compatible Wayland compositor. |
| SwayFX | [Current repository](https://github.com/wlrfx/swayfx) and README | Previous WillPower3309 repository redirects to wlrfx; use its own rendering and configuration guidance. |
| Wayfire | [Upstream README](https://github.com/WayfireWM/wayfire/blob/master/README.md) | Plugin-based Wayland compositor; links its tutorial. |
| labwc | [Upstream README](https://github.com/labwc/labwc/blob/master/README.md) | Openbox-inspired stacking Wayland compositor, independent of a desktop shell. |
| river | [Official mirror README](https://github.com/riverwm/river/blob/main/README.md) | Current river separates compositor and window manager. README links Codeberg wiki and river-classic. |
| dwl | [Migration notice in original upstream](https://github.com/djpohly/dwl) | Original GitHub repository is archived and explicitly points to Codeberg; catalog links the current home. |
| Scroll | [Upstream README](https://github.com/dawsers/scroll/blob/master/README.md) | Sway-derived scrolling layout; links its tutorial and modified dependencies. |
| Qtile | [Upstream README](https://github.com/qtile/qtile/blob/master/README.rst) | Supports both an X11 window-manager backend and a Wayland-compositor backend. |
| i3 | [Upstream README](https://github.com/i3/i3/blob/next/README.md) | X11 window manager; links official website and documentation. |
| awesome | [Upstream README](https://github.com/awesomeWM/awesome/blob/master/docs/01-readme.md) | Lua-configured X11 window manager; root README is a link to this document. |
| bspwm | [Upstream README](https://github.com/baskerville/bspwm/blob/master/README.md) | X11 window manager; bspc control and separate sxhkd keybindings. |
| dwm | [Debian source metadata](https://deb.debian.org/debian/pool/main/d/dwm/dwm_6.8-1.dsc) | Confirms suckless homepage and X11 package/dependencies; use upstream tutorial. |
| XMonad | [Upstream README](https://github.com/xmonad/xmonad/blob/master/README.md) | Haskell-configured X11 tiling window manager. |
| herbstluftwm | [Upstream README](https://github.com/herbstluftwm/herbstluftwm/blob/master/README.asciidoc) | Manual tiling X11 window manager; source links its homepage and tutorial. |
| Openbox | [Upstream repository](https://github.com/danakj/openbox) | Established X11 stacking window manager; use distro-maintained packages, without promising current upstream release activity. |
| Picom | [Upstream README](https://github.com/yshui/picom/blob/next/README.md) | X11 compositor, not a window manager or Wayland session. |
| Compiz | [Project mirror README](https://github.com/compiz-reloaded/compiz/blob/master/README.md) | Compiz Reloaded 0.8 series; repository identifies GitLab compiz-core as upstream. X11 compositing window manager. |
| KWin | [KDE source README](https://github.com/KDE/kwin/blob/master/README.md) | Current source describes a Wayland compositor used with a desktop shell; not a standalone desktop. |
| Mutter | [GNOME source README](https://github.com/GNOME/mutter/blob/main/README.md) | Wayland display server/compositor used by GNOME Shell. |
| COSMIC Compositor | [System76 source](https://github.com/pop-os/cosmic-comp) | cosmic-comp is a component of the COSMIC desktop. |
| Weston | [Source mirror README](https://github.com/wayland-mirror/weston/blob/main/README.md) | README names freedesktop GitLab as upstream and links online documentation. Desktop/kiosk shells and development use. |
| Miracle-WM | [Upstream README](https://github.com/miracle-wm-org/miracle-wm/blob/develop/README.md) | Mir-based Wayland compositor; user wiki distinguished from developer API docs. |
| Fluxbox | [Upstream repository](https://github.com/fluxbox/fluxbox) | Lightweight X11 window manager; separate desktop utilities are still required. |
| FVWM3 | [Upstream README](https://github.com/fvwmorg/fvwm3/blob/main/README.md) | Current FVWM generation for X11; older configuration examples can differ. |
| IceWM | [Upstream README](https://github.com/ice-wm/icewm/blob/master/README.md) | X11 window manager with a traditional taskbar and menu. |
| spectrwm | [Upstream repository](https://github.com/conformal/spectrwm) | Keyboard-driven X11 tiling window manager; its manual is the configuration reference. |

## Shells and related interface projects

| Entry | Source checked | Scope or important distinction |
| --- | --- | --- |
| Caelestia | [Upstream README](https://github.com/caelestia-dots/shell/blob/main/README.md) | Hyprland/Quickshell shell; shell-only versus full dotfiles and Arch/Nix/manual installation distinguished. |
| Noctalia | [Upstream README](https://github.com/noctalia-dev/noctalia/blob/main/README.md) | Native Wayland shell; retains current official installation-docs link. |
| Ryoku | Existing official project and documentation links retained | Broader supported desktop setup; limited Linux support remains explicit. |
| Dux Modular Shell | [Current upstream](https://github.com/duxlabs-dev/dux-shell) and README | AvengeMedia/DankMaterialShell redirects here. Current name and documentation used; historical name included for recognition. |
| illogical-impulse | [Upstream README](https://github.com/end-4/dots-hyprland/blob/main/.github/README.md) | Current supported Quickshell edition; README marks old AGS editions unsupported and documents Hyprland-version requirements. |
| nwg-shell | [Upstream README](https://github.com/nwg-piotr/nwg-shell/blob/main/README.md) | GTK-based shell components for Sway/Hyprland; installation wiki linked upstream. |
| GNOME Shell | [GNOME source README](https://github.com/GNOME/gnome-shell/blob/main/README.md) | Integrated GNOME interface, not a standalone replacement shell for Hyprland/Niri. |
| Plasma Shell | [KDE workspace README](https://github.com/KDE/plasma-workspace/blob/master/README.md) and [shell source](https://github.com/KDE/plasma-workspace/blob/master/shell/main.cpp) | plasmashell belongs to KDE Plasma workspace. |
| Quickshell | [Project mirror README](https://github.com/quickshell-mirror/quickshell/blob/master/README.md) | Qt Quick toolkit for shells, not a ready-made shell. Current project URL also referenced by DMS upstream. |
| AGS | [Upstream README](https://github.com/Aylur/ags/blob/main/README.md) | Current scaffolding CLI for Astal/Gnim projects; not the old standalone AGS API. |
| Eww | [Upstream README](https://github.com/elkowar/eww/blob/master/README.md) | Widget toolkit; README links installation and configuration docs. |
| Fabric | [Upstream README](https://github.com/Fabric-Development/fabric/blob/main/README.md) | Python widget framework for X11/Wayland; documentation URL supplied upstream. |
| Ignis | [Upstream README](https://github.com/ignis-sh/ignis/blob/main/README.md) | Documented Python edition needs Wayland layer-shell; explicitly excludes GNOME Wayland/X11 and notes a rewrite branch. |
| Waybar | [Upstream README](https://github.com/Alexays/Waybar/blob/master/README.md) | Wayland panel with a compositor/module compatibility matrix; not a complete shell. |
| Polybar | [Upstream README](https://github.com/polybar/polybar/blob/master/README.md) | X11 panel, not a native Wayland panel or complete shell. |
| HyDE | [Upstream README](https://github.com/HyDE-Project/HyDE/blob/master/README.md) | Main installer targets minimal Arch; desktop, boot, theme, and login settings may change. NixOS route is a separate project. |
| ML4W OS Dotfiles | [Upstream README](https://github.com/mylinuxforwork/dotfiles/blob/main/README.md) | Current project name includes OS; distinguish dotfiles from its ISO. Supported distro families listed upstream. |
| Dunst | [Upstream README](https://github.com/dunst-project/dunst/blob/master/README.md) | Notification daemon, not a complete shell. |
| Fuzzel | [Official Codeberg project](https://codeberg.org/dnkl/fuzzel) | Wayland application launcher, not a complete shell. |
| Mako | [Upstream README](https://github.com/emersion/mako/blob/master/README.md) | Wayland notification daemon; layer-shell support is required. |
| Rofi | [Upstream README](https://github.com/davatorium/rofi/blob/next/README.md) | Application launcher and switcher; backend support depends on the release/package. |

## Exclusions and limits

- Ax-Shell's [own README](https://github.com/axenide/Ax-Shell/blob/main/README.md)
  says it is deprecated and will receive no further updates. It was not added.
- No third-party dotfiles, plugins, or community install scripts are fetched or
  executed by RigReady. The guide links to the upstream setup instructions.
- Windows and macOS are marked unavailable for these native Linux desktop
  setups. A half-filled Linux badge identifies compositor-specific or integrated
  desktop requirements; it is not a security rating.
