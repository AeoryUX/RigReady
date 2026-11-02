import { ChevronDown, Cpu, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const specGuides = {
  windows: [
    { title: 'Processor and memory', text: 'Press Ctrl + Shift + Esc to open Task Manager, then choose Performance. CPU shows the processor model; Memory shows installed RAM and usually its speed. DDR generation is not always reported.' },
    { title: 'Graphics card', text: 'In Task Manager → Performance, select each GPU. Copy the model used for gaming. A PC may show both integrated and dedicated graphics. You can also run dxdiag from Win + R and check its Display tabs.' },
    { title: 'Motherboard and PC model', text: 'Press Win + R, enter msinfo32, and open System Summary. Look for BaseBoard Manufacturer, BaseBoard Product, System Manufacturer, and System Model. Prebuilt PCs may show generic values.' },
    { title: 'Storage', text: 'Task Manager → Performance → Disk can show the drive model and SSD/HDD type. File Explorer → This PC shows capacity. Use the model’s official specifications to confirm whether an SSD uses SATA or NVMe.' },
  ],
  linux: [
    { title: 'Start with system information', text: 'Open Settings → About, KDE’s Info Center, or your desktop’s System Information app. Copy the processor, installed memory, graphics, and device model where available. Names vary by distribution and desktop.' },
    { title: 'Processor and RAM', text: 'The lscpu command reports CPU details. free -h shows usable system memory, which may be lower than the installed module capacity. Use system information or hardware documentation for the exact installed amount and DDR type; leave unknown details blank.' },
    { title: 'Graphics and storage', text: 'Use lspci to find VGA, 3D, or display controllers. lsblk can list drive models, sizes, and transport. Virtual devices may also appear, so identify the actual physical drive before copying details.' },
    { title: 'Motherboard and PC model', text: 'Your system-information app or PC maker’s documentation may show the model. On PCs that expose DMI information, board_vendor and board_name under /sys/class/dmi/id/ can identify the motherboard. These files may be absent on some devices.' },
  ],
  macos: [
    { title: 'Chip, memory, and model', text: 'Open Apple menu → About This Mac, or System Settings → General → About. Copy the Mac model, chip or processor, and memory. On Apple silicon, unified memory is shared by the CPU and GPU; enter the reported total once.' },
    { title: 'Graphics', text: 'Open System Information and choose Graphics/Displays. Copy the GPU or chip information shown. On Apple silicon, the GPU is part of the chip rather than a separate desktop graphics card.' },
    { title: 'Storage', text: 'System Settings → General → Storage shows capacity and usage. System Information may provide more detail under Storage, NVMExpress, or SATA, depending on the Mac model.' },
    { title: 'Check upgrade options by model', text: 'Use the exact Mac model with Apple’s hardware documentation. CPU, GPU, and memory upgrades are limited on many Macs, especially Apple silicon models; desktop PC replacement parts are not a general upgrade path.' },
  ],
};

const linuxCommands = [
  { label: 'Processor', command: 'lscpu' },
  { label: 'Usable system memory', command: 'free -h' },
  { label: 'Graphics and other PCI devices', command: 'lspci' },
  { label: 'Drive models and capacities', command: 'lsblk -d -o NAME,MODEL,SIZE,TRAN' },
  { label: 'Motherboard, when available', command: 'cat /sys/class/dmi/id/board_vendor /sys/class/dmi/id/board_name' },
];

export function PcSpecsGuide() {
  return (
    <details className="specs-guide" id="find-specs">
      <summary><span><Cpu size={18} aria-hidden="true" />Find your PC specs</span><ChevronDown className="specs-toggle-icon" size={17} aria-hidden="true" /></summary>
      <div className="specs-guide-content">
        <h2>Find the details for your build.</h2>
        <p className="guide-intro">Choose your system, then copy model names and capacities into the advisor. Leave unknown fields blank and keep serial numbers private.</p>
        <Tabs defaultValue="windows">
          <TabsList className="specs-tabs" aria-label="Your operating system">
            <TabsTrigger value="windows">Windows</TabsTrigger>
            <TabsTrigger value="linux">Linux</TabsTrigger>
            <TabsTrigger value="macos">macOS</TabsTrigger>
          </TabsList>
          {(['windows', 'linux', 'macos'] as const).map((system) => (
            <TabsContent value={system} key={system}>
              <div className="specs-grid">
                {specGuides[system].map((item) => (
                  <article className="specs-card" key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>
                ))}
              </div>
              {system === 'linux' && (
                <details className="os-checksums">
                  <summary>Show read-only Linux commands</summary>
                  <p>These commands inspect your local system. If a utility or file is unavailable, use the graphical system-information app or leave that detail blank.</p>
                  {linuxCommands.map((item) => <div className="os-command" key={item.label}><strong>{item.label}</strong><pre><code>{item.command}</code></pre></div>)}
                </details>
              )}
            </TabsContent>
          ))}
        </Tabs>
        <div className="os-callout"><Info size={17} aria-hidden="true" /><p><strong>Power supply, case, and exact RAM type:</strong> check purchase records, model documentation, or product labels. Software usually cannot identify the PSU’s wattage or your case reliably. Never open a power supply to identify it. For a laptop or prebuilt PC, include its full model name.</p></div>
      </div>
    </details>
  );
}
