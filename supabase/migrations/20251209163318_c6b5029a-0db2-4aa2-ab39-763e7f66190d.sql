-- Add category column to tasks
ALTER TABLE public.tasks ADD COLUMN category text DEFAULT 'general';

-- Create index for better filtering performance
CREATE INDEX idx_tasks_category ON public.tasks(category);
CREATE INDEX idx_tasks_priority ON public.tasks(priority);
CREATE INDEX idx_tasks_completed ON public.tasks(completed);
CREATE INDEX idx_tasks_deadline ON public.tasks(deadline);