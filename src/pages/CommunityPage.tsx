import { useState } from 'react';
import { Users, MessageSquare, ThumbsUp, Share2, Image as ImageIcon, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from 'react-i18next';

const initialPosts = [
  {
    id: 1,
    author: 'Ramesh Patil',
    avatar: '',
    time: '2 hours ago',
    content: 'My soybean crop is showing yellowing leaves. I have applied Urea 10 days ago. What could be the reason?',
    tags: ['Soybean', 'Disease', 'Advice'],
    likes: 24,
    comments: 12,
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ce179a?auto=format&fit=crop&q=80&w=500',
  },
  {
    id: 2,
    author: 'Suresh Deshmukh',
    avatar: '',
    time: '5 hours ago',
    content: 'Successfully harvested 20 quintals of wheat per acre using the new variety HD-3226. Highly recommended for Vidarbha region!',
    tags: ['Success Story', 'Wheat', 'Yield'],
    likes: 156,
    comments: 45,
    image: null,
  },
  {
    id: 3,
    author: 'Kisan Vikas Kendra',
    avatar: '',
    isVerified: true,
    time: '1 day ago',
    content: '⚠️ Heavy rainfall alert for Nashik and Ahmednagar districts for next 48 hours. Please ensure proper drainage in fields. #WeatherAlert',
    tags: ['Weather', 'Alert', 'KVK'],
    likes: 890,
    comments: 12,
    image: null,
  },
];

const CommunityPage = () => {
  const { state } = useApp();
  const { t } = useTranslation();
  const [posts, setPosts] = useState(initialPosts);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [newPostText, setNewPostText] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'liked'>('all');

  const toggleLike = (postId: number) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
        setPosts(p => p.map(post => post.id === postId ? { ...post, likes: post.likes - 1 } : post));
      } else {
        next.add(postId);
        setPosts(p => p.map(post => post.id === postId ? { ...post, likes: post.likes + 1 } : post));
      }
      return next;
    });
  };

  const handlePost = () => {
    if (!newPostText.trim()) return;
    const newPost = {
      id: Date.now(),
      author: state.user?.displayName || t('community.farmer'),
      avatar: state.user?.photoURL || '',
      time: 'Just now',
      content: newPostText,
      tags: [],
      likes: 0,
      comments: 0,
      image: null,
    };
    setPosts(prev => [newPost, ...prev]);
    setNewPostText('');
  };

  const displayedPosts = activeTab === 'liked'
    ? posts.filter(p => likedPosts.has(p.id))
    : posts;

  return (
    <div className="bg-gray-100 min-h-screen pb-12">
      <div className="bg-purple-700 text-white py-8">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 xl:px-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="h-8 w-8" /> {t('community.title')}
          </h1>
          <p className="opacity-90 mt-2">{t('community.subtitle')}</p>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 xl:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Sidebar */}
        <div className="hidden lg:block lg:col-span-3 space-y-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <Avatar className="h-20 w-20 mx-auto mb-3">
                <AvatarImage src={state.user?.photoURL || ''} />
                <AvatarFallback>{t('community.you')}</AvatarFallback>
              </Avatar>
              <h3 className="font-bold">{state.user?.displayName || t('community.farmer')}</h3>
              <p className="text-xs text-gray-500 mb-4">{state.user?.email}</p>
              <div className="grid grid-cols-2 gap-2 text-sm border-t pt-4">
                <div>
                  <span className="block font-bold">{posts.filter(p => p.author === (state.user?.displayName || '')).length}</span>
                  <span className="text-gray-500 text-xs">{t('community.posts')}</span>
                </div>
                <div>
                  <span className="block font-bold">{likedPosts.size * 37}</span>
                  <span className="text-gray-500 text-xs">{t('community.reputation')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-1">
            <Button
              variant="ghost"
              className={`w-full justify-start font-bold ${activeTab === 'all' ? 'bg-white text-purple-700 hover:bg-purple-50' : 'text-gray-600 hover:bg-gray-200'}`}
              onClick={() => setActiveTab('all')}
            >
              <MessageSquare className="mr-2 h-4 w-4" /> {t('community.allDiscussions')}
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start font-bold ${activeTab === 'liked' ? 'bg-white text-purple-700 hover:bg-purple-50' : 'text-gray-600 hover:bg-gray-200'}`}
              onClick={() => setActiveTab('liked')}
            >
              <ThumbsUp className="mr-2 h-4 w-4" /> {t('community.likedPosts')} {likedPosts.size > 0 && `(${likedPosts.size})`}
            </Button>
          </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-6 space-y-6">
          {/* Create Post */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src={state.user?.photoURL || ''} />
                  <AvatarFallback>{t('community.you')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <Input
                    placeholder={t('community.sharePlaceholder')}
                    className="bg-gray-50 border-none"
                    value={newPostText}
                    onChange={e => setNewPostText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handlePost()}
                  />
                  <div className="flex justify-between items-center">
                    <Button size="sm" variant="outline" className="text-gray-500">
                      <ImageIcon className="h-4 w-4 mr-1" /> {t('community.photo')}
                    </Button>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={handlePost}>
                      <Send className="h-4 w-4 mr-1" /> {t('community.post')}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts */}
          {displayedPosts.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center text-gray-400">
                <ThumbsUp className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p>{t('community.likedPosts')} — {t('crops.noResults')}</p>
              </CardContent>
            </Card>
          ) : displayedPosts.map(post => (
            <Card key={post.id}>
              <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
                <Avatar>
                  {post.avatar ? <AvatarImage src={post.avatar} /> : <AvatarFallback>{post.author[0]}</AvatarFallback>}
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-gray-900">{post.author}</h4>
                    {post.isVerified && <Badge variant="secondary" className="bg-blue-100 text-blue-700 h-5 px-1">{t('community.kvkVerified')}</Badge>}
                  </div>
                  <p className="text-xs text-gray-500">{post.time}</p>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-gray-800 text-sm leading-relaxed mb-3">{post.content}</p>
                {post.image && (
                  <div className="rounded-lg overflow-hidden mb-3 border border-gray-100">
                    <img src={post.image} alt="Post" className="w-full object-cover max-h-[300px]" />
                  </div>
                )}
                <div className="flex gap-2 mb-2 flex-wrap">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">#{tag}</span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-3 flex justify-between text-gray-500">
                <Button
                  variant="ghost" size="sm"
                  className={`transition-colors ${likedPosts.has(post.id) ? 'text-purple-600 bg-purple-50' : 'hover:text-purple-600 hover:bg-purple-50'}`}
                  onClick={() => toggleLike(post.id)}
                >
                  <ThumbsUp className="h-4 w-4 mr-1" /> {post.likes}
                </Button>
                <Button variant="ghost" size="sm" className="hover:text-blue-600 hover:bg-blue-50">
                  <MessageSquare className="h-4 w-4 mr-1" /> {post.comments} {t('community.comments')}
                </Button>
                <Button variant="ghost" size="sm" className="hover:text-green-600 hover:bg-green-50">
                  <Share2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block lg:col-span-3">
          <Card>
            <CardHeader className="pb-3 border-b">
              <h3 className="text-sm font-bold">{t('community.trendingTopics')}</h3>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {['#MSP2024', '#GehuKheti', '#OrganicFarming', '#DroneSubsidy', '#PomegranateBlight'].map(topic => (
                <div key={topic} className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <span className="text-sm font-medium text-gray-700">{topic}</span>
                  <span className="text-xs text-gray-400">{t('community.postsCount')}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
