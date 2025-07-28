import { useState, useEffect } from 'react';
import { Moon, Sun, Monitor, Palette, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type ThemeMode = 'light' | 'dark' | 'system';
type ColorTheme = 'default' | 'blue' | 'purple' | 'green' | 'red' | 'orange';

interface ThemeConfig {
  mode: ThemeMode;
  colorTheme: ColorTheme;
  accentColor: string;
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  fontSize: 'small' | 'medium' | 'large';
}

const colorThemes = {
  default: {
    name: 'Cosmic Blue',
    primary: 'hsl(210, 100%, 50%)',
    accent: 'hsl(220, 70%, 60%)',
    preview: 'bg-gradient-to-br from-blue-500 to-cyan-500'
  },
  blue: {
    name: 'Ocean Deep',
    primary: 'hsl(200, 100%, 45%)',
    accent: 'hsl(190, 80%, 55%)',
    preview: 'bg-gradient-to-br from-blue-600 to-blue-400'
  },
  purple: {
    name: 'Nebula Purple',
    primary: 'hsl(270, 85%, 55%)',
    accent: 'hsl(280, 75%, 65%)',
    preview: 'bg-gradient-to-br from-purple-600 to-pink-500'
  },
  green: {
    name: 'Aurora Green',
    primary: 'hsl(150, 80%, 45%)',
    accent: 'hsl(160, 70%, 55%)',
    preview: 'bg-gradient-to-br from-green-600 to-emerald-400'
  },
  red: {
    name: 'Mars Red',
    primary: 'hsl(0, 85%, 55%)',
    accent: 'hsl(10, 75%, 65%)',
    preview: 'bg-gradient-to-br from-red-600 to-orange-500'
  },
  orange: {
    name: 'Solar Orange',
    primary: 'hsl(30, 90%, 55%)',
    accent: 'hsl(40, 80%, 65%)',
    preview: 'bg-gradient-to-br from-orange-600 to-yellow-500'
  }
};

const ThemeSystem = () => {
  const [theme, setTheme] = useState<ThemeConfig>({
    mode: 'dark',
    colorTheme: 'default',
    accentColor: colorThemes.default.accent,
    borderRadius: 'medium',
    fontSize: 'medium'
  });

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('cosmic-theme');
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme);
        setTheme(parsed);
        applyTheme(parsed);
      } catch (error) {
        console.error('Failed to parse saved theme:', error);
      }
    }
  }, []);

  const applyTheme = (newTheme: ThemeConfig) => {
    const root = document.documentElement;
    
    // Apply theme mode
    if (newTheme.mode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', newTheme.mode);
    }

    // Apply color theme
    const colors = colorThemes[newTheme.colorTheme];
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--accent', colors.accent);

    // Apply border radius
    const radiusValues = {
      none: '0px',
      small: '4px',
      medium: '8px',
      large: '16px'
    };
    root.style.setProperty('--radius', radiusValues[newTheme.borderRadius]);

    // Apply font size
    const fontSizes = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    root.style.setProperty('--base-font-size', fontSizes[newTheme.fontSize]);

    // Save to localStorage
    localStorage.setItem('cosmic-theme', JSON.stringify(newTheme));
    setTheme(newTheme);
  };

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    const newTheme = { ...theme, ...updates };
    applyTheme(newTheme);
  };

  const getThemeIcon = (mode: ThemeMode) => {
    switch (mode) {
      case 'light':
        return <Sun className="w-4 h-4" />;
      case 'dark':
        return <Moon className="w-4 h-4" />;
      case 'system':
        return <Monitor className="w-4 h-4" />;
    }
  };

  const resetToDefault = () => {
    const defaultTheme: ThemeConfig = {
      mode: 'dark',
      colorTheme: 'default',
      accentColor: colorThemes.default.accent,
      borderRadius: 'medium',
      fontSize: 'medium'
    };
    applyTheme(defaultTheme);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Quick Theme Toggle */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="hover:bg-accent/10">
            {getThemeIcon(theme.mode)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-md border-border/50">
          <DropdownMenuItem onClick={() => updateTheme({ mode: 'light' })}>
            <Sun className="w-4 h-4 mr-2" />
            Light Mode
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateTheme({ mode: 'dark' })}>
            <Moon className="w-4 h-4 mr-2" />
            Dark Mode
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateTheme({ mode: 'system' })}>
            <Monitor className="w-4 h-4 mr-2" />
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Advanced Theme Settings */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="hover:bg-accent/10">
            <Palette className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-card/95 backdrop-blur-md border-border/50" align="end">
          <Card className="border-0 bg-transparent">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="w-5 h-5" />
                Theme Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Mode */}
              <div>
                <h4 className="text-sm font-medium mb-3">Appearance</h4>
                <div className="grid grid-cols-3 gap-2">
                  {(['light', 'dark', 'system'] as ThemeMode[]).map((mode) => (
                    <Button
                      key={mode}
                      variant={theme.mode === mode ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateTheme({ mode })}
                      className="flex flex-col gap-1 h-auto py-3"
                    >
                      {getThemeIcon(mode)}
                      <span className="text-xs capitalize">{mode}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Color Themes */}
              <div>
                <h4 className="text-sm font-medium mb-3">Color Theme</h4>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(colorThemes) as [ColorTheme, typeof colorThemes.default][]).map(([key, colorTheme]) => (
                    <Button
                      key={key}
                      variant={theme.colorTheme === key ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateTheme({ colorTheme: key })}
                      className="flex items-center gap-2 h-auto py-2 justify-start"
                    >
                      <div className={`w-4 h-4 rounded-full ${colorTheme.preview}`} />
                      <span className="text-xs">{colorTheme.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Border Radius */}
              <div>
                <h4 className="text-sm font-medium mb-3">Border Radius</h4>
                <div className="grid grid-cols-4 gap-2">
                  {(['none', 'small', 'medium', 'large'] as const).map((radius) => (
                    <Button
                      key={radius}
                      variant={theme.borderRadius === radius ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateTheme({ borderRadius: radius })}
                      className="text-xs capitalize"
                      style={{ borderRadius: radius === 'none' ? '0' : radius === 'small' ? '4px' : radius === 'medium' ? '8px' : '16px' }}
                    >
                      {radius}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <h4 className="text-sm font-medium mb-3">Font Size</h4>
                <div className="grid grid-cols-3 gap-2">
                  {(['small', 'medium', 'large'] as const).map((size) => (
                    <Button
                      key={size}
                      variant={theme.fontSize === size ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateTheme({ fontSize: size })}
                      className="text-xs capitalize"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Current Theme Badge */}
              <div className="pt-4 border-t border-border/20">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-accent/20 text-accent">
                    {colorThemes[theme.colorTheme].name} • {theme.mode}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetToDefault}
                    className="text-xs"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ThemeSystem;