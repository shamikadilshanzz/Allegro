'use client';

import { useState } from 'react';
import { addSheetMusic } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { SheetMusic } from '@/lib/types';

interface RecommendationToolProps {
  onMusicAdded?: (newItem: SheetMusic) => void;
}

export function RecommendationTool({ onMusicAdded }: RecommendationToolProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await addSheetMusic(formData);
      
      if (result.success) {
        toast({
          title: 'Success!',
          description: result.message,
        });
        
        // Extract the new item ID from the message
        const idMatch = result.message.match(/ID: (\w+)/);
        if (idMatch && onMusicAdded) {
          const newId = idMatch[1];
          const newItem: SheetMusic = {
            id: newId,
            title: formData.get('title') as string,
            composer: formData.get('composer') as string,
            instrument: formData.get('instrument') as string,
            price: parseFloat(formData.get('price') as string),
            imageId: formData.get('imageId') as string,
            downloadUrl: `/api/files/${newId}`,
          };
          onMusicAdded(newItem);
        }
        
        // Reset form
        (e.target as HTMLFormElement).reset();
        setFile(null);
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add sheet music. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Add New Sheet Music</CardTitle>
        <CardDescription>
          Upload sheet music to share with the community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter piece title"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="composer">Composer *</Label>
              <Input
                id="composer"
                name="composer"
                placeholder="Enter composer name"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instrument">Instrument *</Label>
              <Select name="instrument" required disabled={isSubmitting}>
                <SelectTrigger>
                  <SelectValue placeholder="Select instrument" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Piano">Piano</SelectItem>
                  <SelectItem value="Guitar">Guitar</SelectItem>
                  <SelectItem value="Violin">Violin</SelectItem>
                  <SelectItem value="Flute">Flute</SelectItem>
                  <SelectItem value="Cello">Cello</SelectItem>
                  <SelectItem value="Trumpet">Trumpet</SelectItem>
                  <SelectItem value="Saxophone">Saxophone</SelectItem>
                  <SelectItem value="Clarinet">Clarinet</SelectItem>
                  <SelectItem value="Drums">Drums</SelectItem>
                  <SelectItem value="Vocal">Vocal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (USD) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="9.99"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageId">Image ID *</Label>
              <Input
                id="imageId"
                name="imageId"
                placeholder="e.g., music-1"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">PDF File *</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  required
                  disabled={isSubmitting}
                  className="flex-1"
                />
                {file && (
                  <span className="text-sm text-muted-foreground">
                    {file.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Add Sheet Music
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}