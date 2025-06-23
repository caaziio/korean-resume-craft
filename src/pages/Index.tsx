import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, User, Mail, Briefcase, Edit, Eye, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { loadCVs, saveCVs, createEmptyCV, deleteCV } from '@/utils/cvStorage';

const Index = () => {
  const navigate = useNavigate();
  const [cvs, setCvs] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCVName, setNewCVName] = useState('');

  useEffect(() => {
    setCvs(loadCVs());
  }, []);

  const handleCreateCV = () => {
    if (newCVName.trim() !== '') {
      const newCV = createEmptyCV(newCVName);
      const updatedCVs = [...cvs, newCV];
      saveCVs(updatedCVs);
      setCvs(updatedCVs);
      setIsDialogOpen(false);
      setNewCVName('');
      navigate(`/cv/${newCV.id}`);
    } else {
      toast({
        title: "Error",
        description: "CV name cannot be empty",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCV = (cvId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this CV?')) {
      deleteCV(cvId);
      setCvs(loadCVs());
      toast({
        title: "CV deleted",
        description: "Your CV has been deleted successfully"
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-korean">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">ACAFO CV Builder</h1>
            <p className="text-slate-600">Create professional CVs tailored for the Korean job market</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create New CV
          </Button>
        </div>
      </div>

      {/* CV Grid */}
      <div className="max-w-6xl mx-auto p-6">
        {cvs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-700 mb-2">No CVs created yet</h2>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Get started by creating your first professional CV. Our builder will guide you through each section.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First CV
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cvs.map((cv) => (
              <Card key={cv.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div onClick={() => navigate(`/cv/${cv.id}`)} className="flex-1">
                      <CardTitle className="text-lg font-semibold text-slate-900 mb-1">
                        {cv.name}
                      </CardTitle>
                      <p className="text-sm text-slate-500">
                        Last updated: {new Date(cv.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteCV(cv.id, e)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent onClick={() => navigate(`/cv/${cv.id}`)} className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-slate-600">
                      <User className="h-4 w-4 mr-2" />
                      {cv.personalInfo.fullNameEng || 'No name set'}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {cv.personalInfo.email || 'No email set'}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Briefcase className="h-4 w-4 mr-2" />
                      {cv.experiences.length} work experience(s)
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/cv/${cv.id}/preview`);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create CV Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New CV</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                CV Name
              </Label>
              <Input
                type="text"
                id="name"
                value={newCVName}
                onChange={(e) => setNewCVName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" onClick={handleCreateCV}>
              Create CV
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
