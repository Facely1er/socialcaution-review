// Icon mapping for dynamic icon usage in data files
import { 
  Shield, Activity, AlertTriangle, CheckCircle, FileText, Video, BookOpen, 
  TrendingUp, Globe, Scale, Users, Target, Wrench, Lock, Database, 
  Eye, Mail, Phone, MessageCircle, Star, Zap, Clock, Search,
  ShoppingCart, Camera, Briefcase, Heart, AlertCircle, Trophy, User,
  GraduationCap, Radar
} from 'lucide-react';

export const iconMap = {
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  FileText,
  Video,
  BookOpen,
  TrendingUp,
  Globe,
  Scale,
  Users,
  Target,
  Wrench,
  Lock,
  Database,
  Eye,
  Mail,
  Phone,
  MessageCircle,
  Star,
  Zap,
  Clock,
  Search,
  ShoppingCart,
  Camera,
  Briefcase,
  Heart,
  AlertCircle,
  Trophy,
  User,
  GraduationCap,
  Radar
};

// Helper function to get icon component from string
export const getIconComponent = (iconName) => {
  return iconMap[iconName] || Shield;
};

export default iconMap;