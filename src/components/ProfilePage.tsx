import { useState } from 'react';
import { ArrowLeft, Calendar, Link, MapPin, Edit, Camera, Users, Heart } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import StarField from './StarField';

interface ProfilePageProps {
  onNavigateBack: () => void;
}

const ProfilePage = ({ onNavigateBack }: ProfilePageProps) => {
  const { currentUser, posts, bits, updateProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    displayName: currentUser?.displayName || '',
    bio: currentUser?.bio || '',
    website: currentUser?.website || '',
    location: currentUser?.location || ''
  });

  const userPosts = posts.filter(post => post.author.id === currentUser?.id);
  const userBits = bits.filter(bit => bit.author.id === currentUser?.id);

  const handleSaveProfile = () => {
    updateProfile(editData);
    setIsEditing(false);
  };

  const handleAvatarChange = () => {
    // In a real app, this would open a file picker
    const newAvatar = prompt('Enter new avatar URL:');
    if (newAvatar) {
      updateProfile({ avatar: newAvatar });
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-blue to-space-purple text-foreground">
      <StarField />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border">
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
              <h1 className="text-xl font-bold">{currentUser.displayName}</h1>
              <p className="text-sm text-muted-foreground">{userPosts.length} posts</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 pb-8">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg mb-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent" />
          </div>

          {/* Profile Info */}
          <Card className="bg-card/80 backdrop-blur-md border-border/50 -mt-16 relative z-10">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-background ring-2 ring-accent/20">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.displayName} />
                    <AvatarFallback className="bg-accent/20 text-accent-foreground text-2xl">
                      {currentUser.displayName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full"
                    onClick={handleAvatarChange}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                  className="cosmic-btn"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditing ? 'Save Profile' : 'Edit Profile'}
                </Button>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={editData.displayName}
                      onChange={(e) => setEditData(prev => ({ ...prev, displayName: e.target.value }))}
                      className="bg-background/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={editData.bio}
                      onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself..."
                      className="bg-background/50"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={editData.website}
                      onChange={(e) => setEditData(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://yourwebsite.com"
                      className="bg-background/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editData.location}
                      onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Where are you located?"
                      className="bg-background/50"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold">{currentUser.displayName}</h2>
                    <p className="text-muted-foreground">@{currentUser.username}</p>
                  </div>
                  
                  {currentUser.bio && (
                    <p className="text-foreground">{currentUser.bio}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {currentUser.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{currentUser.location}</span>
                      </div>
                    )}
                    {currentUser.website && (
                      <div className="flex items-center gap-1">
                        <Link className="w-4 h-4" />
                        <a 
                          href={currentUser.website.startsWith('http') ? currentUser.website : `https://${currentUser.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {currentUser.website}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {new Date(currentUser.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-6 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span><strong>{currentUser.following}</strong> Following</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span><strong>{currentUser.followers}</strong> Followers</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content Tabs */}
          <div className="mt-8">
            <div className="border-b border-border">
              <div className="flex gap-8">
                <button className="px-4 py-3 border-b-2 border-accent text-accent font-semibold">
                  Posts ({userPosts.length})
                </button>
                <button className="px-4 py-3 text-muted-foreground hover:text-foreground">
                  Bits ({userBits.length})
                </button>
                <button className="px-4 py-3 text-muted-foreground hover:text-foreground">
                  Media
                </button>
                <button className="px-4 py-3 text-muted-foreground hover:text-foreground">
                  Likes
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {userPosts.length === 0 ? (
                <Card className="bg-card/80 backdrop-blur-md border-border/50">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">No posts yet. Share your first cosmic thought!</p>
                  </CardContent>
                </Card>
              ) : (
                userPosts.map(post => (
                  <Card key={post.id} className="bg-card/80 backdrop-blur-md border-border/50">
                    <CardContent className="p-6">
                      <div className="flex gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={post.author.avatar} alt={post.author.displayName} />
                          <AvatarFallback>{post.author.displayName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{post.author.displayName}</span>
                            <span className="text-muted-foreground">@{post.author.username}</span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-muted-foreground text-sm">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-foreground mb-3">{post.content}</p>
                          {post.image && (
                            <img 
                              src={post.image} 
                              alt="Post image"
                              className="rounded-lg max-w-full h-auto mb-3"
                            />
                          )}
                          <div className="flex gap-6 text-muted-foreground text-sm">
                            <span>{post.comments} comments</span>
                            <span>{post.reposts} reposts</span>
                            <span>{post.likes} likes</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;