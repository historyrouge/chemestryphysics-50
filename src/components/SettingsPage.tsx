import { ArrowLeft, User, Bell, Shield, Palette, Globe, HelpCircle, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StarField from './StarField';

interface SettingsPageProps {
  onNavigateBack: () => void;
  onLogout: () => void;
}

const SettingsPage = ({ onNavigateBack, onLogout }: SettingsPageProps) => {
  const [activeSection, setActiveSection] = useState('account');
  const [settings, setSettings] = useState({
    notifications: {
      pushEnabled: true,
      emailEnabled: false,
      likes: true,
      comments: true,
      reposts: true,
      follows: true,
      mentions: true
    },
    privacy: {
      profilePublic: true,
      showEmail: false,
      allowMessages: true,
      showOnlineStatus: true
    },
    appearance: {
      theme: 'dark',
      language: 'en',
      fontSize: 'medium'
    }
  });

  const sections = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Safety', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'language', label: 'Language', icon: Globe },
    { id: 'help', label: 'Help & Support', icon: HelpCircle }
  ];

  const updateNotificationSetting = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value }
    }));
  };

  const updatePrivacySetting = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: { ...prev.privacy, [key]: value }
    }));
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'account':
        return (
          <div className="space-y-6">
            <Card className="glass-effect border-border">
              <CardHeader>
                <h3 className="font-semibold">Profile Information</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue="cosmic_explorer" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="user@example.com" />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" defaultValue="Exploring the cosmos one star at a time" />
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>

            <Card className="glass-effect border-border">
              <CardHeader>
                <h3 className="font-semibold">Password & Security</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline">Change Password</Button>
                <Button variant="outline">Enable Two-Factor Authentication</Button>
                <Button variant="outline">Download Your Data</Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <Card className="glass-effect border-border">
              <CardHeader>
                <h3 className="font-semibold">Notification Preferences</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <Switch
                    id="push-notifications"
                    checked={settings.notifications.pushEnabled}
                    onCheckedChange={(checked) => updateNotificationSetting('pushEnabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <Switch
                    id="email-notifications"
                    checked={settings.notifications.emailEnabled}
                    onCheckedChange={(checked) => updateNotificationSetting('emailEnabled', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-border">
              <CardHeader>
                <h3 className="font-semibold">What to Notify</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries({
                  likes: 'Likes on your posts',
                  comments: 'Comments on your posts',
                  reposts: 'Reposts of your content',
                  follows: 'New followers',
                  mentions: 'Mentions in posts'
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label htmlFor={key}>{label}</Label>
                    <Switch
                      id={key}
                      checked={settings.notifications[key as keyof typeof settings.notifications] as boolean}
                      onCheckedChange={(checked) => updateNotificationSetting(key, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <Card className="glass-effect border-border">
              <CardHeader>
                <h3 className="font-semibold">Privacy Settings</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries({
                  profilePublic: 'Public Profile',
                  showEmail: 'Show Email Address',
                  allowMessages: 'Allow Direct Messages',
                  showOnlineStatus: 'Show Online Status'
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label htmlFor={key}>{label}</Label>
                    <Switch
                      id={key}
                      checked={settings.privacy[key as keyof typeof settings.privacy] as boolean}
                      onCheckedChange={(checked) => updatePrivacySetting(key, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-effect border-border">
              <CardHeader>
                <h3 className="font-semibold">Blocked Users</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">You haven't blocked any users yet.</p>
                <Button variant="outline">Manage Blocked Users</Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <Card className="glass-effect border-border">
              <CardHeader>
                <h3 className="font-semibold">Theme</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="theme">Color Theme</Label>
                  <Select defaultValue="dark">
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="font-size">Font Size</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue placeholder="Select font size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'language':
        return (
          <div className="space-y-6">
            <Card className="glass-effect border-border">
              <CardHeader>
                <h3 className="font-semibold">Language & Region</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="language">Display Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timezone">Time Zone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern Time</SelectItem>
                      <SelectItem value="pst">Pacific Time</SelectItem>
                      <SelectItem value="cet">Central European Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'help':
        return (
          <div className="space-y-6">
            <Card className="glass-effect border-border">
              <CardHeader>
                <h3 className="font-semibold">Support</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Help Center
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Report a Bug
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Privacy Policy
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Terms of Service
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-effect border-border">
              <CardHeader>
                <h3 className="font-semibold">App Information</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Version: 1.0.0</p>
                  <p>Build: 2024.01.15</p>
                  <p>© 2024 Celestial Social</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative">
      <StarField />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="sticky top-0 glass-effect border-b border-border z-20">
          <div className="flex items-center gap-4 p-4 max-w-4xl mx-auto">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onNavigateBack}
              className="hover:bg-accent/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Settings</h1>
              <p className="text-sm text-muted-foreground">Manage your account preferences</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto flex h-[calc(100vh-80px)]">
          {/* Settings Menu */}
          <div className="w-80 border-r border-border p-4">
            <div className="space-y-2">
              {sections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-accent/20 text-accent'
                        : 'text-muted-foreground hover:bg-accent/10 hover:text-accent'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    {section.label}
                  </button>
                );
              })}
              
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;