'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Form from 'next/form';
import { useSearchParams } from 'next/navigation';

export default function Search() {
  const searchParams = useSearchParams();

  return (
    <Form action="/search" className="w-max-[650px] flex items-center gap-2 relative w-full lg:w-80 xl:w-full">
      <Input
        key={searchParams?.get('q')}
        type="text"
        name="q"  
        placeholder="Search by Title, Author, Keyword or ISBN"
        autoComplete="off"
        defaultValue={searchParams?.get('q') || ''}
        className="text-md w-full font-primary rounded-lg bg-[#EFEFEF] px-4 py-2 text-black placeholder:text-neutral-500 md:text-sm border-none !outline-none ring-0 shadow-none !focus:outline-none !focus:ring-0 !focus:ring-offset-0 !focus-visible:outline-none !focus-visible:ring-0 active:outline-none dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
      />
      <Button className='relative flex items-center text-white font-primary'>
      {/* <div className="absolute right-0 top-0 mr-3 flex h-full items-center"> */}
        <MagnifyingGlassIcon className="h-4" />
      {/* </div> */}
        Search
      </Button>
    </Form>
  );
}

export function SearchSkeleton() {
  return (
    <form className="w-max-[550px] relative w-full lg:w-80 xl:w-full">
      <input
        placeholder="Search for products..."
        className="w-full rounded-lg border bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <MagnifyingGlassIcon className="h-4" />
      </div>
    </form>
  );
}
