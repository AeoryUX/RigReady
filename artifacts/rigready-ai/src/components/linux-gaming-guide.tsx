import { ExternalLink, Gamepad2 } from 'lucide-react';

export function ProtonDbButton() {
  return <a className="guide-primary-link" href="https://www.protondb.com/" target="_blank" rel="noopener noreferrer"><Gamepad2 size={16} aria-hidden="true" />Open ProtonDB<ExternalLink size={14} aria-hidden="true" /></a>;
}

const gamingSteps = [
  {
    title: 'Look up the exact game',
    detail: 'Search ProtonDB for the correct title or release. Read recent desktop Linux reports from people with similar graphics hardware and drivers. Community reports are useful evidence, not a guarantee for your PC.',
  },
  {
    title: 'Check multiplayer and launchers',
    detail: 'Check the publisher’s current Linux or Proton support for the multiplayer modes you use. Anti-cheat systems and third-party launchers can prevent play even when a game reaches its menus.',
  },
  {
    title: 'Start with Steam’s defaults',
    detail: 'Install Steam using your distribution’s recommended method. Use its Compatibility settings for Windows-only games and begin with Steam’s default Proton choice. Change a game’s Properties → Compatibility setting when you have a specific reason, such as a recent matching report.',
  },
  {
    title: 'Test the experience you care about',
    detail: 'Apply supported system and graphics-driver updates, then test audio, controllers, display settings, and multiplayer. Change one setting at a time if troubleshooting. Verify the games you rely on before replacing your current operating system.',
  },
];

export function LinuxGamingGuide() {
  return (
    <section className="os-section" id="linux-gaming" aria-labelledby="linux-gaming-title">
      <div className="os-section-heading">
        <div><h2 id="linux-gaming-title">Will your games work on Linux?</h2><p>Some games offer a native Linux build. Proton lets many Windows Steam games run on Linux, but compatibility depends on the game, drivers, launchers, and anti-cheat support.</p></div>
      </div>
      <div className="gaming-signals">
        <article className="specs-card"><h3>ProtonDB reports</h3><p>ProtonDB collects community experiences. Check report dates, hardware, and any required adjustments alongside the overall rating.</p><a className="os-link" href="https://www.protondb.com/" target="_blank" rel="noopener noreferrer">Browse community reports <ExternalLink size={13} aria-hidden="true" /></a></article>
        <article className="specs-card"><h3>Steam Deck Verified</h3><p>Valve’s Deck labels describe the experience on Steam Deck hardware. A Deck result does not establish compatibility on every desktop Linux PC.</p></article>
        <article className="specs-card"><h3>Native Linux support</h3><p>A native build is supplied for Linux by the developer. Check its requirements, update support, and multiplayer behavior for your setup.</p></article>
      </div>
      <ol className="os-steps gaming-steps">
        {gamingSteps.map((step, index) => <li className="os-step" key={step.title}><span className="side-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h3>{step.title}</h3><p>{step.detail}</p></div></li>)}
      </ol>
      <div className="os-callout"><Gamepad2 size={18} aria-hidden="true" /><p><strong>Games outside Steam:</strong> Heroic Games Launcher and Lutris can help manage supported stores, games, and compatibility tools. Follow their official instructions and check the requirements for each game. Find both in the <a className="os-link" href={`${import.meta.env.BASE_URL}software/`}>Software guide</a>.</p></div>
    </section>
  );
}
