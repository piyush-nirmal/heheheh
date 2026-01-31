import { Users, MessageSquare, ThumbsUp, Share2, Search, Filter, Image as ImageIcon, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';

const posts = [
    {
        id: 1,
        author: "Ramesh Patil",
        avatar: "",
        time: "2 hours ago",
        content: "My soybean crop is showing yellowing leaves. I have applied Urea 10 days ago. What could be the reason?",
        tags: ["Soybean", "Disease", "Advice"],
        likes: 24,
        comments: 12,
        image: "https://images.unsplash.com/photo-1599940824399-b87987ce179a?auto=format&fit=crop&q=80&w=500"
    },
    {
        id: 2,
        author: "Suresh Deshmukh",
        avatar: "",
        time: "5 hours ago",
        content: "Successfully harvested 20 quintals of wheat per acre using the new variety HD-3226. Highly recommended for Vidarbha region!",
        tags: ["Success Story", "Wheat", "Yield"],
        likes: 156,
        comments: 45,
        image: null
    },
    {
        id: 3,
        author: "Kisan Vikas Kendra",
        avatar: "",
        isVerified: true,
        time: "1 day ago",
        content: "⚠️ Heavy rainfall alert for Nashik and Ahmednagar districts for next 48 hours. Please ensure proper drainage fields. #WeatherAlert",
        tags: ["Weather", "Alert", "KVK"],
        likes: 890,
        comments: 12,
        image: null
    }
];

const CommunityPage = () => {
    const { state } = useApp();

    return (
        <div className="bg-gray-100 min-h-screen pb-12">
            <div className="bg-purple-700 text-white py-8">
                <div className="max-w-5xl mx-auto px-4">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Users className="h-8 w-8" /> Farmer Community
                    </h1>
                    <p className="opacity-90 mt-2">
                        Ask questions, share success stories, and connect with experts.
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Sidebar (Profile & Filters) */}
                <div className="hidden lg:block lg:col-span-3 space-y-4">
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <Avatar className="h-20 w-20 mx-auto mb-3">
                                <AvatarImage src={state.user?.photoURL || ''} />
                                <AvatarFallback>You</AvatarFallback>
                            </Avatar>
                            <h3 className="font-bold">{state.user?.displayName || 'Farmer'}</h3>
                            <p className="text-xs text-gray-500 mb-4">{state.user?.email}</p>
                            <div className="grid grid-cols-2 gap-2 text-sm border-t pt-4">
                                <div>
                                    <span className="block font-bold">12</span>
                                    <span className="text-gray-500 text-xs">Posts</span>
                                </div>
                                <div>
                                    <span className="block font-bold">450</span>
                                    <span className="text-gray-500 text-xs">Reputation</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-1">
                        <Button variant="ghost" className="w-full justify-start font-bold bg-white text-purple-700 hover:bg-purple-50">
                            <MessageSquare className="mr-2 h-4 w-4" /> All Discussions
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-gray-600 hover:bg-gray-200">
                            <Users className="mr-2 h-4 w-4" /> My Groups
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-gray-600 hover:bg-gray-200">
                            <ThumbsUp className="mr-2 h-4 w-4" /> Liked Posts
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
                                    <AvatarFallback>You</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-3">
                                    <Input placeholder="Share your farming query or experience..." className="bg-gray-50 border-none" />
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" className="text-gray-500">
                                                <ImageIcon className="h-4 w-4 mr-1" /> Photo
                                            </Button>
                                        </div>
                                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                                            <Send className="h-4 w-4 mr-1" /> Post
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Posts */}
                    {posts.map(post => (
                        <Card key={post.id}>
                            <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
                                <Avatar>
                                    {post.avatar ? <AvatarImage src={post.avatar} /> : <AvatarFallback>{post.author[0]}</AvatarFallback>}
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-sm text-gray-900">{post.author}</h4>
                                        {post.isVerified && <Badge variant="secondary" className="bg-blue-100 text-blue-700 h-5 px-1">✓ KVK</Badge>}
                                    </div>
                                    <p className="text-xs text-gray-500">{post.time}</p>
                                </div>
                            </CardHeader>
                            <CardContent className="pb-2">
                                <p className="text-gray-800 text-sm leading-relaxed mb-3">{post.content}</p>
                                {post.image && (
                                    <div className="rounded-lg overflow-hidden mb-3 border border-gray-100">
                                        <img src={post.image} alt="Post attachment" className="w-full object-cover max-h-[300px]" />
                                    </div>
                                )}
                                <div className="flex gap-2 mb-2">
                                    {post.tags.map(tag => (
                                        <span key={tag} className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">#{tag}</span>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="border-t pt-3 flex justify-between text-gray-500">
                                <Button variant="ghost" size="sm" className="hover:text-purple-600 hover:bg-purple-50">
                                    <ThumbsUp className="h-4 w-4 mr-1" /> {post.likes}
                                </Button>
                                <Button variant="ghost" size="sm" className="hover:text-blue-600 hover:bg-blue-50">
                                    <MessageSquare className="h-4 w-4 mr-1" /> {post.comments} Comments
                                </Button>
                                <Button variant="ghost" size="sm" className="hover:text-green-600 hover:bg-green-50">
                                    <Share2 className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Right Sidebar (Trending) */}
                <div className="hidden lg:block lg:col-span-3">
                    <Card>
                        <CardHeader className="pb-3 border-b">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                Trending Topics 📈
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            {['#MSP2024', '#GehuKheti', '#OrganicFarming', '#DroneSubsidy', '#PomegranateBlight'].map(topic => (
                                <div key={topic} className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                                    <span className="text-sm font-medium text-gray-700">{topic}</span>
                                    <span className="text-xs text-gray-400">1.2k posts</span>
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
