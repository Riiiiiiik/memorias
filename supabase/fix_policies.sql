-- Allow UPDATE for everyone (or authenticated users depending on simple setup)
CREATE POLICY "Public Update" ON public.memorias
FOR UPDATE USING (true);

-- Allow DELETE for everyone
CREATE POLICY "Public Delete" ON public.memorias
FOR DELETE USING (true);
