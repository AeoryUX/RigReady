import type { ReactNode } from 'react';
import { ChevronDown, Download, ExternalLink } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { OsSupport } from '@/components/os-support';
import { linuxInstallations, type LinuxInstallMethod } from '@/data/software-installation';

const formats = [{ value: 'deb', label: 'DEB' }, { value: 'rpm', label: 'RPM' }, { value: 'arch', label: 'pacman / AUR' }] as const;

function GuideLink({ href, children }: { href: string; children: ReactNode }) {
  return <a className="os-link" href={href} target="_blank" rel="noopener noreferrer">{children}<ExternalLink size={12} aria-hidden="true" /></a>;
}

function LinuxMethod({ method, label, officialUrl }: { method?: LinuxInstallMethod; label: string; officialUrl: string }) {
  if (!method) return <div className="install-method"><span className="install-source">Not listed</span><p>No {label} installation is listed in this guide. Check the developer’s downloads for other Linux formats or current package instructions.</p><GuideLink href={officialUrl}>Official Linux downloads</GuideLink></div>;
  const community = method.source === 'AUR community package' || method.source === 'Community repository';
  return <div className="install-method">
    <span className={`install-source${community ? ' install-source-community' : ''}`}>{method.source}</span>
    <h4>{method.title}</h4>
    {method.packageName && <p>Package: <code>{method.packageName}</code></p>}
    <ol>{method.steps.map((step) => <li key={step}>{step}</li>)}</ol>
    {method.command && <pre className="install-command"><code>{method.command}</code></pre>}
    <GuideLink href={method.url}>Open installation guide</GuideLink>
    {method.source === 'AUR community package' && <p><GuideLink href="https://wiki.archlinux.org/title/Arch_User_Repository">How to use the AUR</GuideLink></p>}
  </div>;
}

export function AppInstallationGuide({ name, support, officialUrl }: { name: string; support: OsSupport; officialUrl: string }) {
  const methods = linuxInstallations[name] ?? {};
  const defaultSystem = support.windows !== 'unavailable' ? 'windows' : support.linux !== 'unavailable' ? 'linux' : 'macos';
  const defaultFormat = formats.find((format) => methods[format.value])?.value ?? 'deb';
  return <details className="app-installation" aria-label={`Installation for ${name}`}>
    <summary><Download size={14} aria-hidden="true" /><span>Installation</span><ChevronDown size={14} className="installation-chevron" aria-hidden="true" /></summary>
    <div className="app-installation-body">
      <Tabs defaultValue={defaultSystem}>
        <TabsList className="app-installation-tabs" aria-label={`Installation operating system for ${name}`}>
          <TabsTrigger value="windows">Windows</TabsTrigger><TabsTrigger value="linux">Linux</TabsTrigger><TabsTrigger value="macos">macOS</TabsTrigger>
        </TabsList>
        <TabsContent value="windows">
          {support.windows === 'unavailable' ? <p className="install-unavailable">No native Windows version is listed for {name}. See the developer’s site for supported platforms.</p> : <div className="install-method"><h4>Windows installer or portable build</h4><ol><li>Open the official downloads and choose Windows.</li><li>Check the supported Windows version and CPU architecture.</li><li>Run the developer’s installer, or extract its portable build and follow the included instructions.</li></ol><GuideLink href={officialUrl}>Open official downloads</GuideLink></div>}
        </TabsContent>
        <TabsContent value="macos">
          {support.macos === 'unavailable' ? <p className="install-unavailable">No native macOS version is listed for {name}. See the developer’s site for supported platforms.</p> : name === '7-Zip' ? <div className="install-method"><h4>macOS command-line build</h4><ol><li>Open 7-Zip’s official downloads and choose the macOS console archive.</li><li>Extract it and read the included instructions.</li><li>Use its console tool from Terminal. The official Windows graphical interface is not included in the macOS build.</li></ol><GuideLink href="https://www.7-zip.org/download.html">7-Zip downloads</GuideLink></div> : <div className="install-method"><h4>macOS download</h4><ol><li>Choose the official macOS build for your macOS version and Intel or Apple silicon Mac.</li><li>Open the DMG or PKG supplied by the developer, or extract its app archive.</li><li>Follow the installer or the developer’s instructions for moving the app to Applications.</li></ol><GuideLink href={officialUrl}>Open official downloads</GuideLink></div>}
        </TabsContent>
        <TabsContent value="linux">
          {support.linux === 'unavailable' ? <div className="install-unavailable"><p>No native Linux version is listed for {name}.</p><ul>{formats.map((format) => <li key={format.value}>{format.label}: unavailable for the native app.</li>)}</ul><GuideLink href={officialUrl}>Developer information</GuideLink></div> : <>
            <p className="install-family-note">Choose your package family. Repository instructions depend on your distribution and release.</p>
            <Tabs defaultValue={defaultFormat}>
              <TabsList className="app-installation-tabs install-format-tabs" aria-label={`Linux installation method for ${name}`}>
                {formats.map((format) => <TabsTrigger value={format.value} key={format.value}>{format.label}</TabsTrigger>)}
              </TabsList>
              {formats.map((format) => <TabsContent value={format.value} key={format.value}><LinuxMethod method={methods[format.value]} label={format.label} officialUrl={officialUrl} /></TabsContent>)}
            </Tabs>
          </>}
        </TabsContent>
      </Tabs>
    </div>
  </details>;
}
