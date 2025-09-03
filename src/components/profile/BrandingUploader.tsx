import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface BrandingUploaderProps {
  userId: string;
  currentLogoUrl?: string | null;
}

export const BrandingUploader = ({ userId, currentLogoUrl }: BrandingUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: userProfile } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_plan, user_type')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const isEligibleForBranding = userProfile?.subscription_plan && 
    ['professional', 'enterprise', 'accountant'].includes(userProfile.subscription_plan);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type - accept common image formats
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a JPG, PNG, GIF, or WebP image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/logo.${fileExt}`;

      // Delete existing logo if it exists
      if (currentLogoUrl) {
        const oldPath = currentLogoUrl.split('/').pop();
        if (oldPath) {
          await supabase.storage.from('branding').remove([`${userId}/${oldPath}`]);
        }
      }

      // Upload new logo
      const { error: uploadError } = await supabase.storage
        .from('branding')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('branding')
        .getPublicUrl(fileName);

      // Update profile with new logo URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ logo_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Invalidate queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['profile'] });

      toast({
        title: "Logo uploaded successfully",
        description: "Your custom logo will now appear on all generated documents",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your logo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (!currentLogoUrl) return;

    setUploading(true);

    try {
      // Extract file path from URL
      const urlParts = currentLogoUrl.split('/');
      const fileName = urlParts.slice(-2).join('/'); // userId/filename

      // Remove from storage
      const { error: deleteError } = await supabase.storage
        .from('branding')
        .remove([fileName]);

      if (deleteError) throw deleteError;

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ logo_url: null })
        .eq('id', userId);

      if (updateError) throw updateError;

      queryClient.invalidateQueries({ queryKey: ['profile'] });

      toast({
        title: "Logo removed",
        description: "Your custom logo has been removed from your profile",
      });
    } catch (error) {
      console.error('Remove error:', error);
      toast({
        title: "Remove failed",
        description: "There was an error removing your logo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  if (!isEligibleForBranding) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Custom Branding
          </CardTitle>
          <CardDescription>
            Add your company logo to all generated documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Custom branding is available with Professional, Enterprise, and Accountant plans</p>
            <p className="text-xs mt-2">Upgrade your subscription to add your company logo to all documents</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Custom Branding
        </CardTitle>
        <CardDescription>
          Add your company logo to all generated documents (PNG, JPG - max 2MB)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentLogoUrl ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <img 
                src={currentLogoUrl} 
                alt="Company logo" 
                className="h-16 w-16 object-contain border rounded"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">Current Logo</p>
                <p className="text-xs text-muted-foreground">This logo will appear on all your documents</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveLogo}
                disabled={uploading}
              >
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragOver 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
          >
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop your logo here, or click to browse
            </p>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Choose File'}
            </Button>
          </div>
        )}

        {/* Always show upload button regardless of current logo */}
        {currentLogoUrl && (
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload New Logo'}
          </Button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="text-xs text-muted-foreground">
          <p>• Supported formats: PNG, JPG, GIF</p>
          <p>• Maximum file size: 2MB</p>
          <p>• For best results, use a square logo with transparent background</p>
        </div>
      </CardContent>
    </Card>
  );
};