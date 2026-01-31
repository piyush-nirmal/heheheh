import { MapPin, FlaskConical, Trash2, User, Settings, FileText, Download, ShieldCheck, ChevronRight, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { state, dispatch } = useApp();
  const { toast } = useToast();

  const handleRemoveLocation = (id: string) => {
    dispatch({ type: 'REMOVE_LOCATION', payload: id });
    toast({
      title: 'Location Removed',
      description: 'Farm location has been deleted.',
    });
  };

  const handleClearAllData = () => {
    if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Page Title Section */}
      <div className="bg-[#1b325f] text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">My Farmer Profile</h1>
          <p className="opacity-80">Manage your Digital 7/12 Records, Soil Health Cards, and Personal Preferences.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar - Profile & Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-t-4 border-orange-500 shadow-md">
            <CardContent className="pt-6 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-gray-200">
                <User className="h-10 w-10 text-gray-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Guest Farmer</h2>
              <p className="text-sm text-gray-500 mb-4">Maharashtra State</p>
              <Badge variant="secondary" className="mb-4">Standard Account</Badge>
              <Button className="w-full bg-[#1b325f] hover:bg-[#2c4a87]">
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 font-bold text-gray-700">Account Settings</div>
            <ul className="text-sm">
              <li>
                <button className="w-full text-left px-4 py-3 hover:bg-orange-50 hover:text-orange-600 flex justify-between items-center border-b border-gray-50 transition-colors">
                  Change Language <span><ChevronRight className="h-4 w-4 opacity-50" /></span>
                </button>
              </li>
              <li>
                <button className="w-full text-left px-4 py-3 hover:bg-orange-50 hover:text-orange-600 flex justify-between items-center border-b border-gray-50 transition-colors">
                  Notifications <span><ChevronRight className="h-4 w-4 opacity-50" /></span>
                </button>
              </li>
              <li>
                <button className="w-full text-left px-4 py-3 hover:bg-orange-50 hover:text-orange-600 flex justify-between items-center transition-colors">
                  Privacy Policy <span><ChevronRight className="h-4 w-4 opacity-50" /></span>
                </button>
              </li>
              <li>
                <Link to="/auth" className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 flex justify-between items-center border-t border-gray-100 transition-colors">
                  Logout <span><LogOut className="h-4 w-4" /></span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-bold text-gray-700 mb-2">Need Help?</h3>
            <p className="text-xs text-gray-500 mb-3">Contact the Kisan Call Center for assistance with your digital records.</p>
            <Button variant="outline" className="w-full border-green-600 text-green-700 hover:bg-green-50">
              Call 1800-180-1551
            </Button>
          </div>
        </div>

        {/* Right Content - Main Dashboard */}
        <div className="lg:col-span-3 space-y-6">

          {/* Digital 7/12 Section */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-100 py-3">
              <CardTitle className="text-lg flex items-center gap-2 text-[#1b325f]">
                <FileText className="h-5 w-5" /> Digital 7/12 & 8A Records
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-5 hover:border-orange-300 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between mb-2">
                    <div className="bg-orange-100 p-2 rounded-md group-hover:bg-orange-200 transition-colors">
                      <Download className="h-6 w-6 text-orange-600" />
                    </div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">Download 7/12 Extract</h3>
                  <p className="text-xs text-gray-500">Get your digitally signed land record rights document.</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between mb-2">
                    <div className="bg-blue-100 p-2 rounded-md group-hover:bg-blue-200 transition-colors">
                      <ShieldCheck className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">View Form 8A</h3>
                  <p className="text-xs text-gray-500">Check your holding details and land taxation status.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Saved Locations */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-100 py-3">
              <CardTitle className="text-lg flex items-center gap-2 text-[#1b325f]">
                <MapPin className="h-5 w-5" /> Saved Farm Locations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {state.locations.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {state.locations.map((location) => (
                    <div key={location.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-50 p-2 rounded-full">
                          <MapPin className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{location.name}</p>
                          <p className="text-xs text-gray-500 font-mono">
                            {location.coordinates.lat.toFixed(4)}, {location.coordinates.lng.toFixed(4)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {state.currentLocation?.id === location.id && (
                          <Badge className="bg-green-600">Active Farm</Badge>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveLocation(location.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-gray-50/50">
                  <p className="text-gray-500 text-sm mb-4">No farm locations registered yet.</p>
                  <Link to="/map">
                    <Button className="bg-[#1b325f]">Add New Farm</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Soil History */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-100 py-3">
              <CardTitle className="text-lg flex items-center gap-2 text-[#1b325f]">
                <FlaskConical className="h-5 w-5" /> Soil Health Card History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {state.soilReadings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3 text-center">Nitrogen (N)</th>
                        <th className="px-4 py-3 text-center">Phosphorus (P)</th>
                        <th className="px-4 py-3 text-center">Potassium (K)</th>
                        <th className="px-4 py-3 text-center">pH Level</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {state.soilReadings.slice(-5).reverse().map((reading) => (
                        <tr key={reading.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-700">
                            {new Date(reading.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-center">{reading.data.nitrogen}</td>
                          <td className="px-4 py-3 text-center">{reading.data.phosphorus}</td>
                          <td className="px-4 py-3 text-center">{reading.data.potassium}</td>
                          <td className="px-4 py-3 text-center font-bold">{reading.data.ph}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center bg-gray-50/50">
                  <p className="text-gray-500 text-sm mb-4">No soil tests recorded.</p>
                  <Link to="/soil">
                    <Button variant="outline" className="border-[#1b325f] text-[#1b325f]">Enter Soil Data</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="pt-6 border-t border-gray-200">
            <Button variant="ghost" onClick={handleClearAllData} className="text-red-600 hover:bg-red-50 hover:text-red-700 w-full md:w-auto">
              <Trash2 className="h-4 w-4 mr-2" /> Clear All Local Data (System Reset)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
