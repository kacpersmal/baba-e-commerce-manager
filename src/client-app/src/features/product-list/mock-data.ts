export type ProductListItem = {
    imgsrc:string;
    name:string;
    rewievs:number;
    rating:number;
    description:string;
    price:number;
    discount?:number;
}
export const products: ProductListItem[] = [
  {
    imgsrc:
      "./Placeholder_view_vector.svg.png",
    name: "Wireless Noise-Cancelling Headphones Pro X",
    rewievs: 1245,
    rating: 4.7,
    description:
      "Advanced wireless headphones featuring hybrid active noise cancellation (ANC). The Pro X delivers up to 30 hours of listening time, fast charging, and Hi-Res certified sound quality. Soft memory-foam ear cushions and an adjustable headband ensure comfort during long sessions. Includes transparency mode and sound customization via a dedicated mobile app.",
    price: 599,
    discount: 15,
  },
  {
    imgsrc:
      "./Placeholder_view_vector.svg.png",
    name: "Mechanical Keyboard RGB HyperSwitch",
    rewievs: 842,
    rating: 4.5,
    description:
      "A compact mechanical keyboard equipped with hot-swappable switches, full RGB lighting with 16 million colors, and a durable aluminum frame. Designed for gamers and creators seeking low input latency, programmable macros, and full per-key customization. Includes a detachable wrist rest and customizable keycaps.",
    price: 349,
  },
  {
    imgsrc:
      "./Placeholder_view_vector.svg.png",
    name: "Smartwatch Pro S Titanium Edition",
    rewievs: 1920,
    rating: 4.8,
    description:
      "A premium smartwatch with a titanium case and a vibrant AMOLED display. Features advanced health tracking such as ECG, blood oxygen monitoring (SpO2), sleep analytics, and a high-precision GPS module. Ideal for athletes with dedicated modes for running, swimming, and triathlon. Offers long battery life and a refined, modern design.",
    price: 899,
    discount: 10,
  },
  {
    imgsrc:
      "./Placeholder_view_vector.svg.png",
    name: "Ergonomic Wireless Mouse OptiCurve",
    rewievs: 503,
    rating: 4.6,
    description:
      "An ergonomic wireless mouse designed for comfortable long-hour work. Features a natural hand-shaped design, adjustable DPI up to 4200, a silent scroll wheel, and dual connectivity via Bluetooth and 2.4 GHz. Supports quick switching between two devices and offers long battery endurance.",
    price: 159,
  },
  {
    imgsrc:
      "./Placeholder_view_vector.svg.png",
    name: "Portable Bluetooth Speaker UltraBass Mini",
    rewievs: 331,
    rating: 4.3,
    description:
      "A compact Bluetooth speaker that delivers deep bass and clear stereo sound despite its small form factor. Features IPX7 waterproofing, stereo pairing with a second unit, and up to 18 hours of playtime. The rugged exterior resists scratches, and Bluetooth 5.x ensures stable wireless connectivity even outdoors.",
    price: 219,
    discount: 20,
  },
  {
    imgsrc:
      "./Placeholder_view_vector.svg.png",
    name: "Powerbank 20 000 mAh FastCharge Duo",
    rewievs: 764,
    rating: 4.4,
    description:
      "A high-capacity 20,000 mAh powerbank featuring 30W Power Delivery fast-charging and dual USB-C ports. Designed to quickly charge smartphones, tablets, and handheld gaming consoles. Equipped with smart safety systems protecting against overheating, overcharging, and short circuits. Sleek metal exterior and LED power indicators included.",
    price: 129,
  },
  {
  imgsrc: "./Placeholder_view_vector.svg.png",
  name: "4K Ultra HD Action Camera Explorer X",
  rewievs: 684,
  rating: 4.4,
  description:
    "A rugged 4K action camera designed for extreme sports enthusiasts. Features waterproof housing up to 30 meters, electronic image stabilization, wide-angle lens, and long-lasting battery life. Supports slow motion, time-lapse modes, and remote Bluetooth control via mobile app.",
  price: 449,
  discount: 10,
},
{
  imgsrc: "./Placeholder_view_vector.svg.png",
  name: "True Wireless Earbuds AirPro Max",
  rewievs: 1420,
  rating: 4.7,
  description:
    "Premium true wireless earbuds featuring adaptive noise cancellation, dual microphones for crystal-clear calls, and a rich sound profile with deep bass. The charging case provides up to 28 hours of listening, and the earbuds are IPX5 water-resistant for active use.",
  price: 299,
},
{
  imgsrc: "./Placeholder_view_vector.svg.png",
  name: "Gaming Monitor 27'' 165Hz CrystalView",
  rewievs: 953,
  rating: 4.6,
  description:
    "A 27-inch gaming monitor with 165Hz refresh rate, 1ms response time, and vibrant IPS panel. Supports FreeSync and G-Sync compatibility for smooth gameplay. Features ultra-thin bezels, HDR10 support, and customizable RGB lighting on the back panel.",
  price: 1299,
  discount: 12,
},
{
  imgsrc: "./Placeholder_view_vector.svg.png",
  name: "Smart Home Hub Control Station 2",
  rewievs: 420,
  rating: 4.3,
  description:
    "A central smart home automation hub supporting Wi-Fi, ZigBee, and Bluetooth devices. Offers advanced routines, voice assistant compatibility, remote monitoring, and easy integration with security cameras, lights, thermostats, and sensors.",
  price: 349,
},
{
  imgsrc: "./Placeholder_view_vector.svg.png",
  name: "Bluetooth Soundbar SurroundX 2.1",
  rewievs: 1120,
  rating: 4.5,
  description:
    "A powerful 2.1-channel soundbar with wireless subwoofer delivering deep bass and immersive surround sound. Features Bluetooth 5.1, HDMI ARC support, multiple EQ modes, and an elegant slim design ideal for modern living rooms.",
  price: 699,
  discount: 18,
},
{
  imgsrc: "./Placeholder_view_vector.svg.png",
  name: "Portable SSD 1TB SpeedForce Nano",
  rewievs: 870,
  rating: 4.8,
  description:
    "A high-performance portable SSD offering blazing-fast NVMe speeds up to 1050MB/s in a compact aluminum enclosure. Shock-resistant and heat-efficient, ideal for creators transferring large video or photo files on the go.",
  price: 499,
},
{
  imgsrc: "./Placeholder_view_vector.svg.png",
  name: "Wireless Charging Pad 20W RapidCharge",
  rewievs: 390,
  rating: 4.2,
  description:
    "A sleek 20W wireless charging pad supporting fast-charging for all Qi-enabled smartphones and earbuds. Features temperature control, foreign object detection, non-slip surface, and LED charging indicators.",
  price: 129,
},
{
  imgsrc: "./Placeholder_view_vector.svg.png",
  name: "Smart LED Light Bulb ColorSync A19",
  rewievs: 1540,
  rating: 4.6,
  description:
    "An energy-efficient smart LED bulb supporting full RGB spectrum, voice assistant control, and customizable automations. Offers adjustable brightness, scheduling, and grouping options for seamless home lighting control.",
  price: 69,
},
{
  imgsrc: "./Placeholder_view_vector.svg.png",
  name: "Wi-Fi 6 Router UltraRange AX3200",
  rewievs: 640,
  rating: 4.5,
  description:
    "A high-performance Wi-Fi 6 router providing ultra-fast speeds, optimized streaming performance, and low-latency gaming. Features MU-MIMO, OFDMA, and advanced security settings for stable and secure home coverage.",
  price: 699,
},
{
  imgsrc: "./Placeholder_view_vector.svg.png",
  name: "Smart Security Camera 2K VisionGuard",
  rewievs: 1210,
  rating: 4.4,
  description:
    "A 2K indoor/outdoor security camera with night vision, motion tracking, cloud storage support, and two-way audio. Weather-resistant design and advanced AI detection for people, pets, and vehicles.",
  price: 399,
},
{
  imgsrc: "./Placeholder_view_vector.svg.png",
  name: "USB-C Docking Station 9-in-1 ProConnect",
  rewievs: 530,
  rating: 4.6,
  description:
    "A versatile 9-in-1 USB-C docking station featuring HDMI 4K output, Ethernet, card readers, multiple USB ports, and fast PD charging. Ideal for laptops and tablets, expanding connectivity instantly.",
  price: 289,
},
{
  imgsrc: "./Placeholder_view_vector.svg.png",
  name: "Noise-Reducing Studio Microphone StreamCast",
  rewievs: 810,
  rating: 4.7,
  description:
    "A high-quality studio USB microphone offering exceptional clarity for podcasts, streaming, and vocal recording. Features a cardioid pickup pattern, gain control, mute button, and built-in noise reduction.",
  price: 349,
},
{
  imgsrc: "./Placeholder_view_vector.svg.png",
  name: "VR Headset RealityOne Gen 2",
  rewievs: 560,
  rating: 4.5,
  description:
    "A next-generation VR headset with 4K per-eye resolution, wide field of view, inside-out tracking, and lightweight ergonomic design. Supports PC VR, standalone mode, and advanced hand-tracking technology.",
  price: 1999,
  discount: 8,
},
{
  imgsrc: "./Placeholder_view_vector.svg.png",
  name: "Smart Thermostat EcoHeat Sense",
  rewievs: 715,
  rating: 4.4,
  description:
    "A smart thermostat designed to optimize home heating with adaptive routines, mobile control, and energy consumption analytics. Integrates with all major smart assistants and supports remote temperature automation.",
  price: 549,
},
{
  imgsrc: "./Placeholder_view_vector.svg.png",
  name: "Drone 4K AeroScout Mini",
  rewievs: 980,
  rating: 4.5,
  description:
    "A compact 4K drone offering intelligent flight modes, obstacle detection, GPS stabilization, and foldable design. Ideal for travel photography and smooth cinematic video capturing.",
  price: 1499,
  discount: 12,
},
{
  imgsrc: "./Placeholder_view_vector.svg.png",
  name: "Mechanical Gaming Mousepad RGB Edge",
  rewievs: 240,
  rating: 4.3,
  description:
    "A premium gaming mousepad with anti-slip rubber base, micro-textured surface, and RGB lighting around the edges. Supports multiple lighting presets and USB-powered operation.",
  price: 119,
},
{
  imgsrc: "./Placeholder_view_vector.svg.png",
  name: "Electric Toothbrush SonicClean X Pro",
  rewievs: 1330,
  rating: 4.6,
  description:
    "A smart sonic electric toothbrush with pressure sensors, multiple brushing modes, wireless charging, and app-based guidance for healthier oral care routines.",
  price: 299,
},
{
  imgsrc: "./Placeholder_view_vector.svg.png",
  name: "Bluetooth Headset OfficeCall 500",
  rewievs: 420,
  rating: 4.2,
  description:
    "A lightweight office headset with dual microphones, clear voice isolation, and comfortable padding for long online meetings. Features Bluetooth multipoint connectivity and 20 hours talk time.",
  price: 219,
},
{
  imgsrc: "./Placeholder_view_vector.svg.png",
  name: "Smart Scale BodyMetrics Pro",
  rewievs: 690,
  rating: 4.4,
  description:
    "A Wi-Fi and Bluetooth smart scale analyzing weight, BMI, muscle mass, hydration, and bone density with high precision. Syncs seamlessly with mobile health apps and tracks long-term body trends.",
  price: 159,
},
{
  imgsrc: "./Placeholder_view_vector.svg.png",
  name: "1080p Webcam UltraView Conference",
  rewievs: 320,
  rating: 4.3,
  description:
    "A professional 1080p webcam featuring wide-angle optics, built-in dual microphones, low-light correction, and plug-and-play USB compatibility. Ideal for meetings, streaming, and online classes.",
  price: 249,
},

];
