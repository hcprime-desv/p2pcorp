// Ícone por NOME (o admSite grava o nome; lista em regrasSite.ICONES_SITE).
// Nome desconhecido = ícone neutro.
import {
  Award, BarChart3, Bot, Briefcase, Building2, Bus, Car, CheckCircle2, ClipboardCheck, Clock, Cloud, Factory, FileText, Globe,
  GraduationCap, Handshake, HeartPulse, Headset, Hospital, Landmark, Layers, Leaf, Lock, Mail, Map, MapPin, MessageCircle, Monitor,
  Palette, Phone, PieChart, Recycle, Rocket, Scale, School, Search, Server, Settings, Shield, Ship, Siren, Smartphone, Sparkles,
  Truck, User, Users, WifiOff, Zap, type LucideIcon,
} from "lucide-react";

const MAPA: Record<string, LucideIcon> = {
  shield: Shield, siren: Siren, school: School, "graduation-cap": GraduationCap, "heart-pulse": HeartPulse, hospital: Hospital, car: Car,
  bus: Bus, truck: Truck, ship: Ship, scale: Scale, factory: Factory, briefcase: Briefcase, users: Users, user: User, headset: Headset,
  bot: Bot, "message-circle": MessageCircle, phone: Phone, mail: Mail, "bar-chart": BarChart3, "pie-chart": PieChart, lock: Lock, zap: Zap,
  building: Building2, landmark: Landmark, globe: Globe, "map-pin": MapPin, map: Map, "wifi-off": WifiOff, smartphone: Smartphone,
  monitor: Monitor, cloud: Cloud, server: Server, sparkles: Sparkles, "check-circle": CheckCircle2, "clipboard-check": ClipboardCheck,
  "file-text": FileText, search: Search, leaf: Leaf, recycle: Recycle, award: Award, rocket: Rocket, handshake: Handshake, clock: Clock,
  settings: Settings, layers: Layers, palette: Palette,
};

export default function Icone({ nome, tamanho = 22 }: { nome?: string; tamanho?: number }) {
  const I = MAPA[(nome || "").trim().toLowerCase()] ?? Sparkles;
  return <I size={tamanho} aria-hidden />;
}
