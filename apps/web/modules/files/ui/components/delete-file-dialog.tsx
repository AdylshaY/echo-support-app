'use client';

import { useMutation } from 'convex/react';
import { useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { api } from '@workspace/backend/_generated/api';
import { PublicFile } from '@workspace/backend/private/files';

interface DeleteFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: PublicFile | null;
  onDeleted?: () => void;
}

export const DeleteFileDialog = ({
  open,
  onOpenChange,
  file,
  onDeleted,
}: DeleteFileDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteFile = useMutation(api.private.files.deleteFile);

  const handleDelete = async () => {
    if (!file) return;
    setIsDeleting(true);
    try {
      await deleteFile({ entryId: file.id });
      onDeleted?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting file:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Delete File</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the file "
            <span className='font-medium'>{file?.name}</span>"? This action
            cannot be undone.
          </DialogDescription>
          {file && (
            <div className='py-4'>
              <div className='rounded-lg border bg-muted/50 p-4'>
                <p className='font-medium'>{file.name}</p>
                <p className='text-muted-foreground text-sm'>
                  Type: {file.type.toUpperCase()} | Size: {file.size}
                </p>
              </div>
            </div>
          )}
        </DialogHeader>

        <DialogFooter>
          <Button
            variant='outline'
            disabled={isDeleting}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant='destructive'
            disabled={isDeleting || !file}
            onClick={handleDelete}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
