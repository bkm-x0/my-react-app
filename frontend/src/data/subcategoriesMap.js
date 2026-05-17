import {
  Monitor, Laptop, Gamepad2, Cpu, Layers, HardDrive,
  Tv, Keyboard, Mouse, Headphones, Wifi,
  Router, Cable, Server, Radio, Plug, Usb,
  Mic, Volume2, Speaker
} from 'lucide-react';

const subcategoriesMap = {
  desktops: [
    { name: 'Gaming Desktops', slug: 'gaming-desktops', icon: Gamepad2 },
    { name: 'Workstations', slug: 'workstations', icon: Monitor },
    { name: 'Office PCs', slug: 'office-pcs', icon: Monitor },
    { name: 'Mini PCs', slug: 'mini-pcs', icon: Cpu },
    { name: 'All-in-One', slug: 'all-in-one', icon: Tv },
  ],
  laptops: [
    { name: 'Gaming Laptops', slug: 'gaming-laptops', icon: Gamepad2 },
    { name: 'Business Laptops', slug: 'business-laptops', icon: Laptop },
    { name: 'Ultrabooks', slug: 'ultrabooks', icon: Laptop },
    { name: 'Chromebooks', slug: 'chromebooks', icon: Laptop },
    { name: '2-in-1 Laptops', slug: '2-in-1-laptops', icon: Laptop },
  ],
  'gaming-systems': [
    { name: 'Custom Gaming PCs', slug: 'custom-gaming-pcs', icon: Cpu },
    { name: 'Pre-Built Gaming', slug: 'pre-built-gaming', icon: Monitor },
    { name: 'Streaming Rigs', slug: 'streaming-rigs', icon: Radio },
    { name: 'VR-Ready PCs', slug: 'vr-ready-pcs', icon: Layers },
  ],
  processors: [
    { name: 'Intel Core i9', slug: 'intel-i9', icon: Cpu },
    { name: 'Intel Core i7', slug: 'intel-i7', icon: Cpu },
    { name: 'Intel Core i5', slug: 'intel-i5', icon: Cpu },
    { name: 'AMD Ryzen 9', slug: 'amd-ryzen-9', icon: Cpu },
    { name: 'AMD Ryzen 7', slug: 'amd-ryzen-7', icon: Cpu },
    { name: 'AMD Ryzen 5', slug: 'amd-ryzen-5', icon: Cpu },
  ],
  'graphics-cards': [
    { name: 'NVIDIA RTX 40 Series', slug: 'rtx-40', icon: Layers },
    { name: 'NVIDIA RTX 30 Series', slug: 'rtx-30', icon: Layers },
    { name: 'AMD Radeon RX 7000', slug: 'rx-7000', icon: Layers },
    { name: 'AMD Radeon RX 6000', slug: 'rx-6000', icon: Layers },
    { name: 'Professional GPUs', slug: 'professional-gpus', icon: Monitor },
  ],
  'memory-ram': [
    { name: 'DDR5 RAM', slug: 'ddr5', icon: HardDrive },
    { name: 'DDR4 RAM', slug: 'ddr4', icon: HardDrive },
    { name: 'Laptop RAM (SO-DIMM)', slug: 'laptop-ram', icon: Laptop },
    { name: 'ECC Memory', slug: 'ecc-memory', icon: Server },
  ],
  storage: [
    { name: 'NVMe SSD', slug: 'nvme-ssd', icon: HardDrive },
    { name: 'SATA SSD', slug: 'sata-ssd', icon: HardDrive },
    { name: 'HDD', slug: 'hdd', icon: HardDrive },
    { name: 'External Storage', slug: 'external-storage', icon: Usb },
    { name: 'NAS Drives', slug: 'nas-drives', icon: Server },
  ],
  monitors: [
    { name: 'Gaming Monitors', slug: 'gaming-monitors', icon: Tv },
    { name: '4K Monitors', slug: '4k-monitors', icon: Tv },
    { name: 'Ultrawide', slug: 'ultrawide', icon: Monitor },
    { name: 'Office Monitors', slug: 'office-monitors', icon: Monitor },
    { name: 'Monitor Stands', slug: 'monitor-stands', icon: Monitor },
  ],
  keyboards: [
    { name: 'Mechanical', slug: 'mechanical-keyboards', icon: Keyboard },
    { name: 'Wireless', slug: 'wireless-keyboards', icon: Wifi },
    { name: 'Gaming', slug: 'gaming-keyboards', icon: Gamepad2 },
    { name: 'Ergonomic', slug: 'ergonomic-keyboards', icon: Keyboard },
    { name: 'Keycaps & Accessories', slug: 'keycaps', icon: Keyboard },
  ],
  mice: [
    { name: 'Gaming Mice', slug: 'gaming-mice', icon: Mouse },
    { name: 'Wireless Mice', slug: 'wireless-mice', icon: Wifi },
    { name: 'Ergonomic Mice', slug: 'ergonomic-mice', icon: Mouse },
    { name: 'Mouse Pads', slug: 'mouse-pads', icon: Layers },
  ],
  audio: [
    { name: 'Gaming Headsets', slug: 'gaming-headsets', icon: Headphones },
    { name: 'Speakers', slug: 'speakers', icon: Speaker },
    { name: 'Microphones', slug: 'microphones', icon: Mic },
    { name: 'Sound Cards', slug: 'sound-cards', icon: Volume2 },
    { name: 'Earbuds', slug: 'earbuds', icon: Headphones },
  ],
  networking: [
    { name: 'Routers', slug: 'routers', icon: Router },
    { name: 'Switches', slug: 'switches', icon: Server },
    { name: 'Network Adapters', slug: 'network-adapters', icon: Plug },
    { name: 'Access Points', slug: 'access-points', icon: Wifi },
    { name: 'Network Cables', slug: 'network-cables', icon: Cable },
    { name: 'Modems', slug: 'modems', icon: Radio },
  ],
};

export default subcategoriesMap;