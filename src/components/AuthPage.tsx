import { useState } from 'react';
import { Star, Loader2, Eye, EyeOff } from 'lucide-react';
import StarField from './StarField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';

type AuthMode = 'login' | 'register';

interface AuthPageProps {
  onAuth?: () => void;
}

const AuthPage = ({ onAuth }: AuthPageProps) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    displayName: '',
    password: ''
  });
  const { toast } = useToast();
  const { login, register } = useUser();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;

      if (mode === 'login') {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData.email, formData.password, formData.username, formData.displayName);
      }

      if (result.success) {
        if (mode === 'register') {
          toast({
            title: 'Check your email!',
            description: 'Please check your email for a confirmation link to complete registration.',
          });
        } else {
          toast({
            title: 'Welcome back!',
            description: 'Successfully logged in to Celestial.',
          });
          if (onAuth) {
            setTimeout(onAuth, 1000);
          }
        }
      } else {
        toast({
          title: mode === 'login' ? 'Login failed' : 'Registration failed',
          description: result.error || 'Please try again.',
          variant: 'destructive'
        });
      }
      
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <StarField />
      
      <div className="glass-effect w-full max-w-md p-8 rounded-3xl relative z-10 animate-fade-in">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-cosmic mb-4 animate-glow">
            <Star className="w-8 h-8 text-white" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold text-accent mb-2">Celestial</h1>
          <p className="text-muted-foreground">Join the universe of social media</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-8 p-1 glass-effect rounded-xl">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all text-sm ${
              mode === 'login'
                ? 'bg-gradient-cosmic text-white shadow-glow-primary'
                : 'text-muted-foreground hover:text-accent'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all text-sm ${
              mode === 'register'
                ? 'bg-gradient-cosmic text-white shadow-glow-primary'
                : 'text-muted-foreground hover:text-accent'
            }`}
          >
            Register
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-sm font-medium text-accent">Display Name</Label>
              <Input
                id="displayName"
                type="text"
                required
                value={formData.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                className="bg-input/50 border-border focus:border-accent transition-colors"
                placeholder="Enter your display name"
              />
            </div>
          )}

          {mode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-accent">Username</Label>
              <Input
                id="username"
                type="text"
                required
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="bg-input/50 border-border focus:border-accent transition-colors"
                placeholder="Choose a username"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-accent">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="bg-input/50 border-border focus:border-accent transition-colors"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-accent">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="bg-input/50 border-border focus:border-accent transition-colors pr-10"
                placeholder="Enter your password"
                minLength={mode === 'register' ? 6 : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="cosmic"
            className="w-full text-lg py-6 font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {mode === 'login' ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </Button>
        </form>

        {/* Forgot Password */}
        <div className="text-center mt-6">
          <button className="text-sm text-accent hover:text-accent/80 transition-colors">
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;