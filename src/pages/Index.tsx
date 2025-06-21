
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, FileText, Calendar, Trash2 } from 'lucide-react';
import { CV } from '@/types/cv';
import { loadCVs, createEmptyCV, saveCV, deleteCV } from '@/utils/cvStorage';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [newCVName, setNewCVName] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCvs(loadCVs());
  }, []);

  const handleCreateCV = () => {
    if (!newCVName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your CV",
        variant: "destructive"
      });
      return;
    }

    const newCV = createEmptyCV(newCVName.trim());
    saveCV(newCV);
    setCvs(loadCVs());
    setNewCVName('');
    setIsCreateDialogOpen(false);
    
    toast({
      title: "CV Created",
      description: `"${newCV.name}" has been created successfully`
    });
    
    navigate(`/cv/${newCV.id}`);
  };

  const handleDeleteCV = (cv: CV) => {
    deleteCV(cv.id);
    setCvs(loadCVs());
    toast({
      title: "CV Deleted",
      description: `"${cv.name}" has been deleted`
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 font-korean">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            ACAFO Korean CV Builder
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Create professional Korean-style resumes tailored for the Korean job market
          </p>
        </div>

        {/* Create New CV Button */}
        <div className="flex justify-center mb-8">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                <Plus className="mr-2 h-5 w-5" />
                Create New CV
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New CV</DialogTitle>
                <DialogDescription>
                  Enter a name for your new CV (e.g., "Samsung Application", "Teaching Position")
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="cv-name">CV Name</Label>
                  <Input
                    id="cv-name"
                    value={newCVName}
                    onChange={(e) => setNewCVName(e.target.value)}
                    placeholder="Enter CV name..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleCreateCV();
                      }
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCV}>Create CV</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* CV List */}
        {cvs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {cvs.map((cv) => (
              <Card key={cv.id} className="group hover:shadow-lg transition-all duration-200 border-slate-200 hover:border-blue-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {cv.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500 mt-1">
                        Created {formatDate(cv.createdAt)}
                      </CardDescription>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity p-2 h-8 w-8 hover:bg-red-50 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete CV</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{cv.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteCV(cv)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center text-sm text-slate-600 mb-4">
                    <Calendar className="h-4 w-4 mr-2" />
                    Updated {formatDate(cv.updatedAt)}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => navigate(`/cv/${cv.id}`)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button 
                      onClick={() => navigate(`/cv/${cv.id}/preview`)}
                      variant="outline"
                      className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <FileText className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No CVs yet</h3>
            <p className="text-slate-500 mb-6">Create your first Korean-style resume to get started</p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              variant="outline" 
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Your First CV
            </Button>
          </div>
        )}

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Korean Format</h3>
            <p className="text-sm text-slate-600">Professional layouts following Korean resume standards</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Easy to Use</h3>
            <p className="text-sm text-slate-600">Step-by-step form with guidance for each section</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Export Ready</h3>
            <p className="text-sm text-slate-600">Download as professional A4 PDF for applications</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
