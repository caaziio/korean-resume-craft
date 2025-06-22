
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText, Calendar, Edit, Trash2, Eye } from 'lucide-react';
import { CV } from '@/types/cv';
import { createEmptyCV, saveCV, loadCVs, deleteCV } from '@/utils/cvStorage';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Index = () => {
  const navigate = useNavigate();
  const [cvs, setCvs] = useState<CV[]>([]);
  const [newCVName, setNewCVName] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cvToDelete, setCvToDelete] = useState<CV | null>(null);

  useEffect(() => {
    const loadedCVs = loadCVs();
    setCvs(loadedCVs);
  }, []);

  const handleCreateCV = () => {
    if (!newCVName.trim()) {
      toast({
        title: "Please enter a name",
        description: "CV name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    const newCV = createEmptyCV(newCVName.trim());
    saveCV(newCV);
    setCvs(prev => [newCV, ...prev]);
    setNewCVName('');
    
    toast({
      title: "CV Created",
      description: `"${newCV.name}" has been created successfully`,
    });
    
    navigate(`/cv/${newCV.id}`);
  };

  const handleDeleteCV = (cv: CV) => {
    setCvToDelete(cv);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (cvToDelete) {
      deleteCV(cvToDelete.id);
      setCvs(prev => prev.filter(cv => cv.id !== cvToDelete.id));
      
      toast({
        title: "CV Deleted",
        description: `"${cvToDelete.name}" has been deleted successfully`,
      });
      
      setCvToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-korean">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">ACAFO CV Builder</h1>
          <p className="text-slate-600">Create professional CVs tailored for the Korean job market</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Create New CV Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New CV
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="cv-name">CV Name</Label>
                <Input
                  id="cv-name"
                  value={newCVName}
                  onChange={(e) => setNewCVName(e.target.value)}
                  placeholder="e.g., Software Engineer CV, Marketing Manager Resume"
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateCV()}
                />
              </div>
              <Button onClick={handleCreateCV} className="mt-6">
                <Plus className="h-4 w-4 mr-2" />
                Create CV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* CV List */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Your CVs ({cvs.length})</h2>
          
          {cvs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-700 mb-2">No CVs created yet</h3>
              <p className="text-slate-500 mb-6">Create your first CV to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cvs.map((cv) => (
                <Card key={cv.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2">{cv.name}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Created {formatDate(cv.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/cv/${cv.id}`)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/cv/${cv.id}/preview`)}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCV(cv)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete CV</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{cvToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
