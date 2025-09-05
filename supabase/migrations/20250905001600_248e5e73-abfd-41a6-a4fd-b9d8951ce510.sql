-- Create team_invitations table for multi-user access
CREATE TABLE public.team_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inviter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;

-- Create policies for team invitations
CREATE POLICY "Users can view their own invitations" 
ON public.team_invitations 
FOR SELECT 
USING (auth.uid() = inviter_id);

CREATE POLICY "Users can create invitations" 
ON public.team_invitations 
FOR INSERT 
WITH CHECK (auth.uid() = inviter_id);

CREATE POLICY "Users can update their own invitations" 
ON public.team_invitations 
FOR UPDATE 
USING (auth.uid() = inviter_id);

CREATE POLICY "Users can delete their own invitations" 
ON public.team_invitations 
FOR DELETE 
USING (auth.uid() = inviter_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_team_invitations_updated_at
BEFORE UPDATE ON public.team_invitations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();