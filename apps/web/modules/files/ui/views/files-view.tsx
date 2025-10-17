'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import { Badge } from '@workspace/ui/components/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { useInfiniteScroll } from '@workspace/ui/hooks/use-infitine-scroll';
import { InfiniteScrollTrigger } from '@workspace/ui/components/infinite-scroll-trigger';
import { usePaginatedQuery } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
import type { PublicFile } from '@workspace/backend/private/files';
import { Button } from '@workspace/ui/components/button';
import {
  FileIcon,
  MoreHorizontalIcon,
  PlusIcon,
  TrashIcon,
} from 'lucide-react';
import { UploadDialog } from '../components/upload-dialog';
import { useState } from 'react';
import { DeleteFileDialog } from '../components/delete-file-dialog';

const FilesView = () => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<PublicFile | null>(null);

  const handleDelete = (file: PublicFile) => {
    setSelectedFile(file);
    setIsDeleteDialogOpen(true);
  };

  const handleFileDeleted = () => {
    setSelectedFile(null);
  };

  const files = usePaginatedQuery(
    api.private.files.list,
    {},
    { initialNumItems: 20 }
  );

  const {
    topElementRef,
    handleLoadMore,
    canLoadMore,
    isLoadingFirstPage,
    isLoadingMore,
  } = useInfiniteScroll({
    status: files.status,
    loadMore: files.loadMore,
    loadSize: 10,
  });

  return (
    <>
      <div className='flex flex-1 min-h-screen flex-col bg-muted p-8'>
        <div className='mx-auto w-full max-w-screen-md'>
          <div className='space-y-2'>
            <h1 className='text-2xl md:text-4xl'>Knowledge Base</h1>
            <p className='text-muted-foreground'>
              Upload and manage documents for your AI assistant to reference.
            </p>
          </div>

          <div className='mt-8 rounded-lg border bg-background'>
            <div className='flex items-center justify-end border-b px-6 py-4'>
              <Button onClick={() => setIsUploadDialogOpen(true)}>
                <PlusIcon />
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='px-6 py-4 font-medium'>Name</TableHead>
                  <TableHead className='px-6 py-4 font-medium'>Type</TableHead>
                  <TableHead className='px-6 py-4 font-medium'>Size</TableHead>
                  <TableHead className='px-6 py-4 font-medium'>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(() => {
                  if (isLoadingFirstPage) {
                    return (
                      <TableRow>
                        <TableCell className='h-24 text-center' colSpan={4}>
                          Loading Files...
                        </TableCell>
                      </TableRow>
                    );
                  }

                  if (files.results.length === 0) {
                    return (
                      <TableRow>
                        <TableCell className='h-24 text-center' colSpan={4}>
                          No Files Found.
                        </TableCell>
                      </TableRow>
                    );
                  }

                  return files.results.map((file: PublicFile) => (
                    <TableRow key={file.id} className='hover:bg-muted/50'>
                      <TableCell className='px-6 py-4'>
                        <div className='flex items-center gap-3'>
                          <FileIcon />
                          {file.name}
                        </div>
                      </TableCell>
                      <TableCell className='px-6 py-4'>
                        <Badge className='uppercase' variant='outline'>
                          {file.type}
                        </Badge>
                      </TableCell>
                      <TableCell className='px-6 py-4 text-muted-foreground'>
                        {file.size}
                      </TableCell>
                      <TableCell className='px-6 py-4'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              className='size-8 p-0'
                              size='sm'
                              variant='ghost'
                            >
                              <MoreHorizontalIcon />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem
                              className='text-destructive'
                              onClick={() => handleDelete(file)}
                            >
                              <TrashIcon className='size-4 mr-2' />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ));
                })()}
              </TableBody>
            </Table>
            {!isLoadingFirstPage && files.results.length > 0 && (
              <div className='border-t'>
                <InfiniteScrollTrigger
                  ref={topElementRef}
                  isLoadingMore={isLoadingMore}
                  canLoadMore={canLoadMore}
                  onLoadMore={handleLoadMore}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <UploadDialog
        open={isUploadDialogOpen}
        onOpenChange={() => setIsUploadDialogOpen(false)}
      />

      <DeleteFileDialog
        open={isDeleteDialogOpen}
        onOpenChange={() => setIsDeleteDialogOpen(false)}
        file={selectedFile}
        onDeleted={handleFileDeleted}
      />
    </>
  );
};

export default FilesView;
