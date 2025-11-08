-- Create team_invitations table for managing user invitations
CREATE TABLE IF NOT EXISTS public.team_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invitee_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  UNIQUE(inviter_id, invitee_email, status)
);

-- Create team_members table for managing team relationships
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(owner_id, member_id)
);

-- Enable RLS
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Team Invitations Policies
CREATE POLICY "Block anonymous access to team invitations"
ON public.team_invitations
FOR ALL
USING (false)
WITH CHECK (false);

CREATE POLICY "Users can view their sent invitations"
ON public.team_invitations
FOR SELECT
USING (auth.uid() = inviter_id);

CREATE POLICY "Users can view invitations sent to their email"
ON public.team_invitations
FOR SELECT
USING (
  invitee_email = (
    SELECT email FROM auth.users WHERE id = auth.uid()
  )
);

CREATE POLICY "Users can create invitations"
ON public.team_invitations
FOR INSERT
WITH CHECK (
  auth.uid() = inviter_id 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND (
      subscription_plan IN ('professional', 'enterprise', 'accountant')
      OR user_type = 'accountant'
    )
  )
);

CREATE POLICY "Users can update their own invitations"
ON public.team_invitations
FOR UPDATE
USING (auth.uid() = inviter_id);

CREATE POLICY "Invitees can update invitation status"
ON public.team_invitations
FOR UPDATE
USING (
  invitee_email = (
    SELECT email FROM auth.users WHERE id = auth.uid()
  )
);

-- Team Members Policies
CREATE POLICY "Block anonymous access to team members"
ON public.team_members
FOR ALL
USING (false)
WITH CHECK (false);

CREATE POLICY "Owners can view their team members"
ON public.team_members
FOR SELECT
USING (auth.uid() = owner_id);

CREATE POLICY "Members can view their team relationships"
ON public.team_members
FOR SELECT
USING (auth.uid() = member_id);

CREATE POLICY "System can create team members"
ON public.team_members
FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can delete team members"
ON public.team_members
FOR DELETE
USING (auth.uid() = owner_id);

CREATE POLICY "Owners can update team member roles"
ON public.team_members
FOR UPDATE
USING (auth.uid() = owner_id);

-- Create function to handle invitation acceptance
CREATE OR REPLACE FUNCTION public.accept_team_invitation(invitation_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invitation record;
BEGIN
  -- Get invitation details
  SELECT * INTO v_invitation
  FROM team_invitations
  WHERE id = invitation_id
    AND status = 'pending'
    AND expires_at > now()
    AND invitee_email = (SELECT email FROM auth.users WHERE id = auth.uid());
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid or expired invitation';
  END IF;
  
  -- Create team member relationship
  INSERT INTO team_members (owner_id, member_id, role)
  VALUES (v_invitation.inviter_id, auth.uid(), v_invitation.role)
  ON CONFLICT (owner_id, member_id) DO NOTHING;
  
  -- Update invitation status
  UPDATE team_invitations
  SET status = 'accepted',
      updated_at = now()
  WHERE id = invitation_id;
END;
$$;

-- Create trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_team_invitations_updated_at
BEFORE UPDATE ON public.team_invitations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();