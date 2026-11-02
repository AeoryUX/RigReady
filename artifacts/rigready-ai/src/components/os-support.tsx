import { Check, Minus } from 'lucide-react';

type SupportLevel = 'supported' | 'limited' | 'unavailable';
export type OsSupport = {
  windows: SupportLevel;
  linux: SupportLevel;
  macos: SupportLevel;
  note?: string;
};

export const allDesktopOs: OsSupport = { windows: 'supported', linux: 'supported', macos: 'supported' };
export const windowsOnly: OsSupport = { windows: 'supported', linux: 'unavailable', macos: 'unavailable' };
export const windowsAndMac: OsSupport = { windows: 'supported', linux: 'unavailable', macos: 'supported' };
export const linuxOnly: OsSupport = { windows: 'unavailable', linux: 'supported', macos: 'unavailable' };

const operatingSystems = [
  { key: 'windows', name: 'Windows' },
  { key: 'linux', name: 'Linux' },
  { key: 'macos', name: 'macOS' },
] as const;

const supportLabels: Record<SupportLevel, string> = {
  supported: 'Supported',
  limited: 'Limited support',
  unavailable: 'No native app',
};

function SupportMark({ level }: { level: SupportLevel }) {
  if (level === 'limited') return <span className="os-support-half" aria-hidden="true" />;
  const Icon = level === 'supported' ? Check : Minus;
  return <Icon size={12} aria-hidden="true" />;
}

export function OsSupportBadges({ support }: { support: OsSupport }) {
  return (
    <div className="os-support">
      <ul className="os-support-list" aria-label="Operating system support">
        {operatingSystems.map(({ key, name }) => (
          <li className={`os-support-badge os-support-${support[key]}`} key={key} title={`${name}: ${supportLabels[support[key]]}`}>
            <SupportMark level={support[key]} /><span>{name}</span><span className="sr-only">: {supportLabels[support[key]]}</span>
          </li>
        ))}
      </ul>
      {support.note && <p className="os-support-note">{support.note}</p>}
    </div>
  );
}

export function OsSupportLegend() {
  return (
    <div className="os-support-legend" aria-label="Operating system support key">
      <span><SupportMark level="supported" />Supported</span>
      <span><SupportMark level="limited" />Selected Linux distros or setups</span>
      <span><SupportMark level="unavailable" />No native app</span>
      <p>Badges describe native desktop support. Check the official requirements for OS versions and Linux packages.</p>
    </div>
  );
}
